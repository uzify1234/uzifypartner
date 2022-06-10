import React , {useEffect , useState} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Text, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import {CATEGORIESPICKER, LOGIN, REGISTER,CITIESPICKER, PINCODESPICKER, GENERALINFO, BANKDETAILS, WORKIMAGESPORTAL,WORKEACHALBUM, DATAFILLCOMPLETED, ADMINREPORTING, DASHBOARD, CERTIFICATEIMAGESPORTAL, CERTIFICATEEACHALBUM, PROFILE, EDITPROFILE, UPCOMINGBOOKINGS, VIEWBOOKING, PASTBOOKINGS, CREDITSSCREEN, RECHARGESCREEN, MARKLEAVE, SPLASHSCREEN, PARTICULARBOOKING, LOGINCLONE} from '../Constants/routesName';
import Login from '../Screens/Login';
import Loginclone from '../Screens/Loginclone';
import Register from '../Screens/Register';
import Categoriespicker from '../Screens/Categoriespicker';
import Citiespicker from '../Screens/Citiespicker';
import Pincodespicker from '../Screens/Pincodespicker';
import Generalinfo from '../Screens/Generalinfo';
import Bankdetails from '../Screens/Bankdetails';
import Workimagesportal from '../Screens/Workimagesportal';
import Workeachalbum from '../Screens/Workeachalbum';
import Certificateimagesportal from '../Screens/Certificateimagesportal';
import Certificateeachalbum from '../Screens/Certificateeachalbum';
import Datafillcompleted from '../Screens/Datafillcompleted';
import Adminreporting from '../Screens/Adminreporting';
import Dashboard from '../Screens/Dashboard';
import Profile from '../Screens/Profile';
import Editprofile from '../Screens/Editprofile';
import Upcomingbookings from '../Screens/Upcomingbookings';
import Viewbooking from '../Screens/Viewbooking';
import Pastbookings from '../Screens/Pastbookings';
import Creditsscreen from '../Screens/Creditsscreen';
import Rechargescreen from '../Screens/Rechargescreen';
import Markleave from '../Screens/Markleave';
import * as firebase from 'firebase';
import Splashscreen from '../Screens/Splashscreen';
import ParticularBooking from '../Screens/ParticularBooking';












const AuthNavigator = () => {
    const AuthStack = createStackNavigator();


    return (
        
        <AuthStack.Navigator initialRouteName={SPLASHSCREEN} screenOptions={{headerShown:false}}>
            <AuthStack.Screen name={LOGIN} component={Login} ></AuthStack.Screen> 
            <AuthStack.Screen name={LOGINCLONE} component={Loginclone} ></AuthStack.Screen> 
            <AuthStack.Screen name={REGISTER} component={Register} ></AuthStack.Screen> 
            <AuthStack.Screen name={CATEGORIESPICKER} component={Categoriespicker} ></AuthStack.Screen>
            <AuthStack.Screen name={CITIESPICKER} component={Citiespicker} ></AuthStack.Screen>  
            <AuthStack.Screen name={PINCODESPICKER} component={Pincodespicker} ></AuthStack.Screen>  
            <AuthStack.Screen name={GENERALINFO} component={Generalinfo} ></AuthStack.Screen>
            <AuthStack.Screen name={BANKDETAILS} component={Bankdetails} ></AuthStack.Screen>
            <AuthStack.Screen name={WORKIMAGESPORTAL} component={Workimagesportal} ></AuthStack.Screen>
            <AuthStack.Screen name={WORKEACHALBUM} component={Workeachalbum} ></AuthStack.Screen>
            <AuthStack.Screen name={CERTIFICATEIMAGESPORTAL} component={Certificateimagesportal} ></AuthStack.Screen>
            <AuthStack.Screen name={CERTIFICATEEACHALBUM} component={Certificateeachalbum} ></AuthStack.Screen>
            <AuthStack.Screen name={DATAFILLCOMPLETED} component={Datafillcompleted} ></AuthStack.Screen>
            <AuthStack.Screen name={ADMINREPORTING} component={Adminreporting} ></AuthStack.Screen>
            <AuthStack.Screen name={DASHBOARD} component={Dashboard} ></AuthStack.Screen>
            <AuthStack.Screen name={PROFILE} component={Profile} ></AuthStack.Screen>
            <AuthStack.Screen name={EDITPROFILE} component={Editprofile} ></AuthStack.Screen>
            <AuthStack.Screen name={UPCOMINGBOOKINGS} component={Upcomingbookings} ></AuthStack.Screen>
            <AuthStack.Screen name={VIEWBOOKING} component={Viewbooking} ></AuthStack.Screen>
            <AuthStack.Screen name={PASTBOOKINGS} component={Pastbookings} ></AuthStack.Screen>
            <AuthStack.Screen name={CREDITSSCREEN} component={Creditsscreen} ></AuthStack.Screen>
            <AuthStack.Screen name={RECHARGESCREEN} component={Rechargescreen} ></AuthStack.Screen>
            <AuthStack.Screen name={MARKLEAVE} component={Markleave} ></AuthStack.Screen>
            <AuthStack.Screen name={SPLASHSCREEN} component={Splashscreen} ></AuthStack.Screen>
            <AuthStack.Screen name={PARTICULARBOOKING} component={ParticularBooking} ></AuthStack.Screen>






        </AuthStack.Navigator>

    )
}

export default AuthNavigator