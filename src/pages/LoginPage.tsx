import {
    IonButton,
    IonContent,
    IonHeader, IonInput, IonItem, IonLabel, IonList, IonLoading, IonPage, IonRouterLink, IonText,
    IonTitle,
    IonToolbar,
} from '@ionic/react';
import React, {useContext, useState} from 'react';
import {Redirect} from "react-router-dom";
import {useAuth} from "../auth";
import {auth} from "../firebase"


const LoginPage: React.FC = () => {

    const {loggedIn} = useAuth();
    const [ email, setEmail] = useState('');
    const [ password, setPassword] = useState('')
    const [ status, setStatus ] = useState({loading: false, error: false});



    if( loggedIn ) {
        return <Redirect to="/my/entries"/>;
    }
    const handleLogin = async () => {

        try {
            setStatus({loading: false, error: false});
            console.log("Should login with ", email, password)
            const credential = await auth.signInWithEmailAndPassword(email,password)
            console.log('credential: ', credential);
        } catch (error) {
            setStatus({loading: false, error: true});
            console.log('error', error.message);
        }

    };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
          <IonList>
              <IonItem>
                  <IonLabel position="stacked">Email</IonLabel>
                  <IonInput type="email"
                    onIonChange={(event) => setEmail(event.detail.value)}
                    />
              </IonItem>
              <IonItem>
                  <IonLabel position="stacked">Password</IonLabel>
                  <IonInput type="password"
                    onIonChange={(event) => setPassword(event.detail.value)}
                  />
              </IonItem>
          </IonList>
          {status.error && (
              <IonText color="danger">Invalid credentials</IonText>

          )}
          <IonButton onClick={handleLogin} expand="block">Login</IonButton>
          <IonButton expand="block" fill="clear" routerLink="/register">
              Don't have an account?
          </IonButton>
          <IonLoading isOpen={status.loading}/>
      </IonContent>
    </IonPage>
  );
};

export default LoginPage;
