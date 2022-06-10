import React , {useState , useEffect } from 'react'
import { View, Text, TouchableOpacity, Image, TextInput, Alert, ScrollView, Dimensions , FlatList } from 'react-native'
import { DEEPPINK, GREYISH, LIGHTPINK, topgapforheading } from '../../Constants/Colors'
import { Ionicons } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as ImagePicker from 'expo-image-picker';
import * as firebase from 'firebase';
import Loader from '../../components/Loader';
import db from '../../config/firebase';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { CERTIFICATEEACHALBUM, DATAFILLCOMPLETED, WORKEACHALBUM, WORKIMAGESPORTAL } from '../../Constants/routesName.js';
import Customtext from '../../components/Customtext';
import Prompt from 'react-native-prompt-crossplatform';
import { Platform } from 'react-native';






const index = (props) => {
    const [allimages, setallimages] = useState([]);
    const [loadingscreen, setloadingscreen] = useState(false);
    const [message, setmessage] = useState("");
    const {width,height} = Dimensions.get('screen');
    const navigation = useNavigation(); 
    const [partnerauthid, setpartnerauthid] = useState("");
    const [profileimage, setprofileimage] = useState(null);

    const [displaynewalbumdialog, setdisplaynewalbumdialog] = useState(false);
    const [newalbumtext, setnewalbumtext] = useState("");



    useEffect(() => {
        setpartnerauthid(props.route.params.partnerid);
        fetchallalbums();
    }, [])



    const tappedalbum = (item) => {
        // navigation.navigate(CERTIFICATEEACHALBUM , {item : item,partnerid : partnerauthid});
        
    }

    const deletealbum = (item) => {


        // if(Platform.OS === 'ios') {
            Alert.alert(
                "Delete Image ?",
                "Are you sure you want to delete this image",
                [
                  {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                  },
                  {
                    text: "OK",
                    onPress: () => {
                        const userid = partnerauthid;
                        setloadingscreen(true);
                        db.collection('partners').doc(userid).collection('certificateimages').doc('certificateimages').get().then(ss => {
                            var exist = ss.data().images;
                            var copy = [];
                            for (each in exist) {
                                if(exist[each].imageurl != item.imageurl) {
                                    copy.push(exist[each]);
                                }
                            }
                            db.collection('partners').doc(userid).collection('certificateimages').doc('certificateimages').set({
                                images : copy
                            }).then(doned => {
                                setloadingscreen(false);
                                setallimages(copy);
                            })
                            
                        }).catch(ee => {
                            setloadingscreen(false);
                        })
                    }
                  }
                ]
              );
        // }
        // else {
        //     prompt(
        //         'Delete Album ?',
        //         "Are you sure you want to delete album "+item.albumname,
        //         [
        //          {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        //          {text: 'OK', onPress: password => {
        //             const userid = partnerauthid;
        //             setloadingscreen(true);
                    
        //             db.collection('partners').doc(userid).collection('certificateimages').doc(item.id).delete().then(ss => {
        //                 fetchallalbums();
        //                 setloadingscreen(false);
        //             }).catch(ee => {
        //                 setloadingscreen(false);
        //                 console.log(err);
        //             })
        //          }},
        //         ]
        //     );
        // }
   
    }

    const keyextract = (item) => {
        return item.id
      }
      const renderitem = ({item}) => { return <TouchableOpacity onPress={() => {}} style={{width : width/2.5 , height : width/2.0,margin : 10 , backgroundColor : LIGHTPINK , borderRadius : 5,marginBottom : 16,overflow : 'hidden'}}>
          <View style={{backgroundColor : 'white',display : 'flex',flexDirection : 'row',justifyContent : 'space-between',padding : 10,alignItems : 'center',borderRadius : 10}}>
            <Customtext type='light' style={{textAlign : 'center',backgroundColor : 'white',fontWeight : '700',borderRadius  :5}}>{item.albumname}</Customtext>
            <TouchableOpacity onPress={() => deletealbum(item)}><AntDesign name="delete" size={24} color="black" /></TouchableOpacity> 
          </View>
          <Image source={{uri : item.imageurl }} style={{resizeMode : "cover",width : '100%',height : '100%',borderRadius : 10}}/>

      </TouchableOpacity>
      }

    const fetchallalbums = () => {
        const userid = props.route.params.partnerid;
        setloadingscreen(true);
        db.collection('partners').doc(userid).collection('certificateimages').doc("certificateimages").get().then(sd => {
            setallimages(sd.data().images);
            setloadingscreen(false);
        }).catch(eee => {
            setloadingscreen(false);
        })
    }

    const askforalbum = () => {
        // setdisplaynewalbumdialog(true);

        // if(Platform.OS === 'ios') {
        //     Alert.prompt(
        //         "Enter new album name",
        //         "",
        //         [
        //           {
        //             text: "Cancel",
        //             onPress: () => console.log("Cancel Pressed"),
        //             style: "cancel"
        //           },
        //           {
        //             text: "OK",
        //             onPress: albumname => {
        //                 const userid = partnerauthid;
        //                 setloadingscreen(true);
        //                 var randid = db.collection('partners').doc(userid).collection('certificateimages').doc().id;
        //                 db.collection('partners').doc(userid).collection('certificateimages').doc(randid).set({
        //                     createdon : Math.round((new Date()).getTime() / 1000),
        //                     albumname : albumname,
        //                     images : []
        //                 }).then(ss => {
        //                     fetchallalbums();
        //                     setloadingscreen(false);
        //                 }).catch(ee => {
        //                     setloadingscreen(false);
        //                     console.log(err);
        //                 })
        //             }
        //           }
        //         ]
        //       );
        // }
        // else {
        //     prompt(
        //         'Enter new album name',
        //         '',
        //         [
        //          {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        //          {text: 'OK', onPress: password => {
        //             const userid = partnerauthid;
        //             setloadingscreen(true);
        //             var randid = db.collection('partners').doc(userid).collection('certificateimages').doc().id;
        //             db.collection('partners').doc(userid).collection('certificateimages').doc(randid).set({
        //                 createdon : Math.round((new Date()).getTime() / 1000),
        //                 albumname : albumname,
        //                 images : []
        //             }).then(ss => {
        //                 fetchallalbums();
        //                 setloadingscreen(false);
        //             }).catch(ee => {
        //                 setloadingscreen(false);
        //                 console.log(err);
        //             })
        //          }},
        //         ],
        //         {
        //             type: 'secure-text',
        //             cancelable: false,
        //             defaultValue: '',
        //             placeholder: 'Enter Album Name'
        //         }
        //     );
        // }
 



        
    }


    const pickImageprofile = async () => {
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    
        if (permissionResult.granted === false) {
          alert("You've refused to allow this appp to access your camera!");
          return;
        }
    
        const result = await ImagePicker.launchCameraAsync();
    
        // Explore the result
    
        if (!result.cancelled) {
            uploadprofileimage(result.uri);
            setprofileimage(result.uri);
        }
      };



      const uploadprofileimage = async (pim) => {

        
        const userid = partnerauthid;
        const uploadUri = Platform.OS === 'ios' ? pim.replace('file://', '') : pim;
        let reference = firebase.storage().ref();
        var metadata = {
            contentType: 'image/jpeg',
          };
          const response = await fetch(pim);
          const blob = await response.blob();
          var currentTimeInSeconds=Math.floor(Date.now()/1000); //unix timestamp in seconds


        let task = reference.child("partners/"+userid+"/workimages/"+currentTimeInSeconds);
        var message = 'data:image/jpg;base64,' + pim;
    
        setloadingscreen(true);
        var exisitngarray = [];
        task.put(blob).then(() => {
            task.getDownloadURL().then((url) => { console.log(url)
                db.collection('partners').doc(userid).collection('certificateimages').doc("certificateimages").get().then(olddata => {
                    if(olddata.data() != undefined) {
                        if(olddata.data().images != undefined) {
                            exisitngarray = olddata.data().images;
                        }
                    }
                    
                    exisitngarray.push({imageurl : url,storagelocation : currentTimeInSeconds});
                    var ccc = allimages;
                    ccc.push({imageurl : url,storagelocation : currentTimeInSeconds});
                    setallimages(ccc);
                    
                    db.collection('partners').doc(userid).collection('certificateimages').doc("certificateimages").set({
                        images : exisitngarray
                        
                    }).then(dododod => {
                        setprofileimage(null);
                        setloadingscreen(false);
                        // fetchallimages();
                    })
                    .catch(erererrr => {
                        setloadingscreen(false);
                    })
                }).catch(olderror => {

                })
                


            })
            setmessage('Image uploaded successfully ' );
        }).catch((e) => {
            setmessage('Something went wrong');
            setloadingscreen(false);
        });
    
    
}

    const proceedtoconfirm = () => {
        
        navigation.navigate(WORKIMAGESPORTAL , {partnerid : partnerauthid});

    }

    return (
        <ScrollView showsVerticalScrollIndicator={false}>



            {loadingscreen == true && <Loader visible={loadingscreen} uploading={true}/>} 

            <Prompt
     title="Enter new album name"
     placeholder="Enter new album name"
     isVisible={displaynewalbumdialog}
     onChangeText={(text) => {
        setnewalbumtext(text);
     }}
     onCancel={() => {
       setdisplaynewalbumdialog(false);
     }}
     onSubmit={() => {
        const userid = partnerauthid;
        setloadingscreen(true);
        var randid = db.collection('partners').doc(userid).collection('certificateimages').doc().id;
        db.collection('partners').doc(userid).collection('certificateimages').doc(randid).set({
            createdon : Math.round((new Date()).getTime() / 1000),
            albumname : newalbumtext,
            images : []
        }).then(ss => {
            fetchallalbums();
            setloadingscreen(false);
            setdisplaynewalbumdialog(false);
        }).catch(ee => {
            setloadingscreen(false);
            setdisplaynewalbumdialog(false);
        })
        
     }}
  />

            <View style={{marginTop : topgapforheading ,display : 'flex' , flexDirection : 'row',justifyContent : 'space-between' , padding  :10}}>
                <TouchableOpacity style={{ width : 60}} onPress={() =>  navigation.pop()}>
                    <Ionicons name="arrow-back-circle" size={36} color={DEEPPINK} />
                </TouchableOpacity>
                <Customtext type='light' style={{padding : 20 , color : DEEPPINK , fontWeight : '700'}}>Step 7 of 8</Customtext>
            </View>
            <Customtext type='light' style={{ padding : 20 , fontWeight : '700' , fontSize : 22}}>{message == "" ? "Upload Certificate Images (Optional). This will only be shown to Admin" : message } </Customtext>
            <TouchableOpacity onPress={pickImageprofile} style={{padding : 10, backgroundColor : DEEPPINK , width : 200,margin : 20,marginTop : 10,borderRadius : 5}}><Customtext type='light' style={{textAlign : 'center',color : 'white',fontWeight : '700'}}>Upload Image</Customtext></TouchableOpacity>

            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{padding : 20,minHeight : 0.5 * height}}>
                    
                    <FlatList 
                        data = {allimages}
                        keyExtractor = {keyextract}
                        renderItem={renderitem}
                        horizontal={false}
                        numColumns = {2}
                        scrollEnabled={true}
                        contentContainerStyle={{
                            flexGrow: 1,
                            }}
                    />
                </View>
                <TouchableOpacity onPress={proceedtoconfirm} style={{padding : 15, backgroundColor : DEEPPINK , width : '90%',margin : 20,marginTop : 10,borderRadius : 5}}><Customtext type='light' style={{textAlign : 'center',color : 'white',fontWeight : '700',fontSize : 18}}>Next</Customtext></TouchableOpacity>

            </ScrollView>

        </ScrollView>
    )
}

export default index
