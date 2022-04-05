import {
    IonContent, IonImg, IonThumbnail, IonFab, IonFabButton,
    IonHeader, IonIcon, IonItem, IonLabel, IonList, IonPage, IonRouterLink,
    IonTitle,
    IonToolbar,
} from '@ionic/react';
import React, {useEffect, useState} from 'react';
import { firestore } from "../firebase";
import { Challenge, toChallenge} from "../models";
import {useAuth} from "../auth";
import {add as addIcon, options} from 'ionicons/icons'
import Profile from "../components/profile/profile";



const HomePage: React.FC = () => {

    const { userId } = useAuth();
    const [ challenges, setChallenges ] = useState<Challenge[]>([]);
    useEffect(() => {

        const myChallengesRef = firestore.collection('users').doc(userId)
            .collection('my-challenges');
        return myChallengesRef.orderBy('startDate', 'asc').limit(7)
         .onSnapshot(({ docs }) => setChallenges(docs.map(toChallenge)));

    }, [userId])


  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Home</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">


          <Profile />
          <IonFab  vertical="bottom" horizontal="end">
              <IonFabButton routerLink="/my/entries/add">
                  <IonIcon icon={addIcon}/>
              </IonFabButton>
          </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default HomePage;
