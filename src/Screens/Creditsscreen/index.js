import React , {useEffect , useState} from 'react'
import { View, Text, SafeAreaView, Image, Dimensions, FlatList, TextInput, Alert } from 'react-native'
import { Entypo } from '@expo/vector-icons'; 
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { DEEPPINK, GREYISH, LIGHTPINK, topgapforheading } from '../../Constants/Colors';
import db from '../../config/firebase';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; 
import * as firebase from 'firebase';
import Loader from '../../components/Loader';
import { RECHARGESCREEN, VIEWBOOKING } from '../../Constants/routesName';
import Customtext from '../../components/Customtext';


const index = () => {
    const [loadingscreen, setloadingscreen] = useState(false);

    const {width,height} = Dimensions.get('screen');
        const [allimagesdata, setallimagesdata] = useState([]);
        const navigation = useNavigation(); 
        const [currentcredits, setcurrentcredits] = useState(0);
        const [currentuser, setcurrentuser] = useState(null);
        const [allcreditshistory, setallcreditshistory] = useState([]);
        const [debitcreditshistory, setdebitcreditshistory] = useState([]);
        const [creditscredithistory, setcreditscredithistory] = useState([]);
        const [penaltycreditshistory, setpenaltycreditshistory] = useState([]);
        const [fetchagain, setfetchagain] = useState(false);

        const [currenthead, setcurrenthead] = useState("All");
        

        const passit = (today) => {
            let date=today.getDate() + "-"+ parseInt(today.getMonth()+1) +"-"+today.getFullYear()+" "+today.getHours()+":"+today.getMinutes()+":"+today.getSeconds();
    
            return date;
        }

    useEffect(() => {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
              setcurrentuser(user);
              console.log(user.uid);
              db.collection('partners').doc(user.uid).get().then((df) => {
                  console.log(user.uid);
                setcurrentcredits(df.data().credits);
                db.collection('partners').doc(user.uid).collection('creditshistory').orderBy('receivedon','desc').get().then(crehist => {
                    var tmp = [];
                    var dd = [];
                    var cc =[];
                    var pp = [];
                    crehist.docs.map(eachcred => {
                        var x = {id : eachcred.id , data : eachcred.data()};
                        tmp.push(x);
                        if(eachcred.data().isdeducted == true) {
                            dd.push(x);
                        }
                        else {
                            cc.push(x);
                        }
                       

                    })
                    setdebitcreditshistory(dd);
                    setcreditscredithistory(cc);
                    setallcreditshistory(tmp);
               
                    db.collection('partners').doc(user.uid).collection('penalties').orderBy('receivedon','desc').get().then(crehist2 => {
         
                        crehist2.docs.map(eachcred2 => {
                            var x = {id : eachcred2.id , data : eachcred2.data()};
                            pp.push(x);
                        
                           
    
                        })
                        setpenaltycreditshistory(pp);
                    

                    }).catch(errcred => {
    
                    })
                }).catch(errcred => {

                })
              }).catch(err => {
                console.log(err);
              });
            }
            else {
                setcurrentuser(null);
                console.log('user not logged in')
            }

            
         });
    }, [fetchagain])


    const keyextract = (item) => {
        return item.id
    }

    const renderitem = ({item}) => {
        return <View style={{backgroundColor : LIGHTPINK,padding : 20,margin : 10,borderRadius : 5}}>
            <Customtext type='light' style={{fontWeight : '700',fontSize : 16,color : item.data.isdeducted ? 'red' : 'green'}}>{item.data.isdeducted ? 'Deducted' : 'Added'} {item.data.credits.toFixed(2)} Credits</Customtext>
            <Customtext type='light' style={{fontWeight : '600',fontSize : 14,color : 'black',marginTop : 10}}>{item.data.description}</Customtext>
            <Customtext type='light' style={{fontWeight : '600',fontSize : 14,color : 'black',marginTop : 10}}>{passit(new Date(Number(item.data.receivedon)*1000))}</Customtext>


        </View>
    }

    const allpressed = () => {
        setcurrenthead("All");
    }

    const debitpressed = () => {
        setcurrenthead("Debited");
    }
    const creditpressed = () => {
        setcurrenthead("Credited");
    }

    const penaltypressed = () => {
        setcurrenthead("Penalty");
    }

    return (
        <View>
            <View style={{marginTop : topgapforheading , position : 'relative',display : 'flex',flexDirection : 'row',alignItems : 'center'}}>
                <TouchableOpacity style={{ width : 60}} onPress={() =>  navigation.pop()}>
                        <View style={{borderRadius : 10 , padding : 10 , zIndex : 1035}}>
                        <Ionicons name="arrow-back-circle" size={36} color={DEEPPINK} style={{zIndex : 1035}} />
                        </View>
                    </TouchableOpacity>
            </View>
            <View style={{display : 'flex',flexDirection : 'row',justifyContent : 'space-between',paddingHorizontal : 10,alignItems : 'center'}}>
            <View>
                <Customtext type='light' style={{margin : 10,fontWeight : '700',marginLeft : 10,fontSize : 12}}>My Credits</Customtext>
                <Customtext type='light' style={{margin : 0,fontWeight : '800',marginLeft : 10,fontSize : 24,color : DEEPPINK}}>{Math.round(currentcredits * 100) / 100}</Customtext>
            </View>

            <TouchableOpacity onPress={() => {navigation.navigate(RECHARGESCREEN,{setfetchagain : setfetchagain,fetchagain : fetchagain})}} style={{padding : 10,backgroundColor : DEEPPINK,width : 100,borderRadius : 5}}><Customtext type='light' style={{textAlign : 'center',color : 'white',fontWeight : '700'}}>Recharge</Customtext></TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
            <Image source={require('../../assets/images/dollars.png')} style={{width : '100%',marginLeft: '0%' ,height : 300, resizeMode : 'contain'}} />
            <Customtext type='light' style={{margin : 10,fontWeight : '700',marginLeft : 20,fontSize : 12}}>Credits History</Customtext>

            <View style={{backgroundColor : LIGHTPINK,padding : 15,display : 'flex',flexDirection : 'row',justifyContent : 'space-between'}}>
                <TouchableOpacity onPress={allpressed}><Customtext type='light' style={{fontWeight : '700',color : currenthead == "All" ? DEEPPINK : 'black'}}>All</Customtext></TouchableOpacity>
                <TouchableOpacity onPress={debitpressed}><Customtext type='light' style={{fontWeight : '700',color : currenthead == "Debited" ? DEEPPINK : 'black'}}>Debited</Customtext></TouchableOpacity>
                <TouchableOpacity onPress={creditpressed}><Customtext  type='light' style={{fontWeight : '700',color : currenthead == "Credited" ? DEEPPINK : 'black'}}>Credited</Customtext></TouchableOpacity>
                <TouchableOpacity onPress={penaltypressed}><Customtext type='light' style={{fontWeight : '700',color : currenthead == "Penalty" ? DEEPPINK : 'black'}}>Penalty</Customtext></TouchableOpacity>

            </View>
            
            <FlatList
                            extraData={currenthead}
                            data = {currenthead == "All" ? allcreditshistory : currenthead == "Debited" ? debitcreditshistory : currenthead == "Credited" ? creditscredithistory : currenthead == "Penalty" ? penaltycreditshistory : allcreditshistory}
                            keyExtractor = {keyextract}
                            renderItem={renderitem}
                            horizontal={false}
                            scrollEnabled={true}
                            contentContainerStyle={{
                                flexGrow: 1,
                                }}
                            style={{marginBottom : 200}}
                        />

            </ScrollView>
            

        </View>
    )
}

export default index
