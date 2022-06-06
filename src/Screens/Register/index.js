import React , {useState , useEffect } from 'react'
import { View, Text, TouchableOpacity, Image, TextInput, Alert, Picker } from 'react-native'
import { DEEPPINK, GREYISH, topgapforheading } from '../../Constants/Colors'
import { Ionicons } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from './style.js';
import * as ImagePicker from 'expo-image-picker';
import * as firebase from 'firebase';
import Loader from '../../components/Loader';
import db from '../../config/firebase';
import { useNavigation } from '@react-navigation/native';
import { CATEGORIESPICKER, CITIESPICKER } from '../../Constants/routesName';
import Customtext from '../../components/Customtext';
import { MaterialIcons } from '@expo/vector-icons';
import DropDownPicker from 'react-native-dropdown-picker';
import * as Notifications from 'expo-notifications';






const index = (props) => {

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([
        {label: '-', value: '-'},
      {label: 'Aadhar Card', value: 'Aadhar Card'},
      {label: 'Voter Card', value: 'Voter Card'},
      {label: 'Driving License', value: 'Driving License'},
      {label: 'Passport', value: 'Passport'}
    ]);

    const [name, onChangeName] = React.useState(null);
    const [email, onChangeEmail] = React.useState(null);
    const [address, onChangeAddress] = React.useState(null);
    const [aadharnumber, onChangeAadharnumber] = React.useState(null);
    const [profileimage, setprofileimage] = useState(null);
    const [frontimage, setfrontimage] = useState(null);
    const [backimage, setbackimage] = useState(null);
    const [loadingscreen, setloadingscreen] = useState(false);

    const [nameerror, setnameerror] = useState(false);
    const [emailerror, setemailerror] = useState(false);
    const [addresserror, setaddresserror] = useState(false);
    const [documenttypeerror, setdocumenttypeerror] = useState(false);
    const [documentnumbererror, setDocumentnumbererror] = useState(false);
    
    

    const [datachangedprofileimage, setdatachangedprofileimage] = useState(false);
    const [datachangedfrontimage, setdatachangedfrontimage] = useState(false);
    const [datachangedbackimage, setdatachangedbackimage] = useState(false);
    const [alreadyexistingdata, setalreadyexistingdata] = useState({});

    const [message, setmessage] = useState("");

    const [downloadprofileimageurl, setdownloadprofileimageurl] = useState("");
    const [downloadfrontimageurl, setdownloadfrontimageurl] = useState("");
    const [downloadbackimageurl, setdownloadbackimageurl] = useState("");

    const [tempcheck, settempcheck] = useState("");

    
    const [partnerauthid, setpartnerauthid] = useState("xyz123");

    const navigation = useNavigation(); 

    const [dropdownselectedvalue, setdropdownselectedvalue] = useState("Aadhar Card");

    const [notificationtoken, setnotificationtoken] = useState("");

    async function registerForPushNotificationsAsync() {
        console.log("Atleast Called");
          let token;
          if (Constants.isDevice) {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            setfinalstatusnotif(existingStatus);
            console.log("Cp A "+finalStatus);
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

    useEffect(() => {
        registerForPushNotificationsAsync().then(token => {
            setnotificationtoken(token);
          });
    }, [])

    useEffect(() => {
        setpartnerauthid(props.route.params.userid);
        const userid = props.route.params.userid;
        setloadingscreen(true);
        db.collection('partners').doc(userid).get().then(info => {
            setloadingscreen(false);
            console.log(info.data());
            setalreadyexistingdata(info.data());
            onChangeName(info.data().name);
            onChangeEmail(info.data().email);
            onChangeAddress(info.data().address);
            onChangeAadharnumber(info.data().aadharnumber);
            setfrontimage(info.data().frontimage);
            setbackimage(info.data().backimage);
            setprofileimage(info.data().profileimage);
            setdownloadfrontimageurl(info.data().frontimage);
            setdownloadbackimageurl(info.data().backimage);
            setdownloadprofileimageurl(info.data().profileimage);
            setValue(info.data().documenttype);
            console.log("Profile Image");
            console.log(info.data().profileimage);
        }).catch(e => {
            setloadingscreen(false);
            console.log("ERR")
        })
    }, [])

    const attempuploads = () => {


        setnameerror(false);
        setemailerror(false);
        setaddresserror(false);
        setdocumenttypeerror(false);
        setDocumentnumbererror(false);
       
        if(profileimage == null || profileimage == "") {
            setmessage("Please upload profile image");
        }
        else if(frontimage == null || frontimage == "") {
            setmessage("Please upload front side image of address proof");
        }
        else if(backimage == null || backimage == "") {
            setmessage("Please upload back side image of address proof");
        }
        else if(name == null || name  == "" ){
            setmessage("Please enter your name");
            setnameerror(true);
        }
        else if(email == null || email == "") {
            setmessage("Please enter your Email");
            setemailerror(true);
        }
        else if(address == null || address == "") {
            setmessage("Please enter your address");
            setaddresserror(true);
        }
        else if(value == null || value == '-') {
            setmessage("Please select document type");
            setdocumenttypeerror(true);
        }
        else if(aadharnumber == null || aadharnumber == "") {
            setmessage("Please select document number");
            setDocumentnumbererror(true);
        }
        else if(alreadyexistingdata !== undefined && name == alreadyexistingdata.name && email == alreadyexistingdata.email && value == alreadyexistingdata.documenttype &&  address == alreadyexistingdata.address && alreadyexistingdata.aadharnumber == aadharnumber && datachangedbackimage == false && datachangedfrontimage == false && datachangedprofileimage == false) {
            console.log("No need to upload");
            navigation.navigate(CITIESPICKER , {partnerid : partnerauthid});

        }
        else {
            uploadprofileimage();
        }
    }


    const uploadprofileimage = async () => {

        if(datachangedprofileimage == false) {
            uploadfrontimage(profileimage);
        }
        else {
            const userid = partnerauthid;
            const uploadUri = Platform.OS === 'ios' ? profileimage.replace('file://', '') : profileimage;
            let reference = firebase.storage().ref();
            var metadata = {
                contentType: 'image/jpeg',
              };
              const response = await fetch(profileimage);
              const blob = await response.blob();
            let task = reference.child("partners/"+userid+"/profilepicture");
            var message = 'data:image/jpg;base64,' + profileimage;
        
            setloadingscreen(true);
            task.put(blob).then(() => {
                console.log('Image uploaded to the bucket! 1');
                task.getDownloadURL().then((url1) => { 
                    console.log("Profile URL");
                    console.log(url1)
                    setdownloadprofileimageurl(url1);
                    settempcheck(url1);
                    uploadfrontimage(url1);
                })
                setmessage('Image uploaded successfully '+task.getDownloadURL() );
            }).catch((e) => {
                console.log('uploading image error => ', e);
                setmessage('Something went wrong');
                setimageuploading(false);
                setloadingscreen(false);
            });
        }
        
    }

    const uploadfrontimage = async (aa) => {
        if(datachangedfrontimage == false) {
            uploadbackimage(aa,frontimage);
        }
        else {
            const userid = partnerauthid;
            const uploadUri = Platform.OS === 'ios' ? frontimage.replace('file://', '') : frontimage;
            let reference = firebase.storage().ref();
            var metadata = {
                contentType: 'image/jpeg',
              };
              const response = await fetch(frontimage);
              const blob = await response.blob();
            let task = reference.child("partners/"+userid+"/frontimage");
            var message = 'data:image/jpg;base64,' + frontimage;
        
            setloadingscreen(true);
            task.put(blob).then(() => {
                console.log('Image uploaded to the bucket! 2');
                task.getDownloadURL().then((url2) => { 
                    console.log("Front URL");
                    console.log(url2)
                    setdownloadfrontimageurl(url2);
                    uploadbackimage(aa,url2);
                })
                setmessage('Image uploaded successfully '+task.getDownloadURL() );
            }).catch((e) => {
                console.log('uploading image error => ', e);
                setmessage('Something went wrong');
                setimageuploading(false);
                setloadingscreen(false);
            });
        }
       
    }

    const uploadbackimage = async (aa,bb) => {
        if(datachangedbackimage == false) {
            lastupload(aa,bb,backimage);
        }
        else {
            const userid = partnerauthid;
            const uploadUri = Platform.OS === 'ios' ? backimage.replace('file://', '') : backimage;
            let reference = firebase.storage().ref();
            var metadata = {
                contentType: 'image/jpeg',
              };
              const response = await fetch(backimage);
              const blob = await response.blob();
            let task = reference.child("partners/"+userid+"/backimage");
            var message = 'data:image/jpg;base64,' + backimage;
        
            setloadingscreen(true);
            task.put(blob).then(() => {
                console.log('Image uploaded to the bucket! 3');
                task.getDownloadURL().then((url3) => { 
                    console.log("Back URL");
                    console.log(url3)
                    setdownloadbackimageurl(url3);
                    lastupload(aa,bb,url3);
                })
                setmessage('Image uploaded successfully '+task.getDownloadURL() );
            }).catch((e) => {
                console.log('uploading image error => ', e);
                setmessage('Something went wrong');
                setimageuploading(false);
                setloadingscreen(false);
            });
        }
       
    }


    const lastupload = (aa,bb,cc) => {
        const userid = partnerauthid;
        console.log("Profile image url is "+downloadprofileimageurl+" and "+tempcheck);
        
        setloadingscreen(true);
        db.collection('partners').doc(userid).get().then(docSnapshot => {
            if (docSnapshot.exists) {
              console.log("Exist");
              db.collection('partners').doc(userid).update({
                name : name,
                email : email,
                credits : 0,
                address : address,
                aadharnumber : aadharnumber,
                documenttype : value,
                profileimage : aa,
                frontimage : bb,
                backimage : cc,
                mobilenumber : props.route.params.number,
                notificationtoken : notificationtoken
            }).then(done => {
                setmessage("Details Uploaded");
                setloadingscreen(false);
                navigation.navigate(CITIESPICKER , {partnerid : partnerauthid});
            }).catch(ee => {
                console.log(ee);
                setloadingscreen(false);
            })
            }
            else {
                console.log("Not Exist");
                setloadingscreen(true);
                db.collection('partners').doc(userid).set({
                    name : name,
                email : email,
                credits : 0,
                address : address,
                aadharnumber : aadharnumber,
                documenttype : value,
                profileimage : aa,
                frontimage : bb,
                backimage : cc,
                mobilenumber : props.route.params.number,
                notificationtoken : notificationtoken

                }).then(done => {
                    setmessage("Details Uploaded");
                    setloadingscreen(false);
                    navigation.navigate(CITIESPICKER , {partnerid : partnerauthid});
                }).catch(ee => {
                    console.log(ee);
                    setloadingscreen(false);
                })
            }
          });
        
    }


    const openCamera = async () => {
        // Ask the user for the permission to access the camera
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    
        if (permissionResult.granted === false) {
          alert("You've refused to allow this appp to access your camera!");
          return;
        }
    
        const result = await ImagePicker.launchCameraAsync();
    
        // Explore the result
        console.log(result);
    
        if (!result.cancelled) {
            setdatachangedprofileimage(true);
            setprofileimage(result.uri);
        }
      }

    const pickImageprofile = async () => {
        // launchImageLibraryAsync

        let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
          alert('Permission to access camera roll is required!');
          return;
        }
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [3, 3],
          quality: 1,
        });
    
        console.log(result);
    
        if (!result.cancelled) {
            setdatachangedprofileimage(true);
            setprofileimage(result.uri);
            

        }
      };

      const choosebetweentwo = () => {
        Alert.alert(
            "Upload Image from",
            "",
            [
              {
                text: "Camera",
                onPress: () => openCamera()
              },
              {
                text: "Photo Gallery",
                onPress: () => pickImageprofile()
              },
              {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
              }
             
            ]
        )
      }

      const pickImagefront = async () => {

        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    
        if (permissionResult.granted === false) {
          alert("You've refused to allow this appp to access your camera!");
          return;
        }
    
        const result = await ImagePicker.launchCameraAsync();
    
        // Explore the result
        console.log(result);
    
        if (!result.cancelled) {
            setdatachangedfrontimage(true);
            setfrontimage(result.uri);
        }


        // let result = await ImagePicker.launchImageLibraryAsync({
        //   mediaTypes: ImagePicker.MediaTypeOptions.All,
        //   allowsEditing: true,
        //   aspect: [16, 9],
        //   quality: 1,
        // });
    
        // console.log(result);
    
        // if (!result.cancelled) {
        //     setdatachangedfrontimage(true);
        //     setfrontimage(result.uri);
            

        // }
      };



      const pickImageback = async () => {


        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    
        if (permissionResult.granted === false) {
          alert("You've refused to allow this appp to access your camera!");
          return;
        }
    
        const result = await ImagePicker.launchCameraAsync();
    
        // Explore the result
        console.log(result);
    
        if (!result.cancelled) {
            setdatachangedbackimage(true);
            setbackimage(result.uri);
        }



        // let result = await ImagePicker.launchImageLibraryAsync({
        //   mediaTypes: ImagePicker.MediaTypeOptions.All,
        //   allowsEditing: true,
        //   aspect: [16, 9],
        //   quality: 1,
        // });
    
        // console.log(result);
    
        // if (!result.cancelled) {
        //     setdatachangedbackimage(true);
        //     setbackimage(result.uri);
            

        // }
      };

    return (
        <View>
            
            {loadingscreen == true && <Loader visible={loadingscreen} uploading={true}/>} 
            <View style={{marginTop : topgapforheading ,display : 'flex' , flexDirection : 'row',justifyContent : 'space-between' , padding  :10}}>
            
            <TouchableOpacity style={{ width : 60}} onPress={() =>  navigation.pop()}>
                        
                        
                        <Ionicons name="arrow-back-circle" size={36} color={DEEPPINK} />
                        
                        
                </TouchableOpacity>
                <Customtext type='light' style={{padding : 20 , color : DEEPPINK , fontWeight : '700'}}>Step 2 of 8</Customtext>
            </View>
            
            <Customtext type='light' style={{ padding : 20 , fontWeight : '700' , fontSize : 24,color : message == "" ? 'black' : 'red'}}>{message == "" ? "Join Uzify by filling all the informations" : message } </Customtext>
            <KeyboardAwareScrollView style={{paddingBottom : 100}}>
                <View style={{marginTop : 20,display : 'flex', alignItems : 'center'}}>
                    <View style={{width : 120 , height : 120 , borderColor : DEEPPINK , borderWidth : 2 , borderRadius : 60 }}>
                    {profileimage != null && <Image source={{uri : profileimage}} style={{width : '100%' , height : '100%' , resizeMode : 'cover', borderRadius : 60 }}/>}
                    </View>
                    <TouchableOpacity onPress={choosebetweentwo} style = {{padding : 10 , backgroundColor : DEEPPINK , borderRadius : 5 , marginTop : 10}}><Customtext type='light' style={{fontWeight : '800',color : 'white'}}>Choose Image</Customtext></TouchableOpacity>
                    <Customtext type='light' style={{textAlign : 'left',width : '90%',marginTop : 20,fontWeight : '700'}}>Enter your name</Customtext>
                    <TextInput
                               style={styles.input}
                               onChangeText={(text) => onChangeName(text)}
                               value={name}
                               placeholder="Enter Name"
                               placeholderTextColor={GREYISH}    
                    />
                    {nameerror && <View style={{display : 'flex',flexDirection : 'row',alignItems : 'center',paddingLeft : 8}}>
                        <MaterialIcons name="error" size={20} color="red" />
                        <Customtext type='light' style={{paddingLeft : 8, textAlign : 'left',width : '90%',marginTop : 5,fontWeight : '700',color : DEEPPINK}}>Please Enter your name</Customtext>
                    </View>}
                    

                     <Customtext type='light' style={{textAlign : 'left',width : '90%',marginTop : 20,fontWeight : '700'}}>Enter your email</Customtext>
                    <TextInput
                               style={styles.input}
                               onChangeText={(text) => onChangeEmail(text)}
                               value={email}
                               placeholder="Enter Email"
                               placeholderTextColor={GREYISH}    
                    />
                    {emailerror && <View style={{display : 'flex',flexDirection : 'row',alignItems : 'center',paddingLeft : 8}}>
                        <MaterialIcons name="error" size={20} color="red" />
                        <Customtext type='light' style={{paddingLeft : 8, textAlign : 'left',width : '90%',marginTop : 5,fontWeight : '700',color : DEEPPINK}}>Please Enter your email</Customtext>
                    </View>}
                    <Customtext type='light' style={{textAlign : 'left',width : '90%',marginTop : 20,fontWeight : '700'}}>Enter your Address</Customtext>
                    <TextInput
                               style={[styles.input , {height : 120}]}
                               onChangeText={(text) => onChangeAddress(text)}
                               value={address}
                               placeholder="Enter Address"
                               placeholderTextColor={GREYISH}
                               multiline={true}
                               underlineColorAndroid='transparent'    
                    />
                    {addresserror && <View style={{display : 'flex',flexDirection : 'row',alignItems : 'center',paddingLeft : 8}}>
                        <MaterialIcons name="error" size={20} color="red" />
                        <Customtext type='light' style={{paddingLeft : 8, textAlign : 'left',width : '90%',marginTop : 5,fontWeight : '700',color : DEEPPINK}}>Please Enter your address</Customtext>
                    </View>}
                    <Customtext type='light' style={{textAlign : 'left',width : '90%',marginTop : 20,fontWeight : '700'}}>Pick Document you are willing to upload</Customtext>

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
                    {documenttypeerror && <View style={{display : 'flex',flexDirection : 'row',alignItems : 'center',paddingLeft : 8}}>
                        <MaterialIcons name="error" size={20} color="red" />
                        <Customtext type='light' style={{paddingLeft : 8, textAlign : 'left',width : '90%',marginTop : 5,fontWeight : '700',color : DEEPPINK}}>Please pick one document type</Customtext>
                    </View>}
                    <Customtext type='light' style={{textAlign : 'left',width : '90%',marginTop : 0,fontWeight : '700'}}>Enter {value !== undefined ? value : 'document'} Number</Customtext>
                    <TextInput
                               style={styles.input}
                               onChangeText={(text) => onChangeAadharnumber(text)}
                               value={aadharnumber}
                               placeholder={"Enter "+value !== undefined ? value : 'document'+" Number"}
                               placeholderTextColor={GREYISH}    
                    />
                    {documentnumbererror && <View style={{display : 'flex',flexDirection : 'row',alignItems : 'center',paddingLeft : 8}}>
                        <MaterialIcons name="error" size={20} color="red" />
                        <Customtext type='light' style={{paddingLeft : 8, textAlign : 'left',width : '90%',marginTop : 5,fontWeight : '700',color : DEEPPINK}}>Please Enter your document number</Customtext>
                    </View>}
                    <View style={{marginTop : 20 , display : 'flex' , flexDirection : 'row' , width : '90%' }}>
                        <View style = {{width : '50%',padding : 10 , display : 'flex' , alignItems : 'center'}}>
                            <Customtext type='light' style={{padding : 5 , fontWeight : '700',textAlign : 'center'}}>Upload Front side image of your {value}</Customtext>
                            <View style={{width : 100,height : 100 , backgroundColor : GREYISH , borderRadius : 5}}>
                                {frontimage != null  && <Image source={{uri : frontimage}} style={{width : 100 , height : 100 , resizeMode : 'cover', borderRadius : 5 }}/> }
                            </View>
                            <TouchableOpacity onPress={pickImagefront}  style = {{padding : 8 , backgroundColor : DEEPPINK , borderRadius : 5 , marginTop : 10}}><Customtext type='light' style={{fontWeight : '800',color : 'white'}}>Choose Image</Customtext></TouchableOpacity>
                        </View>
                        <View style = {{width : '50%',padding : 10, display : 'flex' , alignItems : 'center'}}>
                            <Customtext type='light' style={{padding : 5 , fontWeight : '700',textAlign : 'center'}}>Upload Back side image of your {value}</Customtext>
                            <View style={{width : 100,height : 100 , backgroundColor : GREYISH , borderRadius : 5}}>
                                {backimage != null  &&<Image source={{uri : backimage}} style={{width : 100 , height : 100 , resizeMode : 'cover', borderRadius : 5 }}/> }
                            </View>
                            <TouchableOpacity onPress={pickImageback}  style = {{padding : 8 , backgroundColor : DEEPPINK , borderRadius : 5 , marginTop : 10}}><Customtext type='light' style={{fontWeight : '800',color : 'white'}}>Choose Image</Customtext></TouchableOpacity>
                        </View>
                    </View>

                    <TouchableOpacity onPress={attempuploads}  style = {{padding : 12 , backgroundColor : DEEPPINK , borderRadius : 5 , marginTop : 60,marginBottom : 300 , width : '90%'}}><Customtext type='light' style={{fontWeight : '800',color : 'white',textAlign : 'center',fontSize : 18}}>Next</Customtext></TouchableOpacity>


                </View>

            </KeyboardAwareScrollView>
           
        </View>
    )
}

export default index
