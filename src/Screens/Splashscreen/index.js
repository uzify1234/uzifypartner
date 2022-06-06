import React ,{useEffect, useState} from 'react'
import { View, Text,Image,Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ADMINREPORTING, DASHBOARD, LOGIN } from '../../Constants/routesName';
import * as firebase from 'firebase';
import db from '../../config/firebase';



const index = () => {
    const {width,height} = Dimensions.get('screen');
    const navigation = useNavigation(); 
    const [authloaded, setauthloaded] = useState(false);
    const [currentuser, setcurrentuser] = useState(null);

    
   const  handleSplash = () => {

    setTimeout(() => {
        console.log("Time ");
    var alreadyattempted = false;
    var user = firebase.auth().currentUser;
     if (user) {
         console.log("Is is creating big problem");
         setcurrentuser(user);
         console.log(user.uid);
         db.collection('partners').doc(user.uid).get().then(data => {
             console.log(data.data());
             if(data.data() == undefined) {

                firebase.auth().signOut().then(() => {
                    console.log("User Logged Out");
                    navigation.navigate(LOGIN);
                }).catch(e => {
                    console.log(e);
                });
             }
            if(data.data().adminaccepted == true) {
                navigation.navigate(DASHBOARD,{userid : user.uid })
                
            }
            else{
                navigation.navigate(ADMINREPORTING,{partnerid : user.uid, number : user.phoneNumber });
            }
            
        }).catch(er => {
            console.log(er);
        })
     }
     else {
         alreadyattempted = true;
         navigation.navigate(LOGIN);
        
         

     }   
     setauthloaded(true);
   

    }, 2000)

    // {authloaded ? 
    //  setTimeout(() => {
    //      console.log("Time   ");
    //      currentuser != null ?  navigation.navigate(DASHBOARD,{userid : currentuser.uid }) : navigation.navigate(LOGIN) ;
   
    //  }, 2000) : "" }

        
                   
  
    }


    useEffect(() => {
        console.log("Yo yo");
        // db.collection('partners').doc('btEU1QcAIMWcb6khAUDqHxJcTGZ2').get().then(partdata => {
        //     db.collection('partners').doc('DDeHBXapSUaGsUznbRtv8f5BIoe2').set(partdata.data()).then(ef => {
        //         db.collection('partners').doc('btEU1QcAIMWcb6khAUDqHxJcTGZ2').collection('certificateimages').doc('certificateimages').get().then(alldata => {
        //             db.collection('partners').doc('DDeHBXapSUaGsUznbRtv8f5BIoe2').collection('certificateimages').doc('certificateimages').set(alldata.data())
        //         })
        //         db.collection('partners').doc('btEU1QcAIMWcb6khAUDqHxJcTGZ2').collection('certificateimages').doc('certificateimages').get().then(alldata => {
        //             db.collection('partners').doc('DDeHBXapSUaGsUznbRtv8f5BIoe2').collection('certificateimages').doc('certificateimages').set(alldata.data())
        //         })
        //     })
        // })

        handleSplash()
    }, [])
    
    return (
        <View>
            <Image source={require('../../assets/images/splash.png')} style={{width : width , height : height,resizeMode : 'contain'}}/>
        </View>
    )
}

export default index
