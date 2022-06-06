import { StatusBar } from 'expo-status-bar';
import React, {useState , useEffect,useRef} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Decider from './Navigations/Decider';
import * as Font from 'expo-font';
// import {Permissions,Notifications} from 'expo';
import db from './config/firebase';
import * as firebase from 'firebase';
import * as TaskManager from 'expo-task-manager';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { CREDITSSCREEN, PARTICULARBOOKING, RECHARGESCREEN, UPCOMINGBOOKINGS } from './Constants/routesName';


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});


const index = () => {

  const [fontloaded, setfontloaded] = useState(false);
const [authloaded, setauthloaded] = useState(false);
const [currentuser, setcurrentuser] = useState(null);
const [finalstatusnotif, setfinalstatusnotif] = useState(null);
const [ExpoPushToken, setExpoPushToken] = useState(null);
const [notification, setNotification] = useState(false);
const notificationListener = useRef();
const responseListener = useRef();
const navigationRef = useRef();

  const getFonts = async () => {
    await Font.loadAsync({
      
      'Gotham-Bold' : require('../assets/fonts/Gotham-Bold.otf'),
      'Gotham-Light' : require('../assets/fonts/Gotham-Light.otf'),
      'Rubik-Bold' : require('../assets/fonts/Rubik-Bold.ttf'),
      'Rubik-Light' : require('../assets/fonts/Rubik-Light.ttf'),
      'Rubik-Medium' : require('../assets/fonts/Rubik-Medium.ttf'),
      'Rubik-ExtraBold' : require('../assets/fonts/Rubik-ExtraBold.ttf')


    });
    setfontloaded(true);
  }





  useEffect(() => {
  
    getFonts();
    const BACKGROUND_NOTIFICATION_TASK = 'BACKGROUND-NOTIFICATION-TASK';

TaskManager.defineTask(BACKGROUND_NOTIFICATION_TASK, ({ data, error, executionInfo }) => {
  console.log('Received a notification in the background!');
  alert("Recived Notification");
  // Do something with the notification data
});

Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      var whole = response.notification.request.content.data;





      if(whole.type == "upcomingbookingalert" || whole.type == "bookingstartedalert" || whole.type == "bookingpartnerallocated" || whole.type == "bookingcompletedfeedbackalert" || whole.type == "bookingcancelledbypartneralert" || whole.type == "bookingcancelledbycustomeralert") {
        navigationRef.current?.navigate(PARTICULARBOOKING,{bookingid : whole.bookingid});
      }
      else if(whole.type == "bookingalert" ) {
        navigationRef.current?.navigate(UPCOMINGBOOKINGS);
      }

      else if(whole.type == "lowcreditsalert" ) {
        navigationRef.current?.navigate(CREDITSSCREEN);
      }
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
    
  }, [])


  async function registerForPushNotificationsAsync() {
    let token;
    if (Constants.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      setfinalstatusnotif(existingStatus);
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
    } else {
      setfinalstatusnotif('');
      alert('Must use physical device for Push Notifications');
    }
  
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  
    return token;
  }


  const CustomtextProps = { 
    style: { 
      fontFamily: 'Gotham-Bold'
    }
  }

  return (
    <View style={styles.container}>
      {fontloaded ? <Decider navigationRef={navigationRef}/> : <View></View>}
    </View>
  );
}
export default index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
