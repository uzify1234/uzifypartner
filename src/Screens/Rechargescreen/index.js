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
import { VIEWBOOKING } from '../../Constants/routesName';
import Customtext from '../../components/Customtext';
import Paymentcomponent from '../../components/Paymentcomponent';
// import PayuMoney from 'react-native-payumoney';

const index = (props) => {
    const [loadingscreen, setloadingscreen] = useState(false);

    const [PayUModalVisibility, setPayUModalVisibility] = useState(false);
    const [billingdata, setbillingdata] = useState([]);

    const {width,height} = Dimensions.get('screen');
        const [allimagesdata, setallimagesdata] = useState([]);
        const navigation = useNavigation(); 
        const [currentcredits, setcurrentcredits] = useState(0);
        const [currentuser, setcurrentuser] = useState(null);
        const [allcreditshistory, setallcreditshistory] = useState([]);
        const [wholeandsolepartnerdata, setwholeandsolepartnerdata] = useState({});

        const [amount, onChangeAmount] = React.useState(0);
    const [moneyrequired, setmoneyrequired] = useState(0);
    const [currentconversion, setcurrentconversion] = useState(0);
    const [onlinobject, setonlinobject] = useState({});


    useEffect(() => {
        
        setloadingscreen(true);
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
              setcurrentuser(user);
            }
        });
        db.collection('constants').doc('creditconversion').get().then(cc => {
            setloadingscreen(false);
            setcurrentconversion(cc.data().amount);
        }).catch(err => {
            setloadingscreen(false);
        })
    }, [])


    const getMagicResponse = (resp) => {
var obj = {};
var newres = resp.slice(0, -2); 
var newres2 = newres.substring(2);
var part1 = newres2.split(",");
part1.map((each => {
    var part2 = each.split(":");
    obj[part2[0].trim()] = part2[1].trim();
}))
   
obj['userid'] = currentuser.uid;
obj['transactiondone'] = Math.round((new Date()).getTime() / 1000);

            if(obj.status == "success") {
                var newobj = {data : obj,paymenttype : 'partnercreditrecharge'};

                db.collection('partners').doc(currentuser.uid).update({
                        credits : (currentcredits + Number(amount))
                    }).then(ddcred => {
                        var randomorderid = obj.txnid;
                        db.collection('partners').doc(currentuser.uid).collection('creditshistory').doc(randomorderid).set({
                            credits : Number(amount),
                            description : 'Recharge done by you',
                            receivedon : Math.round((new Date()).getTime() / 1000),
                            orderid : '',
                            isdeducted : false,
                            transactionid : obj.txnid
                        }).then(histdone => {
                            setloadingscreen(false);
                            props.route.params.setfetchagain(!props.route.params.fetchagain);
                            db.collection('partnerrechargetransactions').doc(randomorderid).set(obj).then(dataset => {
                                Alert.alert(
                                    "Recharge Done",
                                    "",
                                    [
                                      {
                                        text: "Ok",
                                        onPress: () => console.log("Cancel Pressed"),
                                        style: "cancel"
                                      }
                                     
                                    ]
                                  );
                            }).catch(egg => {
                            })

                        }).catch(histerr => {
                            setloadingscreen(false);
                        })


                    }).catch(ecred => {
                        setloadingscreen(false);
                    })
            }
            else {

                alert("Transaction could not be completed");
            }
         
          }


    const testpayment = () => {


        var realname = wholeandsolepartnerdata.mobilenumber.split(" ");

        var realmob = wholeandsolepartnerdata.mobilenumber.split("+91");
        setonlinobject({
            amount : parseFloat(parseFloat(amount) * currentconversion),
            productinfo : 'Partner Credits Recharge',
            firstname : wholeandsolepartnerdata.name,
            lastname : '',
            email : wholeandsolepartnerdata.email,
            phone : wholeandsolepartnerdata.mobile,
            txnid :'ab6kklklakkl7sjkhplsjhk5slff',
            key : 'eXzZaR',
            surl : 'http://schizoid.co.in/payment/my_success.php',
            furl : 'http://schizoid.co.in/payment/my_failure.php',
            service_provider : 'payu_paisa'
        })
        // setPayUModalVisibility(true);
       
          
    }


    const rechargetapped = () => {
        if(amount == "" || amount == " " || amount == 0) {
            alert("Enter Valid No of Credits you are willing to purchase");
        }
        else {
            
            firebase.auth().onAuthStateChanged((user) => {
                if (user) {
                  setcurrentuser(user);
                  setloadingscreen(true);
                  db.collection('partners').doc(user.uid).get().then((df) => {
                    setcurrentcredits(df.data().credits);
                    setwholeandsolepartnerdata(df.data());
                    var ncred = Number(df.data().credits);



                    var realname = df.data().name.split(" ");
            
                    var realmob = df.data().mobilenumber.split("+91");
                    var randtxnid = db.collection('partnerrechargetransactions').doc().id;
                    setonlinobject({
                        amount : parseFloat(parseFloat(amount) * currentconversion),
                        productinfo : 'Partner Credits Recharge',
                        firstname : realname[0],
                        lastname : realname.length > 1 ? realname[1] : '',
                        email : wholeandsolepartnerdata.email,
                        phone : realmob[1],
                        txnid :randtxnid,
                        key : 'eXzZaR',
                        surl : 'http://schizoid.co.in/payment/my_success.php',
                        furl : 'http://schizoid.co.in/payment/my_failure.php',
                        service_provider : 'payu_paisa'
                    })
                     setPayUModalVisibility(true);


                  }).catch(err => {
                  });
                }
                else {
                    setcurrentuser(null);
                }
    
                
             });
        }
    }

    const keyextract = (item) => {
        return item.id
    }



    const renderitem = ({item}) => {
        return <View style={{backgroundColor : LIGHTPINK,padding : 20,margin : 10,borderRadius : 5}}>
            <Customtext type='light' style={{fontWeight : '700',fontSize : 16,color : DEEPPINK}}>{item.data.credits} Credits</Customtext>
            <Customtext type='light' style={{fontWeight : '600',fontSize : 14,color : 'black',marginTop : 10}}>{item.data.description}</Customtext>
            <Customtext type='light' style={{fontWeight : '600',fontSize : 14,color : 'black',marginTop : 10}}>{new Date(Number(item.data.receivedon)*1000).toLocaleString("en-US")}</Customtext>


        </View>
    }

    return (
        <View>
                        {loadingscreen == true && <Loader visible={loadingscreen}/>} 

                        {PayUModalVisibility && (
            <Paymentcomponent
              visible={PayUModalVisibility}
              setvisible={setPayUModalVisibility}
              onCloseModal={() => {
                    setPayUModalVisibility(false);
                    setbillingdata([]);
              }
              }
              getMagicResponse={magicResponse =>
                getMagicResponse(magicResponse)
              }
              paymenttype="partnercreditrecharge"
              paymentOptions={onlinobject}
            />
          )}

            <View style={{marginTop : topgapforheading + 20 , position : 'relative',display : 'flex',flexDirection : 'row',alignItems : 'center',justifyContent : 'space-between',paddingHorizontal : 20}}>
                <TouchableOpacity style={{ width : 60}} onPress={() =>  navigation.pop()}>
                        <View style={{borderRadius : 10 , padding : 0 , zIndex : 1035}}>
                        <Ionicons name="arrow-back-circle" size={36} color={DEEPPINK} style={{zIndex : 1035}} />
                        </View>
                    </TouchableOpacity>
                <Customtext type='light' style={{fontSize : 18,fontWeight : '700',color : DEEPPINK}}>Recharge your wallet</Customtext>
            </View>
            <Image source={require('../../assets/images/umbrella.png')} style={{width : '100%',marginLeft: '0%' ,height : 150, resizeMode : 'contain'}} />

            <TextInput
                                style={{borderWidth : 1,padding : 20,margin : 20,fontSize : 18,borderRadius : 30}}
                                onChangeText={(text) => {
                                    setmoneyrequired((Number(text) * currentconversion))
                                    onChangeAmount(text)}}
                                value={amount}
                                placeholder="Enter No. of Credits to be purchased"
                                placeholderTextColor={GREYISH}
                                keyboardType='numeric'
                                
                        />
            <Customtext type='light' style={{paddingLeft : 30,fontWeight : '700',marginBottom : 10}}>1 Credit = {currentconversion} Rs</Customtext>
            <Customtext type='light' style={{paddingLeft : 30,fontWeight : '700',marginBottom : 20,color : DEEPPINK}}>Amount to be paid Rs {moneyrequired}</Customtext>


            <TouchableOpacity onPress={rechargetapped} style={{padding : 20,backgroundColor : DEEPPINK,width : '50%',marginLeft : '25%',borderRadius : 10,marginTop : 20}}><Customtext type='light' style={{fontWeight : '700',color : 'white',fontSize : 18,letterSpacing : 1,textAlign : 'center'}}>Recharge</Customtext></TouchableOpacity>

            <Image source={require('../../assets/images/dollars.png')} style={{width : '100%',marginLeft: '0%' ,height : 300, resizeMode : 'contain'}} />
            
   
            

        </View>
    )
}

export default index
