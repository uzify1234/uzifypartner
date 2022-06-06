import React,{useState , useEffect} from 'react'
import { View, Text, Image,TouchableOpacity, SafeAreaView, ScrollView } from 'react-native'
import { DEEPPINK, LIGHTPINK, topgapforheading } from '../../Constants/Colors.js';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import db from '../../config/firebase.js';
import { CATEGORIESPICKER, LOGIN, REGISTER } from '../../Constants/routesName.js';
import Customtext from '../../components/Customtext';
import * as firebase from 'firebase';


const index = (props) => {
    const navigation = useNavigation(); 
    const [partnerauthid, setpartnerauthid] = useState("xyz123");
    const [message, setmessage] = useState("");

    const [ciurrenterror, setciurrenterror] = useState("");
    const [obtained, setobtained] = useState(false);
    useEffect(() => {

      



        setpartnerauthid(props.route.params.partnerid);
        console.log("check");
        console.log(props.route.params.partnerid);
        db.collection('partners').doc(props.route.params.partnerid).get().then(det => {
            if(det.data().error !== undefined) {
                setciurrenterror(det.data().error);
                console.log(det.data().error);
            }
            if(det.data().submissiondone == undefined) {
                setmessage("Please Complete your profile");
            }
            else if(det.data().submissiondone == true && det.data().adminaccepted == false &&  det.data().errorreportedbyadmin == false) {
                setmessage("Your profile is under verification, Please try after sometime");
            }
            else if(det.data().error == undefined || det.data().error == "") {
                setmessage("Your profile is under verification, Please try after sometime");

            }
            else if(det.data().submissiondone == true && det.data().adminaccepted == false &&  det.data().errorreportedbyadmin == true) {
                setmessage(det.data().error);
            }
            setobtained(true);
        }).catch(eer => {

        });
    }, [])

    const proceedtorectify = () => {
        navigation.navigate(CATEGORIESPICKER,{userid : props.route.params.partnerid,partnerid : props.route.params.partnerid , number : props.route.params.number});
    }


    const logoutandmove = () => {
        firebase.auth().signOut().then(() => {
            console.log("User Logged Out");
            navigation.navigate(LOGIN);
        }).catch(e => {
            console.log(e);
        });
    }
    return (
        <SafeAreaView>
        <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{marginTop :  topgapforheading , position : 'relative',display : 'flex',flexDirection : 'row',alignItems : 'center'}}>
                {/* <TouchableOpacity style={{ width : 60}} onPress={() =>  navigation.pop()}>
                        <View style={{borderRadius : 10 , padding : 10 , zIndex : 1035}}>
                        <Ionicons name="arrow-back-circle" size={36} color={DEEPPINK} style={{zIndex : 1035}} />
                        </View>
                    </TouchableOpacity> */}
            </View>
            {obtained && <View>
                <View style={{display  : 'flex',justifyContent : 'center',alignItems : 'center',width : '100%',marginTop : 50}}>
                    {
                        message == "Please Complete your profile" || ciurrenterror != ""  ? <View style={{width : '100%'}}><Image source={require('../../assets/images/sorry.png')} style = {{width : '90%' , height : 300 , resizeMode : 'cover'}} /></View> : <View style={{width : '100%'}}><Image source={require('../../assets/images/orderplaced.png')} style = {{width : '90%' , height : 300 , resizeMode : 'contain'}} /><Image source={require('../../assets/images/congratulations.png')} style = {{width : '90%' , height : 60 , resizeMode : 'cover'}} /></View>
                    }
                

                    <Customtext type='light' style={{fontWeight : '700',textAlign : 'center' , fontSize : 18,lineHeight : 30 , color : DEEPPINK,marginTop : 20,padding : 15}}>{message}</Customtext>
                </View>
                {ciurrenterror != "" && message != "Your profile is under verification, Please try after sometime"  && <TouchableOpacity onPress={proceedtorectify}  style = {{width : '80%',marginLeft : '10%',padding : 12 , backgroundColor : DEEPPINK , borderRadius : 5 , marginTop : 20,marginBottom : 30}}><Customtext type='light' style={{fontWeight : '800',color : 'white',textAlign : 'center',fontSize : 18}}>Proceed to Rectify Errors</Customtext></TouchableOpacity>}
                    {
                    message == "Please Complete your profile"  &&
                    <TouchableOpacity onPress={proceedtorectify}  style = {{width : '80%',marginLeft : '10%',padding : 12 , backgroundColor : DEEPPINK , borderRadius : 5 , marginTop : 20,marginBottom : 30}}><Customtext type='light' style={{fontWeight : '800',color : 'white',textAlign : 'center',fontSize : 18}}>Proceed to Completing Profile</Customtext></TouchableOpacity>
                    }


                    <TouchableOpacity onPress={logoutandmove} style={{backgroundColor : DEEPPINK,padding : 15,width : '60%',marginLeft : '20%',borderRadius  :5}}><Text style={{color : 'white',textAlign : 'center',fontWeight : '700'}}>Back to Login</Text></TouchableOpacity>

        </View>
        }
        </ScrollView>
        </SafeAreaView>
    )
}

export default index
