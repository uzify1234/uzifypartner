import React , {useEffect , useState} from 'react'
import { View, Text, SafeAreaView, Image, Dimensions, FlatList, TextInput, Alert,StyleSheet ,Pressable} from 'react-native'
import { Entypo } from '@expo/vector-icons'; 
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { DEEPPINK, GREYISH, LIGHTPINK, topgapforheading } from '../../Constants/Colors';
import db from '../../config/firebase';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; 
import * as firebase from 'firebase';
import Loader from '../../components/Loader';
import Customtext from '../../components/Customtext';
import AlertInput from 'react-native-alert-input';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Modal } from 'react-native';
import CachedImage from 'react-native-expo-cached-image';
import { Feather } from '@expo/vector-icons'; 

import {Linking} from 'react-native'



const index = (props) => {
    const [bookingid, setbookingid] = useState("5WUQhJPDnISNtP1QT4TY");
    const [wholebooking, setwholebooking] = useState({});
    const [loadingscreen, setloadingscreen] = useState(false);
    const [datafetched, setdatafetched] = useState(false);
    const [currentstatus, setcurrentstatus] = useState("");
    const [currentuser, setcurrentuser] = useState(null);

    const [verificationdialogvisible, setverificationdialogvisible] = useState(false);
    const [verificationtextentered, setverificationtextentered] = useState("");
    const [cancelmodalshow, setcancelmodalshow] = useState(false);
    const [cancelreason, setcancelreason] = useState("");

    const [haveialreadysubmittedforcancellation, sethaveialreadysubmittedforcancellation] = useState(false);

    const {width,height} = Dimensions.get('screen');
        const navigation = useNavigation(); 

        const keyextractminor = (item) => {
            return item.id
          }
          const renderitemminor = ({item}) => { return <View style={{width : 180 ,backgroundColor : LIGHTPINK , borderRadius : 10, display : 'flex',justifyContent : 'center',alignItems : 'center' , padding : 10 , margin : 5}}><View style={{display : 'flex',justifyContent : 'center',alignItems : 'center'}}><CachedImage source={{ uri:item.iconurl}} style={{width : 60 , height : 60 , borderRadius : 5}}/><Customtext type='light' style={{color : DEEPPINK , fontWeight : '700' , fontSize : 14,paddingTop : 5 , textAlign : 'center'}}>{item.servicename}</Customtext><Customtext type='light' style={{color : DEEPPINK , fontWeight : '700' , fontSize : 12,paddingTop : 10 , textAlign : 'center'}}>Quantity {item.displaycount}</Customtext><Customtext type='light' style={{fontSize : 14 , fontWeight : '600'}}>Rs {item.freeitem != null && item.freeitem.id == item.id ? (item.displaycount - 1) * (item.isaaddonservice == true || item.isaaddonservice == "true" ? item.addonprice : item.serviceprice) : (item.displaycount * (item.isaaddonservice == true || item.isaaddonservice == "true" ? item.addonprice : item.serviceprice))}</Customtext></View></View>
          }

    useEffect(() => {
        setbookingid(props.route.params.bookingid);
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
             setcurrentuser(user);
             db.collection('orders').doc(props.route.params.bookingid).get().then(wholebook => {
                var x = {id : wholebook.id,data : wholebook.data()};
                console.log(x);
                setwholebooking(x);
                setcurrentstatus(x.data.status);
                setdatafetched(true);
                db.collection('cancellationbypartners').doc(wholebook.id).get().then(chk => {
                    if(chk.data().submittedby == user.uid) {
                        sethaveialreadysubmittedforcancellation(true);
                    }
                }).catch(eklo => {

                })
            }).catch(err => {
    
            })
            }

            
         });

    }, [])

    const handlecancelreason = (e) => {
        setcancelreason(e.target.value);
        console.log(e.target.value);
    }


    const verificationenteredtapped = (vt) => {



        const code = wholebooking.data.startcode;
        if(code == vt) {
            console.log("Both matches "+code);
                  var today = Math.round((new Date()).getTime() / 1000);
        db.collection('orders').doc(bookingid).update({
            servicestarted : today,
            status : 'running'
        }).then(dc => {
            setcurrentstatus('running');
            Alert.alert(
                "Service Started",
                "",
                [
                  {
                    text: "Ok",
                    onPress: () => {},
                    style: "cancel"
                  }
                  
                ]
              );
        }).catch(ee => {

        })
        }
        else {
            console.log("Both does not matches "+code);
            Alert.alert(
                "Invalid Start Code",
                "",
                [
                  {
                    text: "Ok",
                    onPress: () => {},
                    style: "cancel"
                  }
                  
                ]
              );
        }
  
    }

    const startservicetapped = () => {
        if(currentstatus == 'pending') {
            setverificationdialogvisible(true);
            
        }
        else if(currentstatus == 'running') {
            var today = Math.round((new Date()).getTime() / 1000);
            db.collection('orders').doc(bookingid).update({
                serviceended : today,
                status : 'completed'
            }).then(dc => {
                setcurrentstatus('completed');
                console.log("Hey");
                db.collection('partners').doc(currentuser.uid).collection('pastbookings').doc(bookingid).set({
                    completed : true
                }).then(dddone => {
                    console.log("Hello");
                    db.collection('partners').doc(currentuser.uid).collection('upcomingbookings').doc(bookingid).delete().then(deldone => {
                        console.log("Whats up ?");



                        var bookinguser = wholebooking.data.userid;
                        db.collection('users').doc(bookinguser).get().then(budata => {
                            var refcode = budata.data().referalcodeapplied;
                            var successfullycompletedbookings = budata.data().successfullycompletedbookings || 0;
                            console.log("Ref code is "+refcode+" successfullycompltedbooking "+successfullycompletedbookings);
                            if((successfullycompletedbookings == 0  || successfullycompletedbookings == '0' ) && refcode != "") {
                              db.collection('referalcodes').doc(refcode).get().then(refdata => {
                                var uuid = refdata.data().userid;
                                console.log("Check B "+uuid);
                                db.collection('users').doc(uuid).get().then(ruuser => {
                                  db.collection('users').doc(uuid).update({
                                    freeservicesavailable : Number(ruuser.data().freeservicesavailable || 0) + 1,
                                    totalfreeservicesearned : Number(ruuser.data().totalfreeservicesearned || 0) + 1
                  
                                }).then(upuser => {
                                  
                                    var fullname = budata.data().firstname + ' ' + budata.data().lastname;
                                    db.collection('users').doc(uuid).collection('referalshistory').doc(bookinguser).set({
                                        imageurl : null,
                                        name : fullname,
                                        servicetaken : true,
                                        signedup  :true
                                        
                                    })
                                    .then(finaldone => {
                                      db.collection('users').doc(bookinguser).update({
                                        successfullycompletedbookings : Number(budata.data().successfullycompletedbookings || 0) + 1
                  
                                      }).then(upidone => {
                                        setloadingscreen(false);
                                        alert("Service Completed");
                                      }).catch(eridone => {
                                        console.log(eridone);
                                      })
                  
                                    }).catch(finalerr => {
                                        setloadingscreen(false);
                                        console.log(finalerr);
                                    })
                  
                                
                                }).catch(catuser => {
                                    setloadingscreen(false);
                                    console.log(catuser);
                                })
                                }).catch(ruerr => {
                                  console.log(ruerr);
                                })
                            }).catch(eeee => {
                                setloadingscreen(false);
                                console.log(eeee);
                            })
                            }
                        }).catch(errbudat => {
                          console.log(errbudat);
                        })



                    }).catch(eddf => {
                        console.log(eddf);
                    })
                }).catch(eedone => {
                    console.log(eedone);
                })
            }).catch(ee => {

            })
        }
    }

    const cancelbooking = () => {
        setcancelmodalshow(true);
    }

    const finaltappedforcancellation = () => {
        Alert.alert(
            "Are you sure you want to cancel this Booking ?",
            "",
            [
              {
                text: "Yes Cancel Booking",
                onPress: () => {
                    console.log(wholebooking.id);
                    console.log(currentuser.uid);
                    console.log(cancelreason);
                    db.collection('cancellationbypartners').doc(wholebooking.id).set({
                        submittedby : currentuser.uid,
                        reason : cancelreason,
                        submittedon : Math.round((new Date()).getTime() / 1000)
                    })
                    .then(updone => {
                        setcancelreason('');
                        
                        Alert.alert(
                            "Booking Cancelletion request submitted to Admin",
                            "",
                            [
                              {
                                text: "Ok",
                                onPress: () => {setcancelmodalshow(false)},
                                style: "cancel"
                              }
                              
                            ]
                          );
                    }).catch(err => {
            
                    })

                },
                style: "cancel"
              },
              {
                text: "No I changed my mind",
                onPress: () => {},
                style: "cancel"
              }
              
            ]
          );

    }

    const callcustomer = () => {
      Linking.openURL('tel:'+wholebooking.data.personmobile);
    }

    return (
        <SafeAreaView>
            {loadingscreen == true && <Loader visible={loadingscreen}/>} 
            <ScrollView showsVerticalScrollIndicator={false}>
                <AlertInput show={verificationdialogvisible}
                title={"Enter Service Start Code"}
                style={{backgroundColor : 'white',padding : 10}}
                onSubmit={ (inputText) => {setverificationtextentered(inputText);verificationenteredtapped(inputText); setverificationdialogvisible(false)} }
                onCancel={ () => {setverificationdialogvisible(false)}}>
                </AlertInput>

            {cancelmodalshow && <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={cancelmodalshow}
        onRequestClose={() => {
          setcancelmodalshow(!cancelmodalshow);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
          <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setcancelmodalshow(!cancelmodalshow)}
            >
              <Text style={styles.textStyle}>Close</Text>
            </Pressable>
            <Text style={[styles.modalText],{fontWeight : '600',textAlign : 'center',marginBottom : 30,marginTop : 30}}>Please give us reason for cancellation. Once you submit the reason, Admin will approve the cancellation or transfer booking to other partner.You might be penalise for this cancellation</Text>
            <TextInput type='text' multiline={true} placeholder='State your reason here'                            onChangeText={(text) => setcancelreason(text)}
 style={{width : width/1.3,marginBottom : 30,fontSize : 16,fontWeight : '700',borderColor : DEEPPINK , borderWidth : 2,borderRadius : 5,padding : 10,height : 100}}/>

            <TouchableOpacity onPress={finaltappedforcancellation} style={{width : 300,backgroundColor : DEEPPINK,padding : 12,borderRadius : 5,marginBottom : 20}}><Text style={{textAlign : 'center',color : 'white',fontWeight : '700',fontSize : 16}}>Submit</Text></TouchableOpacity>
   
          </View>
        </View>
      </Modal>

    </View>
}



            <View style={{display : 'flex',flexDirection : 'row',justifyContent : 'space-between',alignItems : 'center',padding : 10}}>
                    <TouchableOpacity style={{ width : 60,marginTop : topgapforheading}} onPress={() =>  navigation.pop()}>
                        <Ionicons name="arrow-back-circle" size={36} color={DEEPPINK} />
                    </TouchableOpacity>
                    <Customtext type='light' style={{fontWeight : '800',color : DEEPPINK,fontSize : 18,letterSpacing : 0.8 }}>{wholebooking != null && wholebooking.data != undefined && wholebooking.data.categoryname != undefined ? wholebooking.data.categoryname : ""}</Customtext>
                </View>
                {datafetched && wholebooking != null && wholebooking.data != undefined && wholebooking.data.assignedpartner == currentuser.uid && <TouchableOpacity onPress={() => startservicetapped()} style={{padding : 15 , margin : 10, backgroundColor : DEEPPINK,borderRadius : 5}}><Customtext type='light' style={{color : 'white',fontWeight : '800',textAlign : 'center',fontSize : 20}}>{currentstatus == 'pending' ? 'Start Service' : currentstatus == 'running' ? 'Stop Service' : currentstatus == 'cancelledbyuser' ? 'Cancelled By Customer' : currentstatus == 'cancelledbypartner' ? 'Cancelled': currentstatus == 'cancelledbyadmin' ? 'Cancelled' : 'Completed'}</Customtext></TouchableOpacity>}
                {datafetched && wholebooking != null && wholebooking.data != undefined ? <View style={{padding : 20,backgroundColor : LIGHTPINK , borderRadius : 10,margin : 10}}>
                {datafetched && wholebooking != null && wholebooking.data != undefined && wholebooking.data.assignedpartner == currentuser.uid &&  <Customtext type='light' style={{fontWeight : '700',marginBottom : 7}}>Booking Made by { wholebooking.data.personname}</Customtext> }
                {currentstatus == 'cancelledbyuser' || currentstatus == 'cancelledbyadmin' || currentstatus == 'cancelledbypartner' ? <View></View> : <View style={{display : 'flex',flexDirection : 'row',justifyContent : 'space-between'}}>
                {datafetched && wholebooking != null && wholebooking.data != undefined && wholebooking.data.assignedpartner == currentuser.uid &&   <Customtext type='light' style={{fontWeight : '600',marginBottom : 7}}>Contact  {wholebooking.data.personmobile}</Customtext> }
                {datafetched && wholebooking != null && wholebooking.data != undefined && wholebooking.data.assignedpartner == currentuser.uid &&   <TouchableOpacity onPress={callcustomer}><Feather name="phone-call" size={24} color={DEEPPINK} /></TouchableOpacity> }
                </View> }
                    <Customtext type='light' style={{fontWeight : '600',marginBottom : 7}}>Address  {wholebooking.data.personaddress}</Customtext>
                    <Customtext type='light' style={{fontWeight : '600',marginBottom : 7}}>Landmark  {wholebooking.data.personlandmark}</Customtext>
                    <Customtext type='light' style={{fontWeight : '600',marginBottom : 7}}>Pincode  {wholebooking.data.personpincode}</Customtext>
                </View> : <View></View>}

                {datafetched && wholebooking != null && wholebooking.data != undefined ? <View style={{padding : 20,paddingHorizontal : 10,backgroundColor : LIGHTPINK , borderRadius : 10,margin : 10}}>
                    <Customtext type='light' style={{fontWeight : '700',marginBottom : 7}}>Date : { wholebooking.data.selecteddate}</Customtext>
                    <Customtext type='light' style={{fontWeight : '600',marginBottom : 7}}>Timeslot : {wholebooking.data.selectedtimeslot}</Customtext>
                    <Customtext type='light' style={{fontWeight : '600',marginBottom : 7}}>Payment Mode :  {wholebooking.data.selectedpaymentmode}</Customtext>
                    <Customtext type='light' style={{fontWeight : '600',marginBottom : 7,fontSize : 14}}>Grossamount Rs {wholebooking.data.grossamount}</Customtext>
                    <Customtext type='light' style={{fontWeight : '600',marginBottom : 7,fontSize : 14}}>Taxes Rs {wholebooking.data.taxestobepaid}</Customtext>
                    <View style={{backgroundColor : 'white',padding : 5,paddingVertical : 10,borderRadius : 10,borderLeftWidth : 4, borderLeftColor : DEEPPINK}}>
                    <Customtext type='light' style={{fontWeight : '800',marginBottom : 7,fontSize : 16}}>Netamount Rs {wholebooking.data.netamount}</Customtext>
                    </View>
                </View> : <View></View>}



                {datafetched && wholebooking != null && wholebooking.data != undefined ? <View style={{padding : 20,margin : 0}}>
                    <Customtext type='light' style={{fontWeight : '800',marginBottom : 7}}>Services Booked</Customtext>
                    <FlatList 
                        data = {wholebooking.data.cart}
                        keyExtractor = {keyextractminor}
                        renderItem={renderitemminor}
                        horizontal={true}
                        scrollEnabled={true}
                        contentContainerStyle={{
                            flexGrow: 1,
                            }}
                    />
                    {wholebooking.data.freeitem != null ?
                    <View> 
                    <Customtext type='light' style={{fontWeight : '800',marginTop : 10}}>Free Service</Customtext>
                    <View style={{width : 180 ,backgroundColor : LIGHTPINK , borderRadius : 10, display : 'flex',justifyContent : 'center',alignItems : 'center' , padding : 10 , margin : 5}}><View style={{display : 'flex',justifyContent : 'center',alignItems : 'center'}}><CachedImage source={{ uri:wholebooking.data.freeitem.iconurl}} style={{width : 60 , height : 60 , borderRadius : 5}}/><Customtext type='light' style={{color : DEEPPINK , fontWeight : '700' , fontSize : 14,paddingTop : 5 , textAlign : 'center'}}>{wholebooking.data.freeitem.servicename}</Customtext><Customtext type='light' style={{color : DEEPPINK , fontWeight : '700' , fontSize : 12,paddingTop : 10 , textAlign : 'center'}}>Quantity {wholebooking.data.freeitem.displaycount}</Customtext></View></View>
                    </View> : <View></View>}

                    {
                        haveialreadysubmittedforcancellation && <Customtext type='light' style={{fontWeight :'700', color : DEEPPINK,marginLeft : 10,marginTop : 10}}>You have already requested for cancellation of this booking. Kindly wait till admin approve cancellation or transfer booking to other partner</Customtext>
                    }

                   {wholebooking.data.status == 'pending' && haveialreadysubmittedforcancellation == false && wholebooking.data.assignedpartner == currentuser.uid &&<TouchableOpacity onPress={() => cancelbooking()} style={{display : 'flex' , flexDirection : 'row',alignItems : 'center',padding : 20,paddingLeft : 5}}>
                <MaterialCommunityIcons name="cancel" size={24} color={DEEPPINK} /> 
                <Customtext type='light' style={{fontWeight :'700', color : DEEPPINK,marginLeft : 10}}>Cancel Booking</Customtext>  
            </TouchableOpacity>  } 

                </View> : <View></View>
                }


            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 22
    },
    modalView: {
      margin: 20,
      backgroundColor: "white",
      borderRadius: 20,
      padding: 35,
      paddingHorizontal : 15,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5
    },
    button: {
      borderRadius: 20,
      padding: 10,
      elevation: 2
    },
    buttonOpen: {
      backgroundColor: "#F194FF",
    },
    buttonClose: {
      backgroundColor: "#E61C52",
    },
    textStyle: {
      color: "white",
      fontWeight: "bold",
      textAlign: "center"
    },
    modalText: {
      marginBottom: 15,
      textAlign: "center"
    }
  });

export default index
