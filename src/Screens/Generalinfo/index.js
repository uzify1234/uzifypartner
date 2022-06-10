import React , {useState , useEffect } from 'react'
import { View, Text, TouchableOpacity, Image, TextInput } from 'react-native'
import { DEEPPINK, GREYISH, topgapforheading } from '../../Constants/Colors'
import { Ionicons } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from './style.js';
import * as ImagePicker from 'expo-image-picker';
import * as firebase from 'firebase';
import Loader from '../../components/Loader';
import db from '../../config/firebase';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { BANKDETAILS } from '../../Constants/routesName';
import DropDownPicker from 'react-native-dropdown-picker';
import Customtext from '../../components/Customtext';
import { MaterialIcons } from '@expo/vector-icons';







const index = (props) => {

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([
      {label: 'Salon Owner', value: 'Salon Owner'},
      {label: 'Employee at a Salon', value: 'Employee at a Salon'},
      {label: 'Freelancer', value: 'Freelancer'}
    ]);

    const [open2, setOpen2] = useState(false);
    const [value2, setValue2] = useState(null);
    const [items2, setItems2] = useState([
      {label: 'Male', value: 'Male'},
      {label: 'Female', value: 'Female'},
      {label: 'Transgender', value: 'Transgender'}
    ]);

    const [state, onChangeState] = React.useState(null);
    const [city, onChangeCity] = React.useState(null);
    const [aboutme, onChangeAboutme] = React.useState(null);
    const [alternatenumber, onChangeAlternatenumber] = React.useState(null);
    const [workexperience, onChangeWorkexperience] = React.useState(null);
    const [fblink, onChangeFblink] = React.useState("");
    const [instalink, onChangeInstalink] = React.useState("");
    const [weblink, onChangeWeblink] = React.useState("");
    const [brandspossess, onChangeBrandspossess] = React.useState(null);
    const [partnerauthid, setpartnerauthid] = useState("xyz123");


    const [stateerror, setstateerror] = useState(false);
    const [cityerror, setcityerror] = useState(false);
    const [aboutmeerror, setaboutmeerror] = useState(false);
    const [alternatenumbererror, setalternatenumbererror] = useState(false);
    const [workexperienceerror, setworkexperienceerror] = useState(false);
    const [brandspossesserror, setbrandspossesserror] = useState(false);
    const [gendererror, setgendererror] = useState(false);
    const [areyouaerror, setareyouaerror] = useState(false);


    const [loadingscreen, setloadingscreen] = useState(false);






  
    const [alreadyexistingdata, setalreadyexistingdata] = useState({});

    const [message, setmessage] = useState("");


    const navigation = useNavigation(); 



    useEffect(() => {
        setpartnerauthid(props.route.params.partnerid);
        const userid = props.route.params.partnerid;
        db.collection('partners').doc(userid).get().then(info => {
            if(info.data() !== undefined) {
            setalreadyexistingdata(info.data());
            onChangeState(info.data().state);
            onChangeCity(info.data().city);
            onChangeAboutme(info.data().aboutme);
            onChangeAlternatenumber(info.data().alternatenumber);
            onChangeWorkexperience(info.data().workexperience);
            onChangeFblink(info.data().fblink);
            onChangeInstalink(info.data().instalink);
            onChangeWeblink(info.data().weblink);
            onChangeBrandspossess(info.data().brandspossess);
            setValue(info.data().areyoua);
            setValue2(info.data().gender);
            }
       
        }).catch(e => {
        })
    }, [])

    const attempuploads = () => {
        setstateerror(false);
        setcityerror(false);
        setaboutmeerror(false);
        setalternatenumbererror(false);
        setworkexperienceerror(false);
        setbrandspossesserror(false);
        setareyouaerror(false);
        setgendererror(false);
       
        if(state == null || state == "") {
            setmessage("Please Enter State from where you belong");
            setstateerror(true);
        }
        else if(city == null || city == "") {
            setmessage("Please Enter City from where you belong");
            setcityerror(true);
        }
        else if(aboutme == null || aboutme == "") {
            setmessage("Please Enter something about yourself");
            setaboutmeerror(true);
        }
        else if(alternatenumber == null || alternatenumber == "")  {
            setmessage("Please enter your alternate number");
            setalternatenumbererror(true);
        }
        else if(alternatenumber.length != 10) {
            setmessage("Alternate number should be of 10 digits");
            setalternatenumbererror(true);
        }
        else if(workexperience == null || workexperience == "") {
            setmessage("Please enter your workexperience");
            setworkexperienceerror(true);
        }
        else if(brandspossess == null || brandspossess == "") {
            setmessage("Please enter brands you possess");
            setbrandspossesserror(true);
        }
        else if(value == null || value == "") {
            setmessage("Please select whether you are a salon owner,employee or a freelancer");
            setareyouaerror(true);
        }
        else if(value2 == null || value2 == "") {
            setmessage("Please select your Gender");
            setgendererror(true);
        }
        else if(state == alreadyexistingdata.state && value == alreadyexistingdata.areyoua  && value2 == alreadyexistingdata.gender && city == alreadyexistingdata.city && alreadyexistingdata.aboutme == aboutme && alternatenumber == alreadyexistingdata.alternatenumber && workexperience == alreadyexistingdata.workexperience && alreadyexistingdata.brandspossess == brandspossess ) {
            navigation.navigate(BANKDETAILS , {partnerid : partnerauthid});

        }
        else {
            lastupload();
        }
    }


   

    const lastupload = () => {
        const userid = partnerauthid;
        setloadingscreen(true);
        if(fblink == undefined) {
            onChangeFblink("");
        }
        if(instalink == undefined) {
            onChangeInstalink("");
        }
        if(weblink == undefined) {
            onChangeWeblink("");
        }
        db.collection('partners').doc(userid).update({
            state : state,
            city : city,
            aboutme : aboutme,
            alternatenumber : alternatenumber,
            workexperience : workexperience,
            brandspossess : brandspossess,
            fblink : fblink == undefined ? "" : fblink,
            instalink : instalink == undefined ? "" : instalink,
            weblink : weblink == undefined ? "" : weblink,
            areyoua : value,
            gender : value2
        }).then(done => {
            setmessage("Details Uploaded");
            setloadingscreen(false);
            navigation.navigate(BANKDETAILS , {partnerid : partnerauthid});
        }).catch(ee => {
            setloadingscreen(false);
        })
    }





    return (
        <View>
             {loadingscreen == true && <Loader visible={loadingscreen}/>} 

            <View style={{marginTop : topgapforheading  ,display : 'flex' , flexDirection : 'row',justifyContent : 'space-between' , padding  :10}}>
            <TouchableOpacity style={{ width : 60}} onPress={() =>  navigation.pop()}>
                        
                        
                        <Ionicons name="arrow-back-circle" size={36} color={DEEPPINK} />
                        
                        
                </TouchableOpacity>
                <Customtext type='light' style={{padding : 20 , color : DEEPPINK , fontWeight : '700'}}>Step 5 of 8</Customtext>
            </View>
            
            <Customtext type='light' style={{ padding : 20 , fontWeight : '700' , fontSize : 24}}>{message == "" ? "Join Uzify by filling all the informations" : message } </Customtext>
            <KeyboardAwareScrollView style={{paddingBottom : 100}}>
                <View style={{marginTop : 20,display : 'flex', alignItems : 'center'}}>
                    
                    <Customtext type='light' style={{textAlign : 'left',width : '90%',marginTop : 20,fontWeight : '700'}}>Enter City from where you belong</Customtext>
                    <TextInput
                               style={[styles.input]}
                               onChangeText={(text) => onChangeCity(text)}
                               value={city}
                               placeholder="Enter city"
                               placeholderTextColor={GREYISH}    
                    />
                       {cityerror && <View style={{display : 'flex',flexDirection : 'row',alignItems : 'center',paddingLeft : 8}}>
                        <MaterialIcons name="error" size={20} color="red" />
                        <Customtext type='light' style={{paddingLeft : 8, textAlign : 'left',width : '90%',marginTop : 5,fontWeight : '700',color : DEEPPINK}}>Please Enter your city</Customtext>
                    </View>}
                    <Customtext type='light' style={{textAlign : 'left',width : '90%',marginTop : 20,fontWeight : '700'}}>Enter State from where you belong</Customtext>
                    <TextInput
                               style={[styles.input]}
                               onChangeText={(text) => onChangeState(text)}
                               value={state}
                               placeholder="Enter state"
                               placeholderTextColor={GREYISH}
                       
                    />
                       {stateerror && <View style={{display : 'flex',flexDirection : 'row',alignItems : 'center',paddingLeft : 8}}>
                        <MaterialIcons name="error" size={20} color="red" />
                        <Customtext type='light' style={{paddingLeft : 8, textAlign : 'left',width : '90%',marginTop : 5,fontWeight : '700',color : DEEPPINK}}>Please Enter your state</Customtext>
                    </View>}
                    <Customtext type='light' style={{textAlign : 'left',width : '90%',marginTop : 20,fontWeight : '700'}}>Tell us something about yourself (This will be shown to customers whose leads you will receive)</Customtext>
                    <TextInput
                               style={[styles.input , {height : 120}]}
                               onChangeText={(text) => onChangeAboutme(text)}
                               value={aboutme}
                               placeholder="Enter About yourself"
                               placeholderTextColor={GREYISH} 
                               multiline={true}
                               underlineColorAndroid='transparent'    
                    />
                             {aboutmeerror && <View style={{display : 'flex',flexDirection : 'row',alignItems : 'center',paddingLeft : 8}}>
                        <MaterialIcons name="error" size={20} color="red" />
                        <Customtext type='light' style={{paddingLeft : 8, textAlign : 'left',width : '90%',marginTop : 5,fontWeight : '700',color : DEEPPINK}}>Please Enter about yourself</Customtext>
                    </View>}
                     <Customtext type='light' style={{textAlign : 'left',width : '90%',marginTop : 20,fontWeight : '700'}}>Enter alternate mobile number</Customtext>
                    <TextInput
                               style={[styles.input]}
                               onChangeText={(text) => onChangeAlternatenumber(text)}
                               value={alternatenumber}
                               placeholder="Enter Alternate Mobile Number"
                               placeholderTextColor={GREYISH}
                               keyboardType="numeric"
                    />
                             {alternatenumbererror && <View style={{display : 'flex',flexDirection : 'row',alignItems : 'center',paddingLeft : 8}}>
                        <MaterialIcons name="error" size={20} color="red" />
                        <Customtext type='light' style={{paddingLeft : 8, textAlign : 'left',width : '90%',marginTop : 5,fontWeight : '700',color : DEEPPINK}}>Please Enter your alternate number</Customtext>
                    </View>}
                    <Customtext type='light' style={{textAlign : 'left',width : '90%',marginTop : 20,fontWeight : '700'}}>Enter work experience in months</Customtext>
                    <TextInput
                               style={[styles.input]}
                               onChangeText={(text) => onChangeWorkexperience(text)}
                               value={workexperience}
                               placeholder="Enter Work Experience"
                               placeholderTextColor={GREYISH}
                               keyboardType="numeric"
                    />
                             {workexperienceerror && <View style={{display : 'flex',flexDirection : 'row',alignItems : 'center',paddingLeft : 8}}>
                        <MaterialIcons name="error" size={20} color="red" />
                        <Customtext type='light' style={{paddingLeft : 8, textAlign : 'left',width : '90%',marginTop : 5,fontWeight : '700',color : DEEPPINK}}>Please Enter your workexperience</Customtext>
                    </View>}
                     <Customtext type='light' style={{textAlign : 'left',width : '90%',marginTop : 20,fontWeight : '700'}}>Are you a</Customtext>
                    <DropDownPicker
                        open={open}
                        value={value}
                        items={items}
                        setOpen={setOpen}
                        setValue={setValue}
                        setItems={setItems}
                        style={{margin : 20,width : '90%',marginLeft : '5%',backgroundColor : 'transparent'}}
                        textStyle={{
                            fontSize: 15,
                            fontWeight : '600'
                          }}
                         
                    />
                    {areyouaerror && <View style={{display : 'flex',flexDirection : 'row',alignItems : 'center',paddingLeft : 8}}>
                        <MaterialIcons name="error" size={20} color="red" />
                        <Customtext type='light' style={{paddingLeft : 8, textAlign : 'left',width : '90%',marginTop : 5,fontWeight : '700',color : DEEPPINK}}>Please select an option</Customtext>
                    </View>}
                    <Customtext type='light' style={{textAlign : 'left',width : '90%',marginTop : 0,fontWeight : '700'}}>Facebook Profile Link (Optional)</Customtext>
                    <View style={{display : 'flex',flexDirection : 'row',alignItems : 'center',margin : 20,marginTop : 0 , borderWidth : 1 , borderColor : 'black',borderRadius : 5,marginTop : 10,paddingLeft : 5, paddingRight : 5}}>
                        <AntDesign name="facebook-square" size={28} color="black" style={{marginRight : 10}} />
                        <TextInput
                                style={[styles.input,{borderWidth : 0,padding : 11,marginTop : 0}]}
                                onChangeText={(text) => onChangeFblink(text)}
                                value={fblink}
                                placeholder="Enter Facebook Link"
                                placeholderTextColor={GREYISH}
                                
                        />
                    </View>
                    <Customtext type='light' style={{textAlign : 'left',width : '90%',marginTop : 0,fontWeight : '700'}}>Instagram Profile Link (Optional)</Customtext>
                    <View style={{display : 'flex',flexDirection : 'row',alignItems : 'center',margin : 20,marginTop : 0 , borderWidth : 1 , borderColor : 'black',borderRadius : 5,marginTop : 10,paddingLeft : 5, paddingRight : 5}}>
                        <AntDesign name="instagram" size={24} color="black" />
                        <TextInput
                                style={[styles.input,{borderWidth : 0,padding : 11,marginTop : 0}]}
                                onChangeText={(text) => onChangeInstalink(text)}
                                value={instalink}
                                placeholder="Enter Instagram Link"
                                placeholderTextColor={GREYISH}
                                
                        />
                    </View>
                    <Customtext type='light' style={{textAlign : 'left',width : '90%',marginTop : 0,fontWeight : '700'}}>Website URL (Optional)</Customtext>
                    <View style={{display : 'flex',flexDirection : 'row',alignItems : 'center',margin : 20,marginTop : 0 , borderWidth : 1 , borderColor : 'black',borderRadius : 5,marginTop : 10,paddingLeft : 5, paddingRight : 5}}>
                        <AntDesign name="instagram" size={24} color="black" />
                        <TextInput
                                style={[styles.input,{borderWidth : 0,padding : 11,marginTop : 0}]}
                                onChangeText={(text) => onChangeWeblink(text)}
                                value={weblink}
                                placeholder="Enter Website URL"
                                placeholderTextColor={GREYISH}
                                
                        />
                    </View>
                   
                    <Customtext type='light' style={{textAlign : 'left',width : '90%',marginTop : 0,fontWeight : '700'}}>Select your Gender</Customtext>
                    <DropDownPicker
                        open={open2}
                        value={value2}
                        items={items2}
                        setOpen={setOpen2}
                        setValue={setValue2}
                        setItems={setItems2}
                        style={{margin : 20,width : '90%',marginLeft : '5%',backgroundColor : 'transparent'}}
                        textStyle={{
                            fontSize: 15,
                            fontWeight : '600'
                          }}
                          
                    />
                    {gendererror && <View style={{display : 'flex',flexDirection : 'row',alignItems : 'center',paddingLeft : 8}}>
                        <MaterialIcons name="error" size={20} color="red" />
                        <Customtext type='light' style={{paddingLeft : 8, textAlign : 'left',width : '90%',marginTop : 5,fontWeight : '700',color : DEEPPINK}}>Please select your gender</Customtext>
                    </View>}
                    <Customtext type='light' style={{textAlign : 'left',width : '90%',marginTop : 0,fontWeight : '700'}}>Brands you possess</Customtext>
                    <TextInput
                               style={[styles.input , {height : 120}]}
                               onChangeText={(text) => onChangeBrandspossess(text)}
                               value={brandspossess}
                               placeholder="Enter Brands possessed by you"
                               placeholderTextColor={GREYISH} 
                               multiline={true}
                               underlineColorAndroid='transparent'    
                    />
                             {brandspossesserror && <View style={{display : 'flex',flexDirection : 'row',alignItems : 'center',paddingLeft : 8}}>
                        <MaterialIcons name="error" size={20} color="red" />
                        <Customtext type='light' style={{paddingLeft : 8, textAlign : 'left',width : '90%',marginTop : 5,fontWeight : '700',color : DEEPPINK}}>Please Enter your brands that you possess</Customtext>
                    </View>}



                    <TouchableOpacity onPress={attempuploads}  style = {{padding : 12 , backgroundColor : DEEPPINK , borderRadius : 5 , marginTop : 60,marginBottom : 300 , width : '90%'}}><Customtext type='light' style={{fontWeight : '800',color : 'white',textAlign : 'center',fontSize : 18}}>Next</Customtext></TouchableOpacity>


                </View>

            </KeyboardAwareScrollView>
        </View>
    )
}

export default index
