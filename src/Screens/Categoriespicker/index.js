import React , {useState , useEffect } from 'react'
import { View, Text, TouchableOpacity, Image, TextInput, FlatList, Dimensions ,Pressable } from 'react-native'
import { DEEPPINK, GREYISH, LIGHTPINK,topgapforheading } from '../../Constants/Colors'
import { Ionicons } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from './style.js';
import * as ImagePicker from 'expo-image-picker';
import * as firebase from 'firebase';
import Loader from '../../components/Loader';
import db from '../../config/firebase';
import { useNavigation } from '@react-navigation/native';
import { CITIESPICKER, REGISTER } from '../../Constants/routesName';
import Customtext from '../../components/Customtext';
import CachedImage from 'react-native-expo-cached-image';








const index = (props) => {

    const navigation = useNavigation(); 
    const {width,height} = Dimensions.get('screen');
    const [partnerauthid, setpartnerauthid] = useState("xyz123");

    const [loadingscreen, setloadingscreen] = useState(false);

    const [anythingchanged, setanythingchanged] = useState(false);
    const [alreadyexistingdata, setalreadyexistingdata] = useState({});

    const [message, setmessage] = useState("");

    const [allavailablecategories, setallavailablecategories] = useState([]);
    const [selectedcategories, setselectedcategories] = useState([]);
    const [refreshdata, setrefreshdata] = useState(false);



    const cattapped = (item) => {
        setanythingchanged(true);
         var fm = selectedcategories.filter(ef => ef.id == item.id);
         var copy = selectedcategories;
         if(fm.length == 0) {
            copy.push(item);
            setselectedcategories(copy);
            setrefreshdata(!refreshdata);
         }
         else {
            var dmcp = [];
            selectedcategories.map(efju => {
                if(efju.id != item.id) {
                    dmcp.push(efju);
                }
            })
            setselectedcategories(dmcp);
            setrefreshdata(!refreshdata);
         }

    }

    const keyextractservice2 = (item) => {
        return item.id
      }

      const renderitemservice2 = ({item}) => { return <View style={{width : '50%',minWidth : width * 0.4}}><Pressable onPress={() => cattapped(item)} style={{backgroundColor : selectedcategories.filter(ef => ef.id == item.id).length == 0 ? LIGHTPINK : DEEPPINK ,padding : 5 , marginHorizontal : 5 ,marginVertical : 5, borderRadius : 4 }}><View style={{display : 'flex' , alignItems : 'center'  }}><CachedImage source={{uri : item.iconurl}} style={{width : 80 , height : 80 , borderRadius : 5,marginRight : 2,marginBottom : 10}} /><View>
      <Customtext type='light' style={{fontSize : 16 , fontWeight : '700'}}>{item.categoryname}</Customtext><View style={{display : 'flex',flexDirection : 'row',alignItems : 'center'}}></View></View></View></Pressable></View>
  }

    useEffect(() => {
        setpartnerauthid(props.route.params.partnerid);
        const userid = props.route.params.partnerid;
        setloadingscreen(true);
        db.collection('partners').doc(userid).get().then(info => {
            if(info.exists) {
            setalreadyexistingdata(info.data());
            if(info.data().selectedcategories !== undefined) {
                // setselectedcategories(info.data().selectedcategories);
              }
            }
            
            db.collection('categories').get().then(allcat => {
                var alltemps = [];
                allcat.docs.map(eachindi => {
                    if(eachindi.data().categorystate == "active") {
                    var x = { id : eachindi.id , ... eachindi.data()};
                    alltemps.push(x);
                    }
                    
                })
                var copyindetails = [];
                if(info.exists) {
                if(info.data().selectedcategories !== undefined) {
                info.data().selectedcategories.map(sct => {
                    var gbn = alltemps.filter(kjjj => kjjj.id == sct);
                    if(gbn.length > 0) {
                        copyindetails.push(gbn[0]);
                    }
                })
                }
                }
                setselectedcategories(copyindetails);
                setallavailablecategories(alltemps);
                setloadingscreen(false);
                
            }).catch(err => {
                setloadingscreen(false);
            });
            
        }).catch(e => {
            setloadingscreen(false);
        })
    }, [])

    const attempuploads = () => {
        const userid = partnerauthid;
        if(anythingchanged == false) {
            navigation.navigate(REGISTER , {partnerid : partnerauthid,userid : props.route.params.userid , number : props.route.params.number});
        }
       else if(selectedcategories.length > 3) {
           setmessage("You can not pick more than 3 Categories");
       }
       else if(selectedcategories.length == 0) {
        setmessage("You need to pick atleast 1 Category");
    }
       else {
            setloadingscreen(true);
            var tk = [];
            selectedcategories.map(edc => {
                tk.push(edc.id);
            })
            db.collection('partners').doc(userid).get().then(docSnapshot => {
                if (docSnapshot.exists) {
                    db.collection('partners').doc(userid).update({
                        selectedcategories : tk
                    }).then(ed => {
                     setmessage("Details Uploaded");
                     setloadingscreen(false);
                     navigation.navigate(REGISTER , {partnerid : partnerauthid,userid : props.route.params.userid , number : props.route.params.number});
         
                    }).catch(jh => {
                     setloadingscreen(false);
                    })
                }
                else {
                    db.collection('partners').doc(userid).set({
                        selectedcategories : tk,
                        createdon : Math.round((new Date()).getTime() / 1000)
                    }).then(ed => {
                     setmessage("Details Uploaded");
                     setloadingscreen(false);
                     navigation.navigate(REGISTER , {partnerid : partnerauthid,userid : props.route.params.userid , number : props.route.params.number});
         
                    }).catch(jh => {
                     setloadingscreen(false);
                    })
                }
            });

       }
        
    }


 

    return (
        <View>
             {loadingscreen == true && <Loader visible={loadingscreen}/>} 

            <View style={{marginTop : topgapforheading ,display : 'flex' , flexDirection : 'row',justifyContent : 'space-between' , padding  :10}}>
                <TouchableOpacity style={{ width : 60}} onPress={() =>  navigation.pop()}>
                        
                        
                        <Ionicons name="arrow-back-circle" size={36} color={DEEPPINK} />
                        
                        
                </TouchableOpacity>
                <Customtext type='light' style={{padding : 20 , color : DEEPPINK , fontWeight : '700'}}>Step 1 of 8</Customtext>
            </View>
            
            <Customtext type='light' style={{ padding : 10 , fontWeight : '700' , fontSize : 17}}>{message == "" ? "Join Uzify by selecting Categories, you will get leads from only selected categories (Max 3)" : message } </Customtext>

            <Customtext type='light' style={{ padding : 20 , fontWeight : '700' , fontSize : 19}}>{selectedcategories.length} Selected </Customtext>

            <View style={{padding : 10}}>
                                        <FlatList 
                                        extraData={refreshdata}
                                            data = {allavailablecategories}
                                            keyExtractor = {keyextractservice2}
                                            renderItem={renderitemservice2}
                                            horizontal={false}
                                            numColumns = {2}
                                            scrollEnabled={true}
                                            contentContainerStyle={{
                                                flexGrow: 1,
                                                }}
                                        />
                                    </View>
            <TouchableOpacity onPress={attempuploads}  style = {{padding : 12 , backgroundColor : DEEPPINK , borderRadius : 5 ,marginLeft : '5%', marginTop : 60,marginBottom : 300 , width : '90%'}}><Customtext type='light' style={{fontWeight : '800',color : 'white',textAlign : 'center',fontSize : 18}}>Next</Customtext></TouchableOpacity>



        </View>
    )
}

export default index
