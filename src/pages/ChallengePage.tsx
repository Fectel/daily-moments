import {
    IonButtons,
    IonContent,
    IonHeader,
    IonPage,
    IonBackButton,
    IonTitle,
    IonToolbar,
    IonButton,
    IonIcon,
    IonFabButton,
    IonFab,
    IonItem,
    IonList,
    IonThumbnail,
    IonImg,
    IonLabel,
    IonCard,
    IonCardTitle, IonCardContent, IonCardHeader, IonCardSubtitle, IonToast,
} from '@ionic/react';
import React, {useEffect, useRef, useState} from 'react';
import {useParams} from "react-router";
import {firestore, storage} from "../firebase";
import {Challenge, Entry, Submission, toChallenge, toEntry, toSubmission} from "../models";
import {useAuth} from "../auth";
import {trash as trashIcon, cameraOutline as cameraIcon, checkmark} from "ionicons/icons"
import { useHistory} from "react-router-dom";
import {formatChallengePageDate, formatDate, formatSubmissionsTimes, toIsoString} from "../date";


interface RouteParams {
        id: string;
    }


async function savePicture(blobUrl, userId, challengeTitle){

    const pictureRef = storage.ref(`/users/${userId}/challenges/${challengeTitle}/pictures/${Date.now()}`);

    const response = await fetch(blobUrl);
    const blob = await response.blob();
    const snapshot = await pictureRef.put(blob);
    const url = await snapshot.ref.getDownloadURL();
    console.log('save picture ', url);
    return url;


}

