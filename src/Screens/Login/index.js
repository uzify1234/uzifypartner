import React , {useState , useEffect} from 'react'
import { View, Text , ScrollView, Image , Dimensions, SafeAreaView, TextInput, TouchableOpacity,StyleSheet } from 'react-native'
import { BACKGROUNDCOLOR, DEEPPINK, GREYISH, topgapforheading } from '../../Constants/Colors.js';
import styles from './style.js';
import { useNavigation } from '@react-navigation/native';
import { ADMINREPORTING, BLANK, CATEGORIESPICKER, DASHBOARD, REGISTER , TAB } from '../../Constants/routesName.js';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Ionicons } from '@expo/vector-icons';
import db  , {firebaseApp} from '../../config/firebase';
import { FirebaseRecaptchaVerifierModal, FirebaseRecaptchaBanner } from 'expo-firebase-recaptcha';
import * as firebase from 'firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Loader from '../../components/Loader';
import Customtext from '../../components/Customtext';
import { useRef } from 'react';
import { Alert } from 'react-native';
import { Pressable } from 'react-native';











const index = () => {
    const [loadingscreen, setloadingscreen] = useState(false);
    const [attempteduser, setattempteduser] = useState(null);
    const recaptchaVerifier = React.useRef(null);
    const [verificationId, setVerificationId] = React.useState();
    const [verificationCode, setVerificationCode] = React.useState();
    const firebaseConfig = firebase.apps.length ? firebase.app().options : undefined;
    const [partnerauthid, setpartnerauthid] = useState("xyz123");

    const [message, showMessage] = React.useState(
        !firebaseConfig || Platform.OS === 'web'
          ? {
              text:
                'To get started, provide a valid firebase config in App.js and open this snack on an iOS or Android device.',
            }
          : undefined
      );
      const attemptInvisibleVerification = true;
    const {width,height} = Dimensions.get('screen');
    
    const [number, onChangeNumber] = React.useState(null);
    const [dig1, onChangeDig1] = React.useState(null);
    const [dig2, onChangeDig2] = React.useState(null);
    const [dig3, onChangeDig3] = React.useState(null);
    const [dig4, onChangeDig4] = React.useState(null);
    const [dig5, onChangeDig5] = React.useState(null);
    const [dig6, onChangeDig6] = React.useState(null);

    const ref_input1 = useRef();
    const ref_input2 = useRef();
    const ref_input3 = useRef();
    const ref_input4 = useRef();
    const ref_input5 = useRef();
    const ref_input6 = useRef();

    const [isfirsttimeuser, setIsfirsttimeuser] = React.useState(false);



    const navigation = useNavigation(); 
    const [otpshow, setotpshow] = useState(false);


    const checkforblockeduser = () => {
        if(number.length !== 10) {
            showMessage({text : "Make sure you enter 10 digit mobile number",color : DEEPPINK});
        }
        else {
        var customnumber = "+91"+number;

        db.collection("partners").where("mobilenumber", "==", customnumber).get().then(alldatas => {
            if(alldatas.size == 0) {
                console.log("Very first Time");
                setIsfirsttimeuser(true);
                logintapped();
            }
            alldatas.docs.map(eachuser => {
                if(eachuser.data().isactive == false) {
                    console.log("OOps blocked");
                    Alert.alert(
                        "Sorry this profile is currently not active",
                        "",
                        [
                          {
                            text: "Ok",
                            onPress: () => {},
                            style: "cancel"
                          }
                          
                        ]
                      );
                }
                else {
                    console.log(eachuser.data());
                    setIsfirsttimeuser(false);
                    var currentuser = {userid : eachuser.id , profile : eachuser.data()};
                    setattempteduser(currentuser);
                    logintapped();
                }

            })
        })
        }
    }


const checkforexistinguser = () => {
    if(number.length !== 10) {
        showMessage({text : "Make sure you enter 10 digit mobile number",color : DEEPPINK});
    }
    else {
    var customnumber = "+91"+number;
    console.log("Hey "+customnumber);
    setloadingscreen(true);
    db.collection("partners").where("mobilenumber", "==", customnumber)
    .get()
    .then((querySnapshot) => {
        console.log("Query snapshot is");
        setIsfirsttimeuser(true);
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            setIsfirsttimeuser(false);
            var currentuser = {userid : doc.id , profile : doc.data()};
            setattempteduser(currentuser);
            console.log(doc.id, " => ", doc.data());
        });
        logintapped();
    })
    .catch((error) => {
        
        logintapped();
        console.log("Error getting documents: ", error);
    });
    }
}


