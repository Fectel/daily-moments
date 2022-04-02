import {
    IonApp, IonIcon, IonLabel, IonLoading, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs,
} from '@ionic/react';
import React, {useEffect, useState} from 'react';
import {BrowserRouter, Route, Redirect, Switch} from "react-router-dom"
import { IonReactRouter} from "@ionic/react-router";
import LoginPage from "./pages/LoginPage";
import AppTabs from "./AppTabs";
import {AuthContext, useAuthInit} from './auth';
import NotFoundPage from "./pages/NotFoundPage";
import {auth} from "./firebase";
import RegisterPage from "./pages/RegisterPage";




const App: React.FC = () => {
    const {loading, auth} = useAuthInit();



    if (loading) {
        return <IonLoading isOpen={true}/>;
    }
    // console.log('rendering App with authSat:', auth)

    return (
    <IonApp>
        <AuthContext.Provider value={auth}>
            <IonReactRouter>

                <Switch>

                    <Route exact path="/login">
                        <LoginPage />
                    </Route>
                    <Route exact path="/register">
                        <RegisterPage />
                    </Route>
                    <Route path="/my">
                        <AppTabs  />
                    </Route>
                    <Route exact path="/">
                        <Redirect to="/login"/>
                    </Route>
                    <Route>
                        <NotFoundPage />
                    </Route>


                </Switch>

            </IonReactRouter>

        </AuthContext.Provider>


      
    </IonApp>
  );
};

export default App;