const ChallengePage: React.FC = () => {

    const history = useHistory();
    const { userId } = useAuth()
    const { id } = useParams<RouteParams>();
    const [challenge, setChallenge] = useState<Challenge>(null);
    const [submission, setSubmission] = useState<Submission>(null);
    const [ secondSubmission, setSecondSubmission ] = useState<Submission>(null)
    const [ thirdSubmission, setThirdSubmission ] = useState<Submission>(null)
    const [ fourthSubmission, setFourthSubmission ] = useState<Submission>(null)
    const [ fifthSubmission, setFifthSubmission ] = useState<Submission>(null)
    const [ submissionsArray, setSubmissionsArray] = useState<Submission[]>([]);

    const [showSubmissionsSuccessToast, setShowSubmissionSuccessToast] = useState(false);
    const [ showSubmissionFailedToast, setShowSubmissionFailedToast ] = useState(false);



    const [ pictureUrl, setPictureUrl ] = useState('');
    const [ currentChallengeDay, setCurrentChallengeDay ] = useState(0)

    const fileInputRef = useRef<HTMLInputElement>();


    useEffect( () => {



        // revokeURL();

        const challengeRef = firestore.collection('users').doc(userId)
            .collection('my-challenges').doc(id);
        challengeRef.get().then((doc) => {
            setChallenge(toChallenge(doc))
        })


        const newDate = new Date();
        const isoSubDate = toIsoString(newDate)
        // console.log(isoSubDate.toISOString())

        const submissionDocPath = isoSubDate.substring(0,10);
         // console.log(submissionDocPath)

        const submissionCollectionRef = firestore.collection('users').doc(userId)
            .collection('my-challenges').doc(id)
            .collection('submissions').doc(submissionDocPath)
            .collection('submissions');

          submissionCollectionRef.onSnapshot(({docs}) => setSubmissionsArray(docs.map(toSubmission)));

         return () => {
             revokeURL();
         }




    },[id, userId, pictureUrl, ]);

    const revokeURL = () => {
        if ( pictureUrl.startsWith('blob:')) {
            URL.revokeObjectURL(pictureUrl);
            console.log('revoked URL: ', pictureUrl);
        }
    }

    const loadSubmissionData = () => {
        const isoSubDate = new Date();

        const submissionDocPath = isoSubDate.toISOString().substring(0,10);
        console.log(submissionDocPath)

        // const submission1Ref = firestore.collection('users').doc(userId)
        //     .collection('my-challenges').doc(id).collection('submissions').doc(submissionDocPath).collection('submissions').doc('submission1');
        // submission1Ref.get().then((doc) => setSubmission(toSubmission(doc)))

        const submissionCollectionRef = firestore.collection('users').doc(userId)
            .collection('my-challenges').doc(id)
               .collection('submissions').doc(submissionDocPath)
               .collection('submissions');
        submissionCollectionRef.onSnapshot(({docs}) => {
                setSubmissionsArray(docs.map(toSubmission))})
    }

    const loadDateDiff = () => {

            let currentDate = new Date();
            let challengeStartDay = new Date(challenge.startDate);

            const diff = Math.abs( (currentDate.getTime()) - (challengeStartDay.getTime()));


            // console.log(Math.floor(diff/ (1000 * 60 * 60 *24)))
            return (Math.floor(diff/ (1000 * 60 * 60 *24)));


        }
    const handleChallengeDelete = async () => {
        const challengeRef = firestore.collection('users').doc(userId)
            .collection('my-challenges').doc(id);

        await challengeRef.delete();
        history.goBack();
    }
    // const handleSubmissionDelete = async () => {
    //     const challengeRef = firestore.collection('users').doc(userId)
    //         .collection('my-challenges').doc(id);
    //
    //     const submissionCollectionRef = firestore.collection('users').doc(userId)
    //         .collection('my-challenges').doc(id)
    //         .collection('submissions').doc(submissionDocPath)
    //         .collection('submissions');
    //
    //         await challengeRef.delete();
    //     history.goBack();
    // }
    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {

        console.log("HandleFile Change")
        if ( event.target.files.length > 0) {
            const file = event.target.files.item(0);
            const pictureUrl2 = URL.createObjectURL(file);
            console.log('created URL: ', pictureUrl2)
            setPictureUrl(pictureUrl2)

            await saveSubmission({pictureUrl2});
        }
    };

    const saveSubmission = async ({pictureUrl2}) => {
        const submissionRef = firestore.collection('users').doc(userId)
            .collection('my-challenges').doc(id).collection('submissions');

        const day = (loadDateDiff() + 1);
        const newDate = new Date();
        const isoSubDate =toIsoString(newDate)
        console.log(isoSubDate.substring(0,10))

        const submissionDocPath = isoSubDate.substring(0,10);
        console.log(submissionDocPath)


        const submissionData = {
            day: day,
            verified: false,
            submissionPictureUrl: "",
            submissionDialog: [],
            submissionTime: isoSubDate,
            submissionDate: submissionDocPath,
        }

        await submissionRef.doc(submissionDocPath).collection('submissions').doc('submission1').get().then(async (sub1) => {
            if (sub1.data() !== undefined) {
                await submissionRef.doc(submissionDocPath).collection('submissions').doc('submission2').get().then(async (sub2) => {
                    if (sub2.data() === undefined && challenge.challengeDailyFreq > 1) {
                        if (pictureUrl2.startsWith('blob:')) {
                            submissionData.submissionPictureUrl = await savePicture(pictureUrl2, userId, challenge.challengeTitle)

                        }
                        await submissionRef.doc(submissionDocPath).collection('submissions').doc('submission2').set(submissionData).then(async x => {
                             return setShowSubmissionSuccessToast(true)
                        })
                    } else if (sub2.data() !== undefined && challenge.challengeDailyFreq > 2) {
                        await submissionRef.doc(submissionDocPath).collection('submissions').doc('submission3').get().then(async (sub3) => {
                            if (sub3.data() === undefined && challenge.challengeDailyFreq > 2){
                                if (pictureUrl2.startsWith('blob:')) {
                                    submissionData.submissionPictureUrl = await savePicture(pictureUrl2, userId, challenge.challengeTitle)
                                }
                                await submissionRef.doc(submissionDocPath).collection('submissions').doc('submission3').set(submissionData).then(async x => {
                                    return setShowSubmissionSuccessToast(true);
                                })

                            }else if (sub3.data() !== undefined && challenge.challengeDailyFreq > 3){
                                await submissionRef.doc(submissionDocPath).collection('submissions').doc('submission4').get().then(async (sub4) => {
                                    if (sub4.data() === undefined && challenge.challengeDailyFreq > 3){
                                        if (pictureUrl2.startsWith('blob:')) {
                                            submissionData.submissionPictureUrl = await savePicture(pictureUrl2, userId, challenge.challengeTitle)
                                        }
                                        await submissionRef.doc(submissionDocPath).collection('submissions').doc('submission4').set(submissionData).then(async x => {
                                            return setShowSubmissionSuccessToast(true);
                                        })

                                    }else if (sub4.data() !== undefined && challenge.challengeDailyFreq > 4){
                                        await submissionRef.doc(submissionDocPath).collection('submissions').doc('submission5').get().then(async (sub5) => {
                                            if (sub5.data() === undefined && challenge.challengeDailyFreq > 4){
                                                if (pictureUrl2.startsWith('blob:')) {
                                                    submissionData.submissionPictureUrl = await savePicture(pictureUrl2, userId, challenge.challengeTitle)
                                                }
                                                await submissionRef.doc(submissionDocPath).collection('submissions').doc('submission5').set(submissionData).then(async x => {
                                                    return setShowSubmissionSuccessToast(true);
                                                })

                                            }else if (sub5.data() !== undefined){
                                                return setShowSubmissionFailedToast(true);
                                            }
                                        })

                                    }else {
                                        return setShowSubmissionFailedToast(true);

                                    }
                                })
                            } else {
                                return setShowSubmissionFailedToast(true);
                            }
                        })
                    } else {
                        return setShowSubmissionFailedToast(true);
                    }
                })

            }
            else if (sub1.data() === undefined){
                if (pictureUrl2.startsWith('blob:')) {
                    submissionData.submissionPictureUrl = await savePicture(pictureUrl2, userId, challenge.challengeTitle)
                    }
                await submissionRef.doc(submissionDocPath).collection('submissions').doc('submission1').set(submissionData).then(async x => {
                    return setShowSubmissionSuccessToast(true)
                })
                }

        })



    }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
            <IonButtons slot="start">
                <IonBackButton />
            </IonButtons>
          <IonTitle>{  <h2>
              {challenge?.challengeTitle}
          </h2>}</IonTitle>
            <IonButtons slot="end">
                <IonButton onClick={handleChallengeDelete} >
                    <IonIcon icon={trashIcon} slot="icon-only" />
                </IonButton>
            </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">


         {/*<h2>*/}
         {/*    {challenge?.challengeTitle}*/}
         {/*</h2>*/}
          {/*<img src={challenge?.pictureUrl} alt={challenge?.title}/>*/}
          <p>
             Weekly Frequency: {challenge?.challengeWeeklyFreq}
          </p>
          <p>
             Daily Frequency: {challenge?.challengeDailyFreq}
          </p>
          <p>
             Submission Reward: <span style={{color: "#31b623"}}>${challenge?.submissionPayout}</span>
          </p>
          <p>
              Invested: <span style={{color: "orange"}}>${challenge?.challengeTotal }</span>
          </p>
          <p>
              Re-Earned: <span style={{color: "orange"}}>${challenge?.totalEarned }</span>
          </p>





              <IonList>
                  {submissionsArray.map(sub => (

                      <IonCard key={sub.submissionTime}>
                          <IonCardHeader>
                              <IonCardTitle className="ion-text-center">
                                      Day {submissionsArray[0].day.toString()}


                              </IonCardTitle>
                              {/*<IonButtons slot="end">*/}
                              {/*    <IonButton onClick={ () => handleSubmissionDelete(sub.submissionId)} >*/}
                              {/*        <IonIcon icon={trashIcon} slot="icon-only" />*/}
                              {/*    </IonButton>*/}
                              {/*</IonButtons>*/}
                          </IonCardHeader>
                                  <IonCardContent>


                                      <IonItem>
                                          <IonCardSubtitle>
                                                  {formatSubmissionsTimes(sub.submissionTime)}

                                          </IonCardSubtitle>
                                      <IonThumbnail >
                                      <IonImg src={sub.submissionPictureUrl}/>
                                      </IonThumbnail>
                                      </IonItem>

                                  </IonCardContent>



                      </IonCard>
                  ))}


              </IonList>


          {/*<IonButton expand="block">Submit<IonIcon className="ion-padding" icon={cameraIcon}/></IonButton>*/}
          <IonFab   vertical="bottom" horizontal="center">
              <IonFabButton onClick={() => fileInputRef.current.click()}>
                  {/*<IonIcon icon={addIcon}/>*/}
                  <input type="file" accept="image/*" hidden ref={fileInputRef}
                         onChange={handleFileChange}
                  />

                  <IonIcon icon={cameraIcon}/>

              </IonFabButton>
          </IonFab>


          <IonToast
          isOpen={showSubmissionsSuccessToast}
          onDidDismiss={() => setShowSubmissionSuccessToast(false)}
          message="Submission Successful!"
          translucent={true}
          duration={600}
          position="bottom"
          color="black"
          header="Submit Challenge"

          />
          <IonToast
              isOpen={showSubmissionFailedToast}
              onDidDismiss={() => setShowSubmissionSuccessToast(false)}
              message="Submission Failed!"
              translucent={true}
              duration={600}

              position="bottom"
              color="black"
              header="Submit Challenge"

          />
      </IonContent>
    </IonPage>
  );
};

export default ChallengePage;
