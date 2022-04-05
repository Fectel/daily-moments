import {
    IonButtons,
    IonContent,
    IonHeader, IonPage, IonBackButton,
    IonTitle,
    IonToolbar, IonLabel, IonInput, IonList, IonItem, IonButton, IonDatetime, IonSelect, IonSelectOption,
} from '@ionic/react';
import React, {useEffect, useRef, useState} from 'react';
import {useAuth} from "../auth";
import { useHistory} from "react-router-dom";
import {firestore, storage} from "../firebase";
import myChallengesPage from "./MyChallengesPage";




const AddChallengePage: React.FC = () => {
    const { userId } = useAuth()
    const history = useHistory();



    const [title, setTitle] = useState('');
    const [ date, setDate ] = useState('')
    const [description, setDescription] = useState('');

    const [ challengeTitle, setChallengeTitle ] = useState('');
    const [ challengeWeeklyFreq, setChallengeWeeklyFrequency ] = useState(0);
    const [ challengeDailyFreq, setChallengeDailyFrequency ] = useState(0);
    const [ submissionPayout, setSubmissionPayout ] = useState(0);
    const [ submissionType, setSubmissionType ] = useState('');
    const [ challengeTotal, setChallengeTotal ] = useState(0);


    let currentDate = new Date();
    let monthDate = new Date();
    monthDate.setHours(730)
    console.log(currentDate.toDateString(), " - ", monthDate.toDateString())

    const startDate = currentDate.toDateString();
    const endDate = monthDate.toDateString();
    let challengeTotalVar;

    function renderTotal(){
        const challengeTotalVar = challengeWeeklyFreq * challengeDailyFreq * 4 * submissionPayout;
        setChallengeTotal(challengeTotalVar);
        console.log(challengeTotalVar);

    }

    useEffect(() => {
        console.log(
            "challengeTitle:", title,
            "weeklyFreq:",challengeWeeklyFreq,
            "dailyFreq:", challengeDailyFreq,
            "submissionPayout:", submissionPayout,
            "challengeTotal:", challengeTotal
            )
        if (challengeWeeklyFreq > 0 && challengeDailyFreq > 0 && submissionPayout > 0){
            setChallengeTotal(challengeWeeklyFreq * challengeDailyFreq * submissionPayout * 4)
        }

    }, [title,challengeDailyFreq, challengeWeeklyFreq,submissionPayout, challengeTotal])

    const createChallenge = async () => {
        const myChallengesRef = firestore.collection('users').doc(userId)
            .collection('my-challenges');
        const challengeData = {
            challengeTitle: title,
            challengeWeeklyFreq,
            challengeDailyFreq,
            submissionPayout,
            challengeTotal,
            startDate: currentDate.toISOString(),
            endDate: monthDate.toISOString(),
            totalEarned: 0,
            submitted: 0,

        };



        const challengeRef = await myChallengesRef.add(challengeData)
            .then((docRef) => {
                console.log('Challenge Created', docRef.id);
                myChallengesRef.doc(docRef.id).set({challengeId: docRef.id, ...challengeData})

            });
        history.goBack();
    }
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
            <IonButtons slot="start">
                <IonBackButton />
            </IonButtons>
          <IonTitle>Create Challenge</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
          <IonList >

              <IonItem>
                  <IonLabel  >Challenge Title: </IonLabel>
                  <IonInput
                      required={true}
                      value={title}
                            onIonChange={(event) => setTitle(event.detail.value)}
                  />
              </IonItem>


                  <IonItem>
                      <IonLabel> Weekly Frequency</IonLabel>
                      <IonSelect value={challengeWeeklyFreq} placeholder="0"
                                 onIonChange={(e) => setChallengeWeeklyFrequency(e.detail.value)}
                                 interface="popover">
                          <IonSelectOption>1</IonSelectOption>
                          <IonSelectOption>2</IonSelectOption>
                          <IonSelectOption>3</IonSelectOption>
                          <IonSelectOption>4</IonSelectOption>
                          <IonSelectOption>5</IonSelectOption>
                          <IonSelectOption>6</IonSelectOption>
                          <IonSelectOption>7</IonSelectOption>
                      </IonSelect>
                  </IonItem>
              <IonItem>
                      <IonLabel> Daily Frequency</IonLabel>
                      <IonSelect value={challengeDailyFreq} placeholder="0"
                                 onIonChange={(e) => setChallengeDailyFrequency(e.detail.value)}
                                 interface="popover">
                          <IonSelectOption>1</IonSelectOption>
                          <IonSelectOption>2</IonSelectOption>
                          <IonSelectOption>3</IonSelectOption>
                          <IonSelectOption>4</IonSelectOption>
                          <IonSelectOption>5</IonSelectOption>
                      </IonSelect>
                  </IonItem>

              <IonItem>
                  <IonLabel>Submission Payout </IonLabel>
                  <span>$</span>
                  <IonSelect value={submissionPayout} placeholder="0"
                             onIonChange={(e) => setSubmissionPayout(e.detail.value)}
                             interface="popover">
s                      <IonSelectOption>9</IonSelectOption>
                      <IonSelectOption>27</IonSelectOption>
                      <IonSelectOption>81</IonSelectOption>
                  </IonSelect>
              </IonItem>
              {/*<IonItem>*/}
              {/*    <IonLabel>Submission Type </IonLabel>*/}
              {/*    <IonSelect value={submissionType} placeholder=""*/}
              {/*               onIonChange={(e) => setSubmissionType(e.detail.value)}*/}
              {/*               interface="popover">*/}
              {/*        <IonSelectOption>Image</IonSelectOption>*/}
              {/*        <IonSelectOption>Time</IonSelectOption>*/}
              {/*        <IonSelectOption>Reps</IonSelectOption>*/}
              {/*    </IonSelect>*/}
              {/*</IonItem>*/}

              <IonItem>
                  <IonLabel>Total: </IonLabel>

                      {challengeTotal !== 0 &&(
                      <IonLabel>${challengeTotal}</IonLabel>
                          )}


              </IonItem>

              {/*<IonItem>*/}
              {/*    <IonLabel>Challenge Dates</IonLabel>*/}
              {/*</IonItem>*/}


              <IonItem>
                      <IonLabel className="ion-padding">{startDate} - {endDate}</IonLabel>

                  </IonItem>

                  <IonButton expand="block" onClick={createChallenge}>Join Challenge</IonButton>
          </IonList>
      </IonContent>
    </IonPage>
  );
};

export default AddChallengePage;
