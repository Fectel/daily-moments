import {
    IonButtons,
    IonContent,
    IonHeader, IonPage, IonBackButton,
    IonTitle,
    IonToolbar, IonButton, IonIcon,
} from '@ionic/react';
import React, {useEffect, useState} from 'react';
import {useParams} from "react-router";
import { firestore } from "../firebase";
import { Entry, toEntry} from "../models";
import {useAuth} from "../auth";
import { trash as trashIcon } from "ionicons/icons"
import { useHistory} from "react-router-dom";
import {formatDate} from "../date";


interface RouteParams {
        id: string;
    }

const EntryPage: React.FC = () => {

    const history = useHistory();
    const { userId } = useAuth()
    const { id } = useParams<RouteParams>();
    const [entry, setEntry] = useState<Entry>();

    useEffect(() => {

        const entryRef = firestore.collection('users').doc(userId)
            .collection('entries').doc(id);
        entryRef.get().then((doc) => setEntry(toEntry(doc)))
    },[id, userId]);


    const handleDelete = async () => {
        const entryRef = firestore.collection('users').doc(userId)
            .collection('entries').doc(id);

        await entryRef.delete();
        history.goBack();
    }
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
            <IonButtons slot="start">
                <IonBackButton />
            </IonButtons>
          <IonTitle>{formatDate(entry?.date)}</IonTitle>
            <IonButtons slot="end">
                <IonButton onClick={handleDelete} >
                    <IonIcon icon={trashIcon} slot="icon-only" />
                </IonButton>
            </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">

         <h2>
             {entry?.title}
         </h2>
          <img src={entry?.pictureUrl} alt={entry?.title}/>
          <p>
              {entry?.description}
          </p>
      </IonContent>
    </IonPage>
  );
};

export default EntryPage;
