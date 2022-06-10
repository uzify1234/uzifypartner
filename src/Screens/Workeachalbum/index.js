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
import Customtext from '../../components/Customtext';


const index = (props) => {
    const [allimages, setallimages] = useState([]);
    const [loadingscreen, setloadingscreen] = useState(false);
    const [message, setmessage] = useState("");
    const {width,height} = Dimensions.get('screen');
    const [currentalbum, setcurrentalbum] = useState({});
    const navigation = useNavigation(); 
    const [profileimage, setprofileimage] = useState(null);
    const [partnerauthid, setpartnerauthid] = useState("xyz123");


    const [refresh, setrefresh] = useState(false);



    useEffect(() => {
        setpartnerauthid(props.route.params.partnerid);
        setcurrentalbum(props.route.params.item);
        fetchallimages();
        // setallimages(props.route.params.item.images)
    }, [])


    const pickImageprofile = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [3, 3],
          quality: 1,
        });

    
        if (!result.cancelled) {
            setprofileimage(result.uri);
            uploadprofileimage(result.uri);
            

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
                    db.collection('partners').doc(userid).collection('workimages').doc(currentalbum.id).get().then(olddata => {
                        exisitngarray = olddata.data().images;
                        exisitngarray.push({imageurl : url,storagelocation : currentTimeInSeconds});
                        var ccc = allimages;
                        ccc.push({imageurl : url,storagelocation : currentTimeInSeconds});
                        setallimages(ccc);
                        
                        db.collection('partners').doc(userid).collection('workimages').doc(currentalbum.id).update({
                            images : exisitngarray
                            
                        }).then(dododod => {
                            setprofileimage(null);
                            setloadingscreen(false);
                            fetchallimages();
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


    const deleteimage= (item) => {
        Alert.alert(
            "Delete Image ?",
            "Are you sure you want to delete this image ",
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
                    var copy = [];
                    currentalbum.images.map(eachim => {
                        if(eachim !== item) {
                            copy.push(eachim);
                        }
                    })
                                        
                    db.collection('partners').doc(userid).collection('workimages').doc(currentalbum.id).update({
                        images: currentalbum.images.filter(im => im.imageurl !== item.imageurl)
                      }).then(ss => {
                        fetchallimages();
                        setloadingscreen(false);

                        // var desertRef = firebase.storage().child('partners/'+userid+'/workimages/');
                        // desertRef.delete().then(function() {
                        // }).catch(function(error) {
                        // // Uh-oh, an error occurred!
                        // });

                    }).catch(ee => {
                        setloadingscreen(false);
                    })
                }
              }
            ]
          );
    }

    const keyextract = (item) => {
        return item.storagelocation
      }
      const renderitem = ({item}) => { return <View style={{width : width/2.5 , height : width/2.2,margin : 10 , backgroundColor : LIGHTPINK , borderRadius : 5 , overflow : 'hidden'}}>
          <View style={{backgroundColor : 'white',display : 'flex',flexDirection : 'row',justifyContent : 'space-between',padding : 10,alignItems : 'center'}}>
            
            <TouchableOpacity onPress={() => deleteimage(item)}><AntDesign name="delete" size={24} color="black" /></TouchableOpacity> 
          </View>
         {<Image source={{uri : item.imageurl }} style={{resizeMode : "cover",width : '100%',height : '100%'}}/>}

      </View>
      }

    const fetchallimages = () => {
        const userid = props.route.params.partnerid;
        setloadingscreen(true);
        db.collection('partners').doc(props.route.params.partnerid).collection('workimages').doc(props.route.params.item.id).get().then(sd => {
            
            var ff = {id :sd.id, albumname : sd.data().albumname , images : sd.data().images}
            setcurrentalbum(ff);
            // var tmp = [];
            // sd.docs.map(each => {
            //     tmp.push();
            // })
            setallimages(sd.data().images);
            setrefresh(!refresh);
            setloadingscreen(false);
            
            
        }).catch(eee => {
            setloadingscreen(false);
        })
    }

    

    return (
        <View>
            {loadingscreen == true && <Loader visible={loadingscreen} uploading={true}/>} 

            <View style={{marginTop : topgapforheading  ,display : 'flex' , flexDirection : 'row',justifyContent : 'space-between' , padding  :10}}>
            <TouchableOpacity style={{ width : 60}} onPress={() =>  navigation.pop()}>
                    <Ionicons name="arrow-back-circle" size={36} color={DEEPPINK} />
                </TouchableOpacity>
            </View>
            <Customtext type='light' style={{ padding : 20 , fontWeight : '700' , fontSize : 24}}>{message == "" ? currentalbum.albumname : message } </Customtext>
            <TouchableOpacity onPress={pickImageprofile} style={{padding : 10, backgroundColor : DEEPPINK , width : 200,margin : 20,marginTop : 10,borderRadius : 5}}><Customtext type='light' style={{textAlign : 'center',color : 'white',fontWeight : '700'}}>Upload Image</Customtext></TouchableOpacity>

            <ScrollView showsVerticalScrollIndicator={false}>
             {
                    allimages.length == 0 ? <View style={{display : 'flex',justifyContent : 'center',alignItems : 'center'}}><Customtext type='light' style={{marginTop : 50 , fontWeight : '700',color : DEEPPINK, fontSize : 22}}>No Images Found</Customtext></View> : 
                
                <View style={{padding : 20}}>
                    
                    <FlatList 
                        extraData={refresh}
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
            }
            </ScrollView>

        </View>
    )
}

export default index
