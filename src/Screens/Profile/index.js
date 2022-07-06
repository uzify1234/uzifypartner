import React , {useEffect , useState} from 'react'
import { View, Text, SafeAreaView, ScrollView, Image, Platform ,Dimensions} from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { DEEPPINK, GREYISH, LIGHTPINK } from '../../Constants/Colors'
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import { MaterialIcons } from '@expo/vector-icons';
import * as firebase from 'firebase';
import db from '../../config/firebase';
import { useNavigation } from '@react-navigation/native';
import { LOGIN, UPCOMINGBOOKINGS, MYORDERS, EDITPROFILE, HELP, MYWALLET, ABOUTUZIFY, PASTBOOKINGS, CREDITSSCREEN, MARKLEAVE, PARTICULARBOOKING } from '../../Constants/routesName';
import Loader from '../../components/Loader';
import { Ionicons } from '@expo/vector-icons';
import Customtext from '../../components/Customtext';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import CachedImage from 'react-native-expo-cached-image';
import { Alert } from 'react-native';






const index = () => {
    const {width,height} = Dimensions.get('screen');
    const navigation = useNavigation(); 
    const [loadingscreen, setloadingscreen] = useState(false);

    const [name, setname] = useState("");
    const [number, setnumber] = useState("");
    const [imageurl, setimageurl] = useState(null);
    const [currentuser, setcurrentuser] = useState(null);
    const [credits, setcredits] = useState(0);
    const [partnerRatings, setPartnerRatings] = useState(0);

    const [needmorefetch, setneedmorefetch] = useState(false);



    async function schedulePushNotification() {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "You've got mail! 📬",
            body: 'Here is the notification body',
            data: { data: 'goes here' },
          },
          trigger: { seconds: 2 },
        });
      }   


      const deleteaccount = () => {
        Alert.alert(
          "Are you sure you want to delete your account, this will remove all your details stored ? ",
          "",
          [
            {
              text: "Yes",
              onPress: () => {processdeletion()},
              style: "cancel"
            },
            {
              text: "No",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel"
            }
          ]
        );
      }
  
      const processdeletion = () => {
          var idtarget = "8tQwRXvhdsOea55k1JfcueYytJv1";
        db.collection('partners').doc(idtarget).collection('upcomingbookings').get().then(alldats => {
          if(alldats.docs.length === 0) {
            db.collection('partners').doc(idtarget).delete().then(donedel => {
              firebase.auth().currentUser.delete().then(function () {
                alert("Your account has been deleted");
                db.collection('users').doc(idtarget).delete().then(donedel => {});
                logoutuser();
              }).catch(function (error) {
                console.error({error})
              })
            }).catch(err => {
              alert("We can not delete your account currently, Try again after sometime");
            })
          }
          else {
            alert("You already have upcoming booking(s), you can delete your account only after its completion");
          }
        })
      }
  
    useEffect(() => {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
              setcurrentuser(user);
              setloadingscreen(true);
              db.collection('partners').doc(user.uid).get().then((df) => {
                  setimageurl(df.data().profileimage);
                  setname(df.data().name);
                  setimageurl(df.data().profileimage);
                  setloadingscreen(false);
                  setcredits(df.data().credits);
                  setPartnerRatings(df.data().partnerrating);
              }).catch(err => {
                setloadingscreen(false);
              });
            }
            else {
            }
         });
    }, [needmorefetch]);

    const logoutuser = () => {
        firebase.auth().signOut().then(() => {
            navigation.navigate(LOGIN);
        }).catch(e => {
        });
    }
    return (
        <View>
            {loadingscreen == true && <Loader visible={loadingscreen}/>} 


            <ScrollView showsVerticalScrollIndicator={false}>
               
                {currentuser != null && <View>
                    <View style={{backgroundColor : LIGHTPINK, padding : 0,paddingTop : Platform.OS == 'ios' ? 10 : 60}}>
                    <View style={{display : 'flex',flexDirection : 'row',justifyContent : 'space-between',alignItems : 'center',margin : 20,marginTop : 30}}>
                        <TouchableOpacity style={{ width : 60}} onPress={() =>  navigation.pop()}>
                            <Ionicons name="arrow-back-circle" size={36} color={DEEPPINK} /> 
                        </TouchableOpacity>
                        <View>
                        <Customtext type='light' style={{fontSize : 18, fontWeight : '800',color : DEEPPINK,marginTop : 8,textAlign : 'right'}}>{name}</Customtext>
                        <Customtext type='light' style={{fontSize : 14, fontWeight : '700',color : 'black',marginTop : 8,textAlign : 'right'}}>{Math.round(credits * 100) / 100} Credits</Customtext>
                        <Customtext type='light' style={{fontSize : 14, fontWeight : '700',color : 'black',marginTop : 8,textAlign : 'right'}}>Ratings: {partnerRatings}</Customtext>

                        </View>
                    </View>
 
                   
                    
                    <View style={{display : 'flex',justifyContent : 'center', alignItems : 'center'}}>
                        {imageurl != null ?<CachedImage source={{uri : imageurl}} style={{width : 100, height : 100, borderRadius : 50 , marginTop : 0,borderColor : DEEPPINK,borderWidth : 2}} /> : <View style={{width : 100 , height : 100 , backgroundColor : LIGHTPINK , borderRadius  :50 , marginTop : 16,display : 'flex',justifyContent : 'center' , alignItems : 'center'}}><Customtext type='light' style={{fontWeight : '800',fontSize : 30}}>{name[0]}</Customtext></View>}
                        <TouchableOpacity onPress={() => navigation.navigate(EDITPROFILE,{needmorefetch : needmorefetch, setneedmorefetch : setneedmorefetch})} style={{backgroundColor : DEEPPINK ,marginTop : 16, padding : 10 , width : 150,borderRadius : 5,marginBottom : 20}}><Customtext type='light' style={{textAlign : 'center' ,color : LIGHTPINK,fontWeight : '700'}}>View Profile</Customtext></TouchableOpacity>

                    </View>
                    </View>
                    <View style={{marginTop : 32,padding : 15}}>
                        <TouchableOpacity onPress={() => navigation.navigate(UPCOMINGBOOKINGS)} style={{marginBottom : 12, display : 'flex' , alignItems : 'center',flexDirection : 'row' ,borderRightColor : 'transparent',borderLeftColor : 'transparent' , borderTopColor : 'transparent', borderBottomColor : LIGHTPINK, borderWidth : 1,paddingBottom : 7}}><MaterialCommunityIcons name="sale" size={24} color={DEEPPINK} /><Customtext type='light' style={{marginLeft : 8, fontWeight : '700'}}>My Upcoming Bookings</Customtext></TouchableOpacity>

                        <TouchableOpacity onPress={() => navigation.navigate(PASTBOOKINGS)} style={{marginBottom : 12,display : 'flex' , alignItems : 'center',flexDirection : 'row',borderRightColor : 'transparent',borderLeftColor : 'transparent' , borderTopColor : 'transparent', borderBottomColor : LIGHTPINK, borderWidth : 1,paddingBottom : 7}}><MaterialIcons name="favorite-border" size={24} color={DEEPPINK} /><Customtext type='light' style={{marginLeft : 8, fontWeight : '700'}}>My Past Bookings</Customtext></TouchableOpacity>

                        {/* <TouchableOpacity  onPress={() => navigation.navigate(HELP,{name : name , number : number , imageurl : imageurl , currentuser : currentuser})} style={{marginBottom : 24,display : 'flex' , alignItems : 'center',flexDirection : 'row'}}><MaterialCommunityIcons name="help-circle" size={24} color={DEEPPINK} /><Customtext type='light' style={{marginLeft : 8, fontWeight : '700'}}>Help Center</Customtext></TouchableOpacity> */}

                        <TouchableOpacity  onPress={() => navigation.navigate(CREDITSSCREEN)} style={{marginBottom : 12,display : 'flex' , alignItems : 'center',flexDirection : 'row',borderRightColor : 'transparent',borderLeftColor : 'transparent' , borderTopColor : 'transparent', borderBottomColor : LIGHTPINK, borderWidth : 1,paddingBottom : 7}}><MaterialIcons name="account-balance-wallet" size={24} color={DEEPPINK} /><Customtext type='light' style={{marginLeft : 8, fontWeight : '700'}}>My Credits</Customtext></TouchableOpacity>

                        <TouchableOpacity  onPress={() => navigation.navigate(MARKLEAVE)} style={{marginBottom : 12,display : 'flex' , alignItems : 'center',flexDirection : 'row',borderRightColor : 'transparent',borderLeftColor : 'transparent' , borderTopColor : 'transparent', borderBottomColor : LIGHTPINK, borderWidth : 1,paddingBottom : 7}}><MaterialIcons name="ios-share" size={24} color={DEEPPINK} /><Customtext type='light' style={{marginLeft : 8, fontWeight : '700'}}>My Leaves</Customtext></TouchableOpacity>
                        
                        <TouchableOpacity style={{marginBottom : 12,display : 'flex' , alignItems : 'center',flexDirection : 'row',borderRightColor : 'transparent',borderLeftColor : 'transparent' , borderTopColor : 'transparent', borderBottomColor : LIGHTPINK, borderWidth : 1,paddingBottom : 7}}><MaterialIcons name="ios-share" size={24} color={DEEPPINK} /><Customtext type='light' style={{marginLeft : 8, fontWeight : '700'}}>Share Uzify</Customtext></TouchableOpacity>
                        {/* <TouchableOpacity onPress={() => navigation.navigate(PARTICULARBOOKING,{bookingid : '7Y76j2PrdHhZNRXMh7CS'})}  style={{marginBottom : 12,display : 'flex' , alignItems : 'center',flexDirection : 'row',borderRightColor : 'transparent',borderLeftColor : 'transparent' , borderTopColor : 'transparent', borderBottomColor : LIGHTPINK, borderWidth : 1,paddingBottom : 7}}><MaterialIcons name="star-rate" size={24} color={DEEPPINK} /><Customtext type='light' style={{marginLeft : 8, fontWeight : '700'}}>Rate Uzify</Customtext></TouchableOpacity> */}
                        <TouchableOpacity onPress={deleteaccount} style={{marginBottom : 12,display : 'flex' , alignItems : 'center',flexDirection : 'row',borderRightColor : 'transparent',borderLeftColor : 'transparent' , borderTopColor : 'transparent', borderBottomColor : LIGHTPINK, borderWidth : 1,paddingBottom : 7}}><MaterialIcons name="ios-share" size={24} color={DEEPPINK} /><Customtext type='light' style={{marginLeft : 8, fontWeight : '700'}}>Delete my account</Customtext></TouchableOpacity>

                        <TouchableOpacity onPress={logoutuser} style={{marginBottom : 12,display : 'flex' , alignItems : 'center',flexDirection : 'row',borderRightColor : 'transparent',borderLeftColor : 'transparent' , borderTopColor : 'transparent', borderBottomColor : LIGHTPINK, borderWidth : 1,paddingBottom : 7}}><MaterialCommunityIcons name="logout" size={24} color={DEEPPINK} /><Customtext type='light' style={{marginLeft : 8, fontWeight : '700'}}>Logout</Customtext></TouchableOpacity>

                    </View>
                    


                </View>}
                {
                    currentuser == null && <View style={{width : '100%',height : height,display : 'flex',justifyContent : 'center',alignItems : 'center'}}>
                        <Customtext type='light' style={{fontWeight : '800',fontSize : 20}}>Login to Continue </Customtext>
                        <TouchableOpacity onPress={() => navigation.pop()} style={{padding : 15,backgroundColor : DEEPPINK,marginTop : 20,width : 100, borderRadius : 5}}><Customtext type='light' style={{textAlign : 'center',fontSize : 18, color : 'white', fontWeight : '800',letterSpacing : 1}}>Login</Customtext></TouchableOpacity>
                    </View>
                }
            </ScrollView>
        </View>
    )
}

export default index