import React, {useEffect , useState} from 'react'
import { View, Text , Image , TextInput , ScrollView, Alert } from 'react-native'
import styles from './style.js';
import { useNavigation } from '@react-navigation/native';
import db from '../../config/firebase.js';
import * as firebase from 'firebase';
import { DEEPPINK, GREYISH, LIGHTPINK, topgapforheading } from '../../Constants/Colors.js';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Entypo } from '@expo/vector-icons'; 
import { Ionicons } from '@expo/vector-icons'; 
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as ImagePicker from 'expo-image-picker';
import Loader from '../../components/Loader';
import Customtext from '../../components/Customtext';








const style = (props) => {
  const [loadingscreen, setloadingscreen] = useState(false);

const [imagenewpath, setimagenewpath] = useState(null);
const [imageuploading, setimageuploading] = useState(false);
const [imageuploadstatus, setimageuploadstatus] = useState("");

    const [finalpincode, setfinalpincode] = useState("")
    const navigation = useNavigation(); 
    const [currentuser, setcurrentuser] = useState(null);
    const [currentuserdetails, setcurrentuserdetails] = useState({});

    const [currentuserimage, setcurrentuserimage] = useState(null);

    const [fieldsisenabled, setfieldsisenabled] = useState(false);

    useEffect(() => {
        (async () => {
          if (Platform.OS !== 'web') {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
              alert('Sorry, we need camera roll permissions to make this work!');
            }
          }
        })();
      }, []);





      const openCamera = async () => {
        // Ask the user for the permission to access the camera
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    
        if (permissionResult.granted === false) {
          alert("You've refused to allow this appp to access your camera!");
          return;
        }
    
        const result = await ImagePicker.launchCameraAsync();
    
        // Explore the result
    
        if (!result.cancelled) {
          setimagenewpath(result.uri);
          setimageuploadstatus(true);
          const uploadUri = Platform.OS === 'ios' ? result.uri.replace('file://', '') : result.uri;
          let reference = firebase.storage().ref();
          var metadata = {
              contentType: 'image/jpeg',
            };
            const response = await fetch(result.uri);
            const blob = await response.blob();
          let task = reference.child("usersprofilepictures/"+currentuser.uid);
          var message = 'data:image/jpg;base64,' + result.uri;
      
          setloadingscreen(true);
          task.put(blob).then(() => {
              console.log('Image uploaded to the bucket! ');
              task.getDownloadURL().then((url) => { console.log(url)
                  db.collection('partners').doc(currentuser.uid).update({
                      profileimage : url
                  }).then(done => {
                      setcurrentuserimage(url);
                      setimageuploading(false);
                      setloadingscreen(false);
                      alert('Profile Picture Updated');
                      props.route.params.setneedmorefetch(!props.route.params.needmorefetch);
                  }).catch((eee) => {
                      setloadingscreen(false);
                      setimageuploading(false);
                  })
              
              })
              setimageuploadstatus('Image uploaded successfully '+task.getDownloadURL() );
              
              
              
          }).catch((e) => {
              setimageuploadstatus('Something went wrong');
              setimageuploading(false);
              setloadingscreen(false);
          });
        }
      }


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
                onPress: () => pickImage()
              },
              {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
              }
             
            ]
        )
      }

      const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [3, 3],
          quality: 1,
        });
    
    
        if (!result.cancelled) {
            setimagenewpath(result.uri);
            setimageuploadstatus(true);
            const uploadUri = Platform.OS === 'ios' ? result.uri.replace('file://', '') : result.uri;
            let reference = firebase.storage().ref();
            var metadata = {
                contentType: 'image/jpeg',
              };
              const response = await fetch(result.uri);
              const blob = await response.blob();
            let task = reference.child("usersprofilepictures/"+currentuser.uid);
            var message = 'data:image/jpg;base64,' + result.uri;
        
            setloadingscreen(true);
            task.put(blob).then(() => {
                task.getDownloadURL().then((url) => { console.log(url)
                    db.collection('partners').doc(currentuser.uid).update({
                        profileimage : url
                    }).then(done => {
                        setcurrentuserimage(url);
                        setimageuploading(false);
                        setloadingscreen(false);
                        alert('Profile Picture Updated');
                        props.route.params.setneedmorefetch(!props.route.params.needmorefetch);
                    }).catch((eee) => {
                        setloadingscreen(false);
                        setimageuploading(false);
                    })
                
                })
                setimageuploadstatus('Image uploaded successfully '+task.getDownloadURL() );
                
                
                
            }).catch((e) => {
                setimageuploadstatus('Something went wrong');
                setimageuploading(false);
                setloadingscreen(false);
            });
        }
      };

    

      const editdetails = () => {
        setloadingscreen(true);
        db.collection('partners').doc(currentuser.uid).update({
            name : currentuserdetails.name
            
        }).then((ss) => {
          setloadingscreen(false);
            alert('Profile Updated');
            props.route.params.setneedmorefetch(!props.route.params.needmorefetch);
        }).catch(ee => {
          setloadingscreen(false);
        })
      }




    useEffect(() => {
        firebase.auth().onAuthStateChanged((user) => {
           if (user) {
             setcurrentuser(user);
             setloadingscreen(true);
             db.collection('partners').doc(user.uid).get().then((df) => {
                 setcurrentuserimage(df.data().profileimage);
                 setcurrentuserdetails(df.data());
                
                 setloadingscreen(false);
             }).catch(err => {
               setloadingscreen(false);
             });
           }
           else {
               setcurrentuser(null);
           }
        });

     }, [])
    return (
        <KeyboardAwareScrollView>
           {loadingscreen == true && <Loader visible={loadingscreen}/>} 
                      <View style={{marginTop : topgapforheading , position : 'relative',display : 'flex',flexDirection : 'row',alignItems : 'center'}}>
                <TouchableOpacity style={{ width : 60 , zIndex : 1035 }} onPress={() => navigation.pop()}>
                        <View style={{borderRadius : 10 , padding : 10 , zIndex : 1035}}>
                        <Ionicons name="arrow-back-circle" size={36} color={DEEPPINK} style={{zIndex : 1035}} />
                        </View>
                    </TouchableOpacity>
                    <Customtext type='light' style={{fontWeight : '800',fontSize : 18}}>My Profile</Customtext>
                  

                </View>
            <View style={{marginTop : topgapforheading, display : 'flex', alignItems : 'center',justifyContent : 'space-between',paddingHorizontal : 20,paddingBottom : 10}}>
               
                    {/* { 
                    <View style={{width : 100 , height : 100 , borderRadius : 50 , borderWidth : 1 , borderColor : LIGHTPINK}}>
                        {currentuser === null ? <View style={{width : 100, height : 100, borderRadius : 50,display : 'flex',justifyContent : 'center',alignItems : 'center',backgroundColor : LIGHTPINK}}><Ionicons name="person" size={20} color="black" /></View>: currentuserimage ? <Image source={{uri : currentuserimage}} style={{width : 100, height : 100, borderRadius : 50}} /> : <View style={{width : 100, height : 100, borderRadius : 50,display : 'flex',justifyContent : 'center',alignItems : 'center',backgroundColor : LIGHTPINK}}><Customtext type='light' style={{fontWeight : '700',fontSize : 28}}>{currentuserdetails.name != undefined ? currentuserdetails.name[0] : ""}</Customtext></View>}
                    </View>
                    } */}
                    {/* <TouchableOpacity onPress={pickImage} style={{padding : 10,backgroundColor : DEEPPINK,marginTop : 10,borderRadius : 5}}><Customtext type='light' style={{textAlign : 'center',color : 'white',fontWeight : '700'}}>Edit Image</Customtext></TouchableOpacity> */}
                     
                    <View style={{marginTop : 10, width : '100%'}}>
                        <Customtext type='light' style={{color : 'black' , fontWeight : '600',marginBottom : 5}}>Name</Customtext>
                        <TextInput
                                   style={styles.input}
                                   onChangeText={(text) => {}}
                                   value={currentuserdetails.name}
                                   placeholder="Enter Name"
                                   placeholderTextColor={GREYISH}
                                   editable={fieldsisenabled}
                                   
                               />
                    </View>
                    <View style={{marginTop : 20, width : '100%'}}>
                        <Customtext type='light' style={{color : 'black' , fontWeight : '600',marginBottom : 5}}>Mobile Number</Customtext>
                        <TextInput
                                   style={styles.input}
                                   onChangeText={(text) => {}}
                                   value={currentuserdetails.mobilenumber}
                                   placeholder="Enter Mobile Number"
                                   placeholderTextColor={GREYISH}
                                   editable={fieldsisenabled}
                                   
                               />
                    </View>

          
                    <View style={{marginTop : 20, width : '100%'}}>
                        <Customtext type='light' style={{color : 'black' , fontWeight : '600',marginBottom : 5}}>About Me</Customtext>
                        <TextInput
                                   style={[styles.input,{height : 120}]}
                                   onChangeText={(text) => {}}
                                   value={currentuserdetails.aboutme}
                                   placeholder="Enter Something about yourself"
                                   placeholderTextColor={GREYISH}
                                   editable={fieldsisenabled}
                                   multiline={true}
                                   
                               />
                    </View>

                    <View style={{marginTop : 20, width : '100%'}}>
                        <Customtext type='light' style={{color : 'black' , fontWeight : '600',marginBottom : 5}}>Address</Customtext>
                        <TextInput
                                   style={styles.input}
                                   onChangeText={(text) => {}}
                                   value={currentuserdetails.address}
                                   placeholder="Enter Address"
                                   placeholderTextColor={GREYISH}
                                   editable={fieldsisenabled}
                                   
                               />
                    </View>
                    <View style={{marginTop : 20, width : '100%'}}>
                        <Customtext type='light' style={{color : 'black' , fontWeight : '600',marginBottom : 5}}>Alternate Number</Customtext>
                        <TextInput
                                   style={styles.input}
                                   onChangeText={(text) => {}}
                                   value={currentuserdetails.alternatenumber}
                                   placeholder="Enter Alternate Number"
                                   placeholderTextColor={GREYISH}
                                   editable={fieldsisenabled}
                                   
                               />
                    </View>

                    <View style={{marginTop : 20, width : '100%'}}>
                        <Customtext type='light' style={{color : 'black' , fontWeight : '600',marginBottom : 5}}>Brands Possess</Customtext>
                        <TextInput
                                   style={[styles.input,{height : 120}]}
                                   onChangeText={(text) => {}}
                                   value={currentuserdetails.brandspossess}
                                   placeholder="Enter Brands Possess by you"
                                   placeholderTextColor={GREYISH}
                                   editable={fieldsisenabled}
                                   multiline={true}
                                   
                               />
                    </View>

                    <View style={{marginTop : 20, width : '100%'}}>
                        <Customtext type='light' style={{color : 'black' , fontWeight : '600',marginBottom : 5}}>City</Customtext>
                        <TextInput
                                   style={styles.input}
                                   onChangeText={(text) => {}}
                                   value={currentuserdetails.city}
                                   placeholder="Enter City"
                                   placeholderTextColor={GREYISH}
                                   editable={fieldsisenabled}
                                   
                               />
                    </View>
                    <View style={{marginTop : 20, width : '100%'}}>
                        <Customtext type='light' style={{color : 'black' , fontWeight : '600',marginBottom : 5}}>Email</Customtext>
                        <TextInput
                                   style={styles.input}
                                   onChangeText={(text) => {}}
                                   value={currentuserdetails.email}
                                   placeholder="Enter Email"
                                   placeholderTextColor={GREYISH}
                                   editable={fieldsisenabled}
                                   
                               />
                    </View>


                    <View style={{marginTop : 20, width : '100%'}}>
                        <Customtext type='light' style={{color : 'black' , fontWeight : '600',marginBottom : 5}}>Facebook Link</Customtext>
                        <TextInput
                                   style={styles.input}
                                   onChangeText={(text) => {}}
                                   value={currentuserdetails.fblink}
                                   placeholder="Enter Facebook Profile Link"
                                   placeholderTextColor={GREYISH}
                                   editable={fieldsisenabled}
                                   
                               />
                    </View>
                    <View style={{marginTop : 20, width : '100%'}}>
                        <Customtext type='light' style={{color : 'black' , fontWeight : '600',marginBottom : 5}}>Instagram Link</Customtext>
                        <TextInput
                                   style={styles.input}
                                   onChangeText={(text) => {}}
                                   value={currentuserdetails.instalink}
                                   placeholder="Enter Instagram Profile Link"
                                   placeholderTextColor={GREYISH}
                                   editable={fieldsisenabled}
                                   
                               />
                    </View>



                    <View style={{marginTop : 20, width : '100%'}}>
                        <Customtext type='light' style={{color : 'black' , fontWeight : '600',marginBottom : 5}}>Website Link</Customtext>
                        <TextInput
                                   style={styles.input}
                                   onChangeText={(text) => {}}
                                   value={currentuserdetails.weblink}
                                   placeholder="Enter Website Link"
                                   placeholderTextColor={GREYISH}
                                   editable={fieldsisenabled}
                                   
                               />
                    </View>
                    <View style={{marginTop : 20, width : '100%'}}>
                        <Customtext type='light' style={{color : 'black' , fontWeight : '600',marginBottom : 5}}>Work Experience in Months</Customtext>
                        <TextInput
                                   style={styles.input}
                                   onChangeText={(text) => {}}
                                   value={currentuserdetails.workexperience}
                                   placeholder="Enter Work Experience"
                                   placeholderTextColor={GREYISH}
                                   editable={fieldsisenabled}
                                   
                               />
                    </View>
                    <View style={{marginTop : 20, width : '100%'}}>
                        <Customtext type='light' style={{color : 'black' , fontWeight : '600',marginBottom : 5}}>{currentuserdetails.documenttype} Number</Customtext>
                        <TextInput
                                   style={styles.input}
                                   onChangeText={(text) => {}}
                                   value={currentuserdetails.aadharnumber}
                                   placeholder="Enter Document No"
                                   placeholderTextColor={GREYISH}
                                   editable={fieldsisenabled}
                                   
                               />
                    </View>
                    <View style={{padding : 20 , display : 'flex',flexDirection : 'row',justifyContent : 'space-between'}}>
                    <Image source={{uri : currentuserdetails.frontimage}} style={{width : 100, height : 100, borderRadius : 5,margin : 5}} />
                    <Image source={{uri : currentuserdetails.backimage}} style={{width : 100, height : 100, borderRadius : 5,margin : 5}} />
                    </View>

                    {/* <TouchableOpacity onPress={editdetails} style={{padding : 10,backgroundColor : DEEPPINK,marginTop : 10,borderRadius : 5}}><Customtext type='light' style={{textAlign : 'center',color : 'white',fontWeight : '700'}}>Save Changes</Customtext></TouchableOpacity> */}
               
            </View> 
        </KeyboardAwareScrollView>
    )
}

export default style