import {IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs,
} from '@ionic/react';
import React, {useEffect, useState} from 'react';
import HomePage from "./pages/HomePage";
import SettingsPage from "./pages/SettingsPage";
import {useHistory, Route, Redirect } from "react-router-dom"
import { accessibilityOutline as profileIcon,home as homeIcon, settings as settingsIcon, flagOutline} from "ionicons/icons"
import EntryPage from "./pages/EntryPage";
import {useAuth} from "./auth";
import AddEntryPage from "./pages/AddEntryPage";
import AddChallengePage from "./pages/AddChallengePage";
import MyChallengesPage from "./pages/MyChallengesPage";
import ChallengePage from "./pages/ChallengePage";



const AppTabs: React.FC = () => {

    const { loggedIn } = useAuth();

    // const history = useHistory();
    // useEffect(() => {
    //
    //    if ( !loggedIn ){
    //     history.push("/login")
    //    }
    //    console.log(loggedIn)
    //    console.log("HELLOOOOOOO")
    //
    //
    // },[loggedIn])

  return (
            <IonTabs>

                <IonRouterOutlet>

                    <Route exact path="/my/settings">
                        <SettingsPage />
                    </Route>

                    <Route exact path="/my/entries">
                         <HomePage/>
                    </Route>
                    <Route exact path="/my/entries/add">
                        <AddEntryPage/>
                    </Route>
                    <Route exact path="/my/challenges">
                        <MyChallengesPage/>
                    </Route>
                    <Route exact path="/my/challenges/add">
                        <AddChallengePage/>
                    </Route>

                    <Route exact path="/my/entries/view/:id">
                        <EntryPage />
                    </Route>
                    <Route exact path="/my/challenges/view/:id">
                        <ChallengePage />
                    </Route>


                </IonRouterOutlet>

                <IonTabBar slot="bottom">

                    <IonTabButton tab="home" href="/my/entries">

                        <IonIcon icon={profileIcon}/>
                        <IonLabel>Home</IonLabel>

                    </IonTabButton>
                    <IonTabButton tab="challenges" href="/my/challenges">

                        <IonIcon icon={flagOutline}/>
                        <IonLabel>Challenges</IonLabel>

                    </IonTabButton>

                    <IonTabButton tab="settings" href="/my/settings">

                        <IonIcon icon={settingsIcon}/>

                        <IonLabel>Settings</IonLabel>

                    </IonTabButton>

                </IonTabBar>
            </IonTabs>

  );
};

export default AppTabs;