const modifyasyncstorage = (user) => {

    console.log("checking for isfirsttimeuser "+isfirsttimeuser);
    console.log(attempteduser);
    setotpshow(false);
    onChangeDig1("");
        onChangeDig2("");
        onChangeDig3("");
        onChangeDig4("");
        onChangeDig5("");
        onChangeDig6("");

    if(isfirsttimeuser || isfirsttimeuser == "true")
    {
        console.log("This is the one");
        navigation.navigate(CATEGORIESPICKER,{userid : user.uid , number : "+91"+number,partnerid : user.uid});
    }
    else if(attempteduser.profile.adminaccepted == undefined ||  attempteduser.profile.adminaccepted == false || attempteduser.profile.adminaccepted == 'false') {
        navigation.navigate(ADMINREPORTING,{partnerid : user.uid, number : "+91"+number });
    }
    else {
        console.log("Helllo");
        // navigation.navigate(BLANK);
        // navigation.navigate(TAB);
        navigation.navigate(DASHBOARD,{userid : user.uid , number : "+91"+number});

    }

    // try {
    //     AsyncStorage.setItem('userid', user.uid);
    //     console.log("Attempted user is ");
    //     console.log(user.uid);
    //     setotpshow(false);
    //     onChangeDig1("");
    //     onChangeDig2("");
    //     onChangeDig3("");
    //     onChangeDig4("");
    //     onChangeDig5("");
    //     onChangeDig6("");
    //     showMessage("");
        
    //     if(isfirsttimeuser)
    //     {
    //         navigation.navigate(REGISTER,{userid : user.uid , number : user.phoneNumber});
    //     }
    //     else {
    //         navigation.navigate(BLANK);
    //         // navigation.navigate(TAB);
    //     }
    //   } catch (e) {
    //       console.log(e);
    //     // saving error
    //   }
}



    const nexttapped = async () => {
        var verificationCode = dig1+dig2+dig3+dig4+dig5+dig6;
        console.log("Passing code is "+verificationCode+" and first time user is "+isfirsttimeuser);
        try {
            const credential = firebase.auth.PhoneAuthProvider.credential(
              verificationId,
              verificationCode
            );
            setloadingscreen(true);
            await firebase.auth().signInWithCredential(credential).then((userCredential) => {
            console.log("USER IS");
            console.log(userCredential.user);
            modifyasyncstorage(userCredential.user);
            setloadingscreen(false);
       
           
            
            
            showMessage({ text: 'Phone authentication successful 👍' });
            });
            
          } catch (err) {
              console.log(err);
              setloadingscreen(false);
            showMessage({ text: `${err.message}`, color: DEEPPINK });
          }
        
        
    }


    const skiplogin = () => {
        navigation.navigate(TAB);
    }

    const logintapped = async (currentuser = null) => {
        
        var customnumber = "+91"+number;
        try {
            setloadingscreen(true);
            const phoneProvider = new firebase.auth.PhoneAuthProvider();
            const verificationId = await phoneProvider.verifyPhoneNumber(
                customnumber,
              recaptchaVerifier.current
            );
            
            setVerificationId(verificationId);
            console.log("Done "+verificationId);
            setotpshow(true);
            showMessage({
              text: 'Verification code has been sent to '+customnumber,
            });
            setloadingscreen(false);
          } catch (err) {
              console.log(err.message);
              setloadingscreen(false);
            showMessage({ text: `Error: ${err.message}`, color: 'red' });
          }
        
  

        
    }
    useEffect(() => {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                console.log("Is is creating a mess")
                // navigation.navigate(DASHBOARD,{userid : user.uid , number : "+91"+number});
            }
        })
    }, [])
   
      

    return (
        <KeyboardAwareScrollView style={{backgroundColor : BACKGROUNDCOLOR }} keyboardShouldPersistTaps={'handled'}>
           {loadingscreen == true && <Loader visible={loadingscreen}/>} 
             <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={firebaseConfig}
        attemptInvisibleVerification={attemptInvisibleVerification}
        androidHardwareAccelerationDisabled
        />
            <View style={{backgroundColor : BACKGROUNDCOLOR , height : height }}>
    
                <View style={{position : 'relative' }}>
                <TouchableOpacity style={{ width : 60 ,marginTop : topgapforheading}} onPress={() =>  navigation.pop()}>
                    <View style={{borderRadius : 10 , padding : 10}}>
                    
                    <Ionicons name="arrow-back-circle" size={36} color={DEEPPINK} />
                    </View>
                </TouchableOpacity>
                    <Image source={require('../../assets/images/justoldlogo.png')} style={{width : width , height : 150 , resizeMode : 'contain' , marginTop : -20}}/>
                    <Customtext type='light' style={{textAlign : 'center',fontWeight : '700',fontSize  : 18,letterSpacing  :1,marginTop : 10}}>Partner App</Customtext>

                    {/* <KeyboardAwareScrollView> */}


                    {message ? (
        <TouchableOpacity
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: 'transparent', justifyContent: 'center' , zIndex : 1010 },
          ]}
          onPress={() => showMessage(undefined)}>
          <Customtext type='light'
            style={{
              color: message.color || DEEPPINK,
              fontSize: 17,
              textAlign: 'center',
              margin: 20,
              fontWeight : '800',
              backgroundColor : 'white',
              padding : 20
            }}>
            {message.text}
          </Customtext>
        </TouchableOpacity>
      ) : (
        undefined
      )}
 
                    <View style={{height : height/1.9 , marginTop : height/2 - 360}}>
                        <View style={{height : 160 , overflow : 'hidden' , width : 2 * width}}>
                            <View style={{backgroundColor : GREYISH,width : '60%', height : width * 2  , borderRadius : width,marginLeft : '-5%',overflow : 'hidden' }}>
                                <Image source={require('../../assets/images/loginlesspattern.png')} style={{width : '100%' , height : 150 , resizeMode : 'contain' , position : 'absolute',top : -30 , left : 0, right : 0,zIndex : 1010}}/>
                                <Customtext type='light' style={{color : 'black' , zIndex : 1012 , textAlign : 'center',marginTop : 120 , fontWeight : '700',fontSize : 18,letterSpacing : 1}}>LOGIN / SIGNUP</Customtext>
                            </View>
                        </View>
                        {   otpshow && loadingscreen == false && <View style={{backgroundColor : DEEPPINK , height : height/3 }}>
                       <Customtext type='light' style={{padding : 10 , textAlign : 'center', color : 'white' , fontWeight : '700'}}>Enter OTP sent at {number}</Customtext>
                       <View style={{display : 'flex' , flexDirection : 'row',alignItems : 'center', padding : 40,paddingTop : 10}}>
                       <TextInput
                               style={[styles.input , {borderWidth : 1 , borderColor : 'white',margin : 5}]}
                               onChangeText={(text) => {if(text.length == 1){ref_input2.current.focus();}  onChangeDig1(text)}}
                               value={dig1}
                               placeholder=""
                               placeholderTextColor={GREYISH}
                               keyboardType="numeric"
                               maxLength={1}
                               ref={ref_input1}
                               onSubmitEditing={() => ref_input2.current.focus()}
                               autoFocus={true}

                           />
                            <TextInput
                               style={[styles.input , {borderWidth : 1 , borderColor : 'white',margin : 5}]}
                               onChangeText={(text) => {if(text.length == 1){ref_input3.current.focus();} onChangeDig2(text)}}
                               value={dig2}
                               placeholder=""
                               placeholderTextColor={GREYISH}
                               keyboardType="numeric"
                               maxLength={1}
                               ref={ref_input2}
                               onSubmitEditing={() => ref_input3.current.focus()}
                               onKeyPress={({ nativeEvent: { key: keyValue } }) => {
                                if(keyValue == 'Backspace' && dig2 == '') {
                                ref_input1.current.focus()
                                }
                            }}


                           />
                            <TextInput
                               style={[styles.input , {borderWidth : 1 , borderColor : 'white',margin : 5}]}
                               onChangeText={(text) => {if(text.length == 1){ref_input4.current.focus();} onChangeDig3(text)}}
                               value={dig3}
                               placeholder=""
                               placeholderTextColor={GREYISH}
                               keyboardType="numeric"
                               maxLength={1}
                               ref={ref_input3}
                               onSubmitEditing={() => ref_input4.current.focus()}
                               onKeyPress={({ nativeEvent: { key: keyValue } }) => {
                                if(keyValue == 'Backspace' && dig3 == '') {
                                ref_input2.current.focus()
                                }
                            }}


                           />
                            <TextInput
                               style={[styles.input , {borderWidth : 1 , borderColor : 'white',margin : 5}]}
                               onChangeText={(text) => {if(text.length == 1){ref_input5.current.focus();} onChangeDig4(text)}}
                               value={dig4}
                               placeholder=""
                               placeholderTextColor={GREYISH}
                               keyboardType="numeric"
                               maxLength={1}
                               ref={ref_input4}
                               onSubmitEditing={() => ref_input5.current.focus()}
                               onKeyPress={({ nativeEvent: { key: keyValue } }) => {
                                if(keyValue == 'Backspace' && dig4 == '') {
                                ref_input3.current.focus()
                                }
                            }}


                           />
                           <TextInput
                               style={[styles.input , {borderWidth : 1 , borderColor : 'white',margin : 5}]}
                               onChangeText={(text) => {if(text.length == 1){ref_input6.current.focus();} onChangeDig5(text)}}
                               value={dig5}
                               placeholder=""
                               placeholderTextColor={GREYISH}
                               keyboardType="numeric"
                               maxLength={1}
                               ref={ref_input5}
                               onSubmitEditing={() => ref_input6.current.focus()}
                               onKeyPress={({ nativeEvent: { key: keyValue } }) => {
                                if(keyValue == 'Backspace' && dig5 == '') {
                                ref_input4.current.focus()
                                }
                            }}


                           />
                            <TextInput
                               style={[styles.input , {borderWidth : 1 , borderColor : 'white',margin : 5}]}
                               onChangeText={(text) => onChangeDig6(text)}
                               value={dig6}
                               placeholder=""
                               placeholderTextColor={GREYISH}
                               keyboardType="numeric"
                               maxLength={1}
                               ref={ref_input6}
                               onKeyPress={({ nativeEvent: { key: keyValue } }) => {
                                if(keyValue == 'Backspace' && dig6 == '') {
                                ref_input5.current.focus()
                                }
                            }}

                           />
                             
                           
                       </View>
                       <Pressable onPress = {() => nexttapped()} style={{width : '40%',marginLeft : '30%', borderRadius : 10,backgroundColor : 'white'}}><Customtext type='light' style={{color : DEEPPINK,padding: 12 , width : '100%',textAlign : 'center' , fontWeight : '600' , fontSize : 18}}>Next</Customtext></Pressable>

                   </View>
                    }
                   {
                       !otpshow && loadingscreen == false &&  <View style={{backgroundColor : DEEPPINK , height : height/3}}>
                       <View style={{display : 'flex' , flexDirection : 'row',alignItems : 'center', padding : 10,borderColor : GREYISH,marginHorizontal : 40,marginVertical : 20,borderWidth : 3,borderRadius : 10}}>
                           <Customtext type='light' style={{color : BACKGROUNDCOLOR , marginRight : 10 , fontSize : 20 }}>+91</Customtext>
                           <TextInput
                               style={styles.input}
                               onChangeText={(text) => onChangeNumber(text)}
                               value={number}
                               placeholder="Enter Mobile Number"
                               placeholderTextColor={GREYISH}
                               keyboardType="numeric"
                           />
                       </View>
                      
                       <Pressable onPress = {() => checkforblockeduser()} style={{width : '40%',marginLeft : '30%', borderRadius : 10,backgroundColor : 'white',marginTop : 0 ,marginBottom : 0}}><Customtext type='light' style={{color : DEEPPINK,padding: 12 , width : '100%',textAlign : 'center' , fontWeight : '600' , fontSize : 18}}>Send OTP</Customtext></Pressable>
                       {/* <TouchableOpacity onPress = {() => skiplogin()} style={{width : '40%',marginLeft : '30%', borderRadius : 10,margin : 5}}><Customtext type='light' style={{color : 'white',padding: 12 , width : '100%',textAlign : 'center' , fontWeight : '600' , fontSize : 18}}>Skip Login</Customtext></TouchableOpacity> */}

                   </View>
                   }
                    </View>
                    {/* </KeyboardAwareScrollView> */}
                </View>

                {/* <Image source={require('../../assets/images/loginupper.png')} style={{width : width , height : height/2.5 , resizeMode : 'contain'}}/> */}

                
                {attemptInvisibleVerification && <FirebaseRecaptchaBanner />}

            </View>
        </KeyboardAwareScrollView>

    )
}

export default index
