import {
    IonButtons,
    IonContent,
    IonHeader, IonPage, IonBackButton,
    IonTitle,
    IonToolbar, IonLabel, IonInput, IonList, IonItem, IonButton, IonDatetime,
} from '@ionic/react';
import React, {useEffect, useRef, useState} from 'react';
import {firestore, storage} from "../firebase";
import {useAuth} from "../auth";
import {Redirect, useHistory} from "react-router-dom";

async function savePicture(blobUrl, userId){

    const pictureRef = storage.ref(`/users/${userId}/pictures/${Date.now()}`);

    const response = await fetch(blobUrl);
    const blob = await response.blob();
    const snapshot = await pictureRef.put(blob);
    const url = await snapshot.ref.getDownloadURL();
    console.log('save picture ', url);
    return url;


}


const AddEntryPage: React.FC = () => {
    const { userId } = useAuth()
    const history = useHistory();

    const [ pictureUrl, setPictureUrl ] = useState('/assets/placeholder.png');


    const [title, setTitle] = useState('');
    const [ date, setDate ] = useState('')
    const [description, setDescription] = useState('');

    const fileInputRef = useRef<HTMLInputElement>();

    useEffect(() => () => {
        if ( pictureUrl.startsWith('blob:')) {
            URL.revokeObjectURL(pictureUrl);
            console.log('revoked URL: ', pictureUrl);
        }
    }, [pictureUrl])

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {

        if ( event.target.files.length > 0) {
            const file = event.target.files.item(0);
            const pictureUrl = URL.createObjectURL(file);
            console.log('created URL: ', pictureUrl)
            setPictureUrl(pictureUrl)
        }


    };
    const handleSave = async () => {
        const entriesRef = firestore.collection('users').doc(userId)
            .collection('entries');
        const entryData = {date, title, pictureUrl, description};
        if(pictureUrl.startsWith('blob:')){
            entryData.pictureUrl = await savePicture(pictureUrl, userId)
        }
        const entryRef = await entriesRef.add(entryData)


        console.log('saved', entryRef.id);
        history.goBack();
    }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
            <IonButtons slot="start">
                <IonBackButton />
            </IonButtons>
          <IonTitle>Add Entry</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
          <IonList>
              <IonItem>
                  <IonLabel position="stacked">Date</IonLabel>
                  <IonDatetime value={date}
                  onIonChange={(event) => setDate(event.detail.value)}
                  />
              </IonItem>
              <IonItem>
                  <IonLabel position="stacked">Title</IonLabel>
                  <IonInput value={title}
                            onIonChange={(event) => setTitle(event.detail.value)}
                  />
              </IonItem>
              <IonItem>
                  <IonLabel position="stacked">Picture</IonLabel><br />
                  <input type="file" accept="image/*" hidden ref={fileInputRef}
                    onChange={handleFileChange}
                  />
                  <img style={{cursor: "pointer"}} onClick={() => fileInputRef.current.click()} src={pictureUrl} alt=""/>
              </IonItem>

              <IonItem>
                  <IonLabel position="stacked">Description</IonLabel>
                  <IonInput value={description}
                            onIonChange={(event) => setDescription(event.detail.value)}
                  />
              </IonItem>

              <IonItem>
                  <IonButton expand="block" onClick={handleSave}>Save</IonButton>
              </IonItem>
          </IonList>
      </IonContent>
    </IonPage>
  );
};

export default AddEntryPage;
