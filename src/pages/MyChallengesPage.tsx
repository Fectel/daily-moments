import {
    IonButtons,
    IonContent,
    IonHeader,
    IonPage,
    IonBackButton,
    IonTitle,
    IonToolbar,
    IonLabel,
    IonInput,
    IonList,
    IonItem,
    IonButton,
    IonDatetime,
    IonSelect,
    IonSelectOption,
    IonFabButton,
    IonIcon, IonFab,
} from '@ionic/react';
import "./MyChallengesPage.styles.scss"
import React, {useEffect, useRef, useState} from 'react';
import {useAuth} from "../auth";
import { useHistory} from "react-router-dom";
import {add as addIcon, flagOutline, camera as cameraIcon, informationCircle as infoIcon} from "ionicons/icons";
import {formatDate} from "../date";
import {firestore} from "../firebase";
import {Challenge, toChallenge} from "../models";




const MyChallengesPage: React.FC = () => {
    const { userId } = useAuth()
    const history = useHistory();

    const [ challenges, setChallenges ] = useState<Challenge[]>([]);

    const fileInputRef = useRef<HTMLInputElement>();
    const [ pictureUrl, setPictureUrl ] = useState('');


    useEffect(() => {

        const myChallengesRef = firestore.collection('users').doc(userId)
            .collection('my-challenges');
        return myChallengesRef.orderBy('startDate', 'asc').limit(20)
            .onSnapshot(({ docs }) => setChallenges(docs.map(toChallenge)));

    }, [userId])

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {

        console.log("HandleFile Change")
        if ( event.target.files.length > 0) {
            const file = event.target.files.item(0);
            const pictureUrl = URL.createObjectURL(file);
            console.log('created URL: ', pictureUrl)
            setPictureUrl(pictureUrl)
        }


    };

    return (
        <IonPage >
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton />
                    </IonButtons>
                    <IonTitle>Challenges</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent >
                    <IonList className="my-challenges-list"  >
                        {challenges.map((challenge) =>

                                <IonItem

                                    className="challenge-title-container"
                                    button
                                    key={challenge.challengeId}


                                    routerLink={`/my/challenges/view/${challenge.challengeId}`}
                                    lines="none">

                                    <IonLabel  className="challenge-title-label" >
                                        <h3>{challenge.challengeTitle}</h3>
                                        {/*<h2>{challenge.totalEarned}</h2>*/}
                                        {/*<h3>{entry.title}</h3>*/}
                                    </IonLabel>
                                    {/*<IonItem  lines="none">*/}
                                    {/*    <IonLabel onClick={() => fileInputRef.current.click()} className="submission-icon-and-earnings-container"  slot="end">*/}

                                    {/*        <input type="file" accept="image/*" hidden ref={fileInputRef}*/}
                                    {/*               onChange={handleFileChange}*/}
                                    {/*        />*/}
                                    {/*        <IonIcon style={{width: "100%"}} icon={cameraIcon}/>*/}
                                    {/*        /!*<IonLabel  ><p>${challenge.submissionPayout}</p></IonLabel>*!/*/}

                                    {/*    </IonLabel>*/}


                                    {/*</IonItem>*/}
                                </IonItem>
                        )}



                    </IonList>

                <IonFab   vertical="bottom" horizontal="center">
                    <IonFabButton onClick={() => fileInputRef.current.click()}>
                        {/*<IonIcon icon={addIcon}/>*/}
                        <input type="file" accept="image/*" hidden ref={fileInputRef}
                               onChange={handleFileChange}
                        />

                        <IonIcon icon={cameraIcon}/>

                    </IonFabButton>
                </IonFab>
                <IonFab  vertical="bottom" horizontal="end">
                    <IonFabButton  routerLink="/my/challenges/add">
                        <IonIcon icon={addIcon}/>

                        <IonIcon icon={flagOutline}/>

                    </IonFabButton>
                </IonFab>
            </IonContent>
        </IonPage>
    );
};

export default MyChallengesPage;
