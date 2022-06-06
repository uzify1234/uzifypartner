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
import { DATAFILLCOMPLETED, WORKEACHALBUM } from '../../Constants/routesName.js';
import Customtext from '../../components/Customtext';
import Prompt from 'react-native-prompt-crossplatform';






const index = (props) => {
    const [allalbums, setallalbums] = useState([]);
    const [loadingscreen, setloadingscreen] = useState(false);
    const [message, setmessage] = useState("");
    const {width,height} = Dimensions.get('screen');
    const navigation = useNavigation(); 
    const [partnerauthid, setpartnerauthid] = useState("");


    const [displaynewalbumdialog, setdisplaynewalbumdialog] = useState(false);
    const [newalbumtext, setnewalbumtext] = useState("");



    useEffect(() => {
        setpartnerauthid(props.route.params.partnerid);
        fetchallalbums();
    }, [])



    const tappedalbum = (item) => {
        navigation.navigate(WORKEACHALBUM , {item : item,partnerid : partnerauthid});
        
    }

    const deletealbum = (item) => {
        Alert.alert(
            "Delete Album ?",
            "Are you sure you want to delete album "+item.albumname,
            [
              {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
              },
              {
                text: "OK",
                onPress: albumname => {
                    const userid = partnerauthid;
                    setloadingscreen(true);
                    
                    db.collection('partners').doc(userid).collection('workimages').doc(item.id).delete().then(ss => {
                        fetchallalbums();
                        setloadingscreen(false);
                    }).catch(ee => {
                        setloadingscreen(false);
                        console.log(err);
                    })
                }
              }
            ]
          );
    }

    const keyextract = (item) => {
        return item.id
      }
      const renderitem = ({item}) => { return <TouchableOpacity onPress={() => tappedalbum(item)} style={{width : width/2.5 , height : width/2.5,margin : 10 , backgroundColor : LIGHTPINK , borderRadius : 5}}>
          <View style={{backgroundColor : 'white',display : 'flex',flexDirection : 'row',justifyContent : 'space-between',padding : 10,alignItems : 'center'}}>
            <Customtext type='light' style={{textAlign : 'center',backgroundColor : 'white',fontWeight : '700',borderRadius  :5}}>{item.albumname}</Customtext>
            <TouchableOpacity onPress={() => deletealbum(item)}><AntDesign name="delete" size={24} color="black" /></TouchableOpacity> 
          </View>
         {item.images.length > 0 && <Image source={{url : item.images[0].imageurl }} style={{resizeMode : "cover",width : '100%',height : '100%'}}/>}

      </TouchableOpacity>
      }

    const fetchallalbums = () => {
        const userid = props.route.params.partnerid;
        setloadingscreen(true);
        db.collection('partners').doc(userid).collection('workimages').get().then(sd => {
            var tmp = [];
            sd.docs.map(each => {
                var x = {id :each.id, albumname : each.data().albumname , images : each.data().images}
                tmp.push(x);
                console.log(x);
            })
            setallalbums(tmp);
            setloadingscreen(false);
        }).catch(eee => {
            setloadingscreen(false);
        })
    }

    const askforalbum = () => {
        setdisplaynewalbumdialog(true);
        // Alert.prompt(
        //     "Enter new album name",
        //     "",
        //     [
        //       {
        //         text: "Cancel",
        //         onPress: () => console.log("Cancel Pressed"),
        //         style: "cancel"
        //       },
        //       {
        //         text: "OK",
        //         onPress: albumname => {
        //             const userid = partnerauthid;
        //             setloadingscreen(true);
        //             var randid = db.collection('partners').doc(userid).collection('workimages').doc().id;
        //             db.collection('partners').doc(userid).collection('workimages').doc(randid).set({
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
        //         }
        //       }
        //     ]
        //   );
        
    }

    const proceedtoconfirm = () => {
        setloadingscreen(true);
        db.collection('partners').doc(partnerauthid).update({
            submissiondone : true,
            isactive : true,
            errorreportedbyadmin : false,
            updatedon : Math.round((new Date()).getTime() / 1000),
            seenbyadmin : false,
            partnerrating : 5,
            servicesprovided : 0,
            adminaccepted : false
        }).then(up => {
            setloadingscreen(false);
            navigation.navigate(DATAFILLCOMPLETED , {partnerid : partnerauthid});
        }).catch(ef => {
            setloadingscreen(false);
        });
        

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
                    var randid = db.collection('partners').doc(userid).collection('workimages').doc().id;
                    db.collection('partners').doc(userid).collection('workimages').doc(randid).set({
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
                        console.log(err);
                    })
        
        
     }}
  />

            <View style={{marginTop : topgapforheading ,display : 'flex' , flexDirection : 'row',justifyContent : 'space-between' , padding  :10}}>
                <TouchableOpacity style={{ width : 60}} onPress={() =>  navigation.pop()}>
                    <Ionicons name="arrow-back-circle" size={36} color={DEEPPINK} />
                </TouchableOpacity>
                <Customtext type='heavy' style={{padding : 20 , color : DEEPPINK , fontWeight : '700'}}>Step 8 of 8</Customtext>
            </View>
            <Customtext type='light' style={{ padding : 20 , fontWeight : '700' , fontSize : 22}}>{message == "" ? "Create Albums and upload pictures (Optional). This will be visible to all customers as well" : message } </Customtext>
            <TouchableOpacity onPress={askforalbum} style={{padding : 10, backgroundColor : DEEPPINK , width : 200,margin : 20,marginTop : 10,borderRadius : 5}}><Customtext type='light' style={{textAlign : 'center',color : 'white',fontWeight : '700'}}>Create New Album</Customtext></TouchableOpacity>

            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{padding : 20,minHeight : 0.5 * height}}>
                    
                    <FlatList 
                        data = {allalbums}
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
                <TouchableOpacity onPress={proceedtoconfirm} style={{padding : 18, backgroundColor : DEEPPINK , width : '90%',margin : 20,marginTop : 10,borderRadius : 5}}><Customtext type='light' style={{textAlign : 'center',color : 'white',fontWeight : '700',fontSize : 18}}>Submit my data for verification</Customtext></TouchableOpacity>

            </ScrollView>

        </ScrollView>
    )
}

export default index
