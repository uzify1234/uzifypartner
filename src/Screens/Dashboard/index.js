import React , {useEffect , useState} from 'react'
import { View, Text, SafeAreaView, Image, Dimensions, FlatList, TextInput, Alert, BackHandler } from 'react-native'
import { Entypo } from '@expo/vector-icons'; 
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { DEEPPINK, GREYISH, LIGHTPINK } from '../../Constants/Colors';
import db from '../../config/firebase';
import { AntDesign } from '@expo/vector-icons';
import styles from './style.js';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; 
import * as firebase from 'firebase';
import Loader from '../../components/Loader';
import { LOGIN, PROFILE, RECHARGESCREEN, VIEWBOOKING } from '../../Constants/routesName';
import Customtext from '../../components/Customtext';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import CachedImage from 'react-native-expo-cached-image';


const index = () => {
    const [loadingscreen, setloadingscreen] = useState(false);

    const {width,height} = Dimensions.get('screen');
        const [allimagesdata, setallimagesdata] = useState([]);
        const navigation = useNavigation(); 
        const [currentuser, setcurrentuser] = useState(null);
        const [currentusername, setcurrentusername] = useState("");
        const [currentuserimage, setcurrentuserimage] = useState(null);
        const [currentusercredits, setcurrentusercredits] = useState(0);



        const [allqueueorders, setallqueueorders] = useState([]);
        const [allupcmings, setallupcmings] = useState([]);
        const [allpast, setallpast] = useState([]);
        const [allmissed, setallmissed] = useState([]);
        const [currenthead, setcurrenthead] = useState("Queued");

        const [finalstatusnotif, setfinalstatusnotif] = useState(null);
        const [ExpoPushToken, setExpoPushToken] = useState(null);

        useEffect(() => {
          if(currentuser) {
   
          }
        },[currentuser]);


        async function registerForPushNotificationsAsync() {
            let token;
            if (Constants.isDevice) {
              const { status: existingStatus } = await Notifications.getPermissionsAsync();
              let finalStatus = existingStatus;
              setfinalstatusnotif(existingStatus);
              if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
              }
              if (finalStatus !== 'granted') {
                alert('Failed to get push token for push notification!');
                return;
              }
              token = (await Notifications.getExpoPushTokenAsync()).data;
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

 

      const keyextract = (item) => {
        return item.id
      }
      const renderitem = ({item}) => { return <View style={{display : 'flex',justifyContent : 'center',alignItems : 'center' , padding : 3 , backgroundColor : 'white'}}><CachedImage source={{ uri:item.imageurl}} style={{width : width - 20 , height : '100%' , borderRadius : 5 , resizeMode : 'cover'}}/></View>
      }


      const keyextractqueue = (item) => {
          return item.id
      }
      const secondsToHms = (d,e) => {
        d = Number(d) - Number(e);
        var h = Math.floor(d / 3600);
        var m = Math.floor(d % 3600 / 60);
        var s = Math.floor(d % 3600 % 60);
    
        var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
        var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
        var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
        return hDisplay + mDisplay + sDisplay; 
    }
    function getParsedDate(date){
        date = String(date).split(' ');
        var days = String(date[0]).split('-');
        var hours = String(date[1]).split(':');
        return [parseInt(days[0]), parseInt(days[1])-1, parseInt(days[2]), parseInt(hours[0]), parseInt(hours[1]), parseInt(hours[2])];
      }

      const handleepocdate = (selecteddate,selectedtimeslot) =>
      {
        var septimeslot = selectedtimeslot.split(" ");
        var sstl = Number(septimeslot[0]);
        if(septimeslot[1] == "PM") {
            sstl = sstl + 12;
        }
        var generatingstring = selecteddate+' '+sstl+':00:00';
        var date = new Date(...getParsedDate(generatingstring));
        var modifieddate = date + (5.5 * 60 * 60);
        return (Math.round((date).getTime() / 1000));
        
      }

      const handlemiddleaccpettapped = (item) => {
          db.collection('orders').doc(item.id).get().then(ordsum => {
            if(ordsum.data().status == "pending" && ordsum.data().assignedpartner == "") {
                Alert.alert(
                    "Accept Booking",
                    "Are you sure you want to accept this booking ? Your "+item.mincredits+" Credits will be used for this booking",
                    [
                      {
                        text: "Cancel",
                        onPress: () => console.log("Cancel Press ed"),
                        style: "cancel"
                      },
                      { text: "OK", onPress: () => {
                        acceptbookingtapped(item);
                      } }
                    ]
                  );
            }
            else {
                Alert.alert(
                    "Booking can not be accepted",
                    "This booking is cancelled",
                    [
                      {
                        text: "Ok",
                        onPress: () => console.log("Cancel Pressed"),
                        style: "cancel"
                      }
                      
                    ]
                  );
            }
          }).catch(orderr => {

          })
       
      }

    const acceptbookingtapped = (item) => {
        var today = Math.round((new Date()).getTime() / 1000);
        var totaltime = 0;
       
      //  var ddts = handleepocdate(item.data.selecteddate , item.data.selectedtimeslot);
       
        
        item.data.cart.map(eachcart => {
            totaltime = totaltime + Number(eachcart.servicetime);
        })
        if(item.freeitem != null ) {
            totaltime = totaltime + Number(item.freeitem.servicetime);
        }
        if(totaltime < 2 * 60) {
            totaltime = 120;
        }
        var needanyextraprovision = 0;
        if(totaltime > 120) {
          needanyextraprovision = totaltime - 120;
        }
        var endddts = item.data.endtimeepoc + (needanyextraprovision * 60);
        var condstarttime = item.data.starttimeepoc;
        var coend = condstarttime + (totaltime * 60);
        db.collection('partners').doc(currentuser.uid).collection('worktime').get().then(allwt => {
            var evenfound = true;
            allwt.docs.map(eachdoct => {
                if((condstarttime >= eachdoct.data().start && condstarttime <= eachdoct.data().end) || (endddts >= eachdoct.data().start && endddts <= eachdoct.data().end))
                {
                    evenfound = false; 
                }
            })
            if(evenfound == true) {
              if(Number(item.mincredits) > currentusercredits) {
                Alert.alert(
                    "Insufficient Credits",
                    "You need "+item.mincredits+" credits to accept this booking",
                    [
                      {
                        text: "Ok",
                        onPress: () => console.log("Cancel Pressed"),
                        style: "cancel"
                      }
                     
                    ]
                  );
            }
            else if(Number(today) >= Number(item.startshowtime) && Number(today) <= Number(item.endshowtime)) {
                db.collection('orders').doc(item.id).update({
                    assignedpartner : currentuser.uid,
                    haspartnerapproved : true
                }).then(upd => {
                    db.collection('partners').doc(currentuser.uid).update({
                        credits : (currentusercredits - Number(item.mincredits))
                    }).then(creditsdone => {
                        db.collection('partners').doc(currentuser.uid).collection('worktime').doc(item.id).set({
                            start : item.data.starttimeepoc,
                            end : endddts
                        }).then(ddfg => {
                            db.collection('partners').doc(currentuser.uid).collection('upcomingbookings').doc(item.id).set({
                                start : item.data.starttimeepoc,
                                end : endddts
                            }).then(ddfg => {
                                db.collection('partners').doc(currentuser.uid).collection('bookingsonqueue').doc(item.id).delete().then(ddfg => {
                                    var redcred = db.collection('partners').doc(currentuser.uid).collection('creditshistory').doc().id;
    
                                    db.collection('partners').doc(currentuser.uid).collection('creditshistory').doc(redcred).set({
                                        credits : Number(item.mincredits),
                                        description : 'Credits Deducted for Order ID '+item.data.orderid,
                                        receivedon : Math.round((new Date()).getTime() / 1000),
                                        orderid : item.data.orderid,
                                        isdeducted : true
                                    }).then(upcrdone => {
                                        Alert.alert(
                                            "Booking Accepted",
                                            "",
                                            [
                                              {
                                                text: "Ok",
                                                onPress: () => console.log("Cancel Pressed"),
                                                style: "cancel"
                                              }
                                             
                                            ]
                                          );
                                          
                                    }).catch(ercred => {
            
                                    })
                                    
                                }).catch(eddfg => {
                                    
                                })
                            }).catch(eddfg => {
                                
                            })
                        }).catch(eddfg => {
        
                        })
                    }).catch(creditserror => {
    
                    });
    
                })
                .catch(err => {
    
                })
            }
            else {
                Alert.alert(
                    "Booking can not be Accepted",
                    "",
                    [
                      {
                        text: "Ok",
                        onPress: () => console.log("Cancel Pressed"),
                        style: "cancel"
                      }
                     
                    ]
                  );
            }
            }
            else {
              Alert.alert(
                "Booking can not be accepted",
                "You have already one booking at this timings",
                [
                  {
                    text: "Ok",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                  }
                 
                ]
              );
            }
        });


    }

    const passit = (today) => {
        let date=today.getDate() + "-"+ parseInt(today.getMonth()+1) +"-"+today.getFullYear()+" "+today.getHours()+":"+today.getMinutes()+":"+today.getSeconds();

        return date;
    }

      const renderitemqueue = ({item}) => {

          return <View style={{padding : 16,backgroundColor : LIGHTPINK,margin : 10,borderRadius : 10,marginLeft : 0}}>
              {item.data.preferedpartner == currentuser.uid ? 
              <View style={{display : 'flex',flexDirection : 'row',alignItems : 'center',backgroundColor : 'white',padding : 10,marginBottom : 20,borderRadius : 10}}>
                <AntDesign name= 'star' size={24} color={DEEPPINK} style={{marginRight : 8}}/>
                <Customtext type='light' style={{fontWeight : '700'}}>Preferred Booking</Customtext>
                </View>
               : <View></View>}

              <Customtext type='light' style={{fontWeight : '700'}}>{item.data.selecteddate} | {item.data.selectedtimeslot}</Customtext>
              <Customtext type='light' style={{fontWeight : '700',marginTop : 10}}>Pincode : {item.data.personpincode}</Customtext>
              <Customtext type='light' style={{fontWeight : '700',marginTop : 10}}>Category : {item.data.categoryname}</Customtext>
              <Customtext type='light' style={{fontWeight : '700',marginTop : 10}}>Net Amount of Order : Rs {item.data.netamount}</Customtext>
              <TouchableOpacity onPress={() => handlemiddleaccpettapped(item)} style={{padding : 10,borderRadius : 5,backgroundColor : DEEPPINK,margin : 20}}><Customtext type='light' style={{fontWeight : '800',textAlign : 'center',color : 'white'}}>Accept Booking</Customtext></TouchableOpacity>
              <Customtext type='light' style={{fontWeight : '700',marginTop : 10}}>You can accept this booking by </Customtext>
             <Customtext type='light' style={{fontWeight : '700',marginTop : 10}}>{passit(new Date(item.endshowtime * 1000))}</Customtext>
              <TouchableOpacity onPress={() => viewbookingtapped(item)} style={{padding : 10,borderRadius : 5,backgroundColor : DEEPPINK,margin : 20}}><Customtext type='light' style={{fontWeight : '800',textAlign : 'center',color : 'white'}}>View Booking</Customtext></TouchableOpacity>


          </View> 
      }


      const renderitempast = ({item}) => {
  
        return <View style={{padding : 20,backgroundColor : LIGHTPINK,margin : 10,borderRadius : 5,marginLeft : 0}}>
            <Customtext type='light' style={{fontWeight : '700',marginTop : 10}}>Order Id : {item.id}</Customtext>
            <Customtext type='light' style={{fontWeight : '700',marginTop : 10}}>Placed On : {passit(new Date(item.data.placedon * 1000))}</Customtext>

            <Customtext type='light' style={{fontWeight : '700',marginTop : 10}}>{item.data.selecteddate} | {item.data.selectedtimeslot}</Customtext>
            <Customtext type='light' style={{fontWeight : '700',marginTop : 10}}>Pincode : {item.data.personpincode}</Customtext>
            <Customtext type='light' style={{fontWeight : '700',marginTop : 10}}>Category : {item.data.categoryname}</Customtext>
            <Customtext type='light' style={{fontWeight : '700',marginTop : 10}}>Net Amount of Order : Rs {item.data.netamount}</Customtext>
            <TouchableOpacity onPress={() => {}} style={{padding : 10,borderRadius : 5,backgroundColor : DEEPPINK,margin : 20}}><Customtext type='light' style={{fontWeight : '800',textAlign : 'center',color : 'white'}}>{item.data.status == "cancelledbyadmin" || item.data.status == "cancelledbypartner" || item.data.status == "cancelledbyuser" ? "Cancelled" :item.data.status == "expired" ? "Expired" : "Completed" }</Customtext></TouchableOpacity>
            {/* <Customtext type='light' style={{fontWeight : '700',marginTop : 10}}>You can accept this booking in {secondsToHms(item.endshowtime,item.startshowtime)}</Customtext> */}
            <TouchableOpacity onPress={() => viewbookingtapped(item)} style={{padding : 10,borderRadius : 5,backgroundColor : DEEPPINK,margin : 20}}><Customtext type='light' style={{fontWeight : '800',textAlign : 'center',color : 'white'}}>View Booking</Customtext></TouchableOpacity>


        </View> 
    }

    const renderitemmissed = ({item}) => {
  
      return <View style={{padding : 20,backgroundColor : LIGHTPINK,margin : 10,borderRadius : 5,marginLeft : 0}}>
          <Customtext type='light' style={{fontWeight : '700',marginTop : 10}}>Order Id : {item.id}</Customtext>
          <Customtext type='light' style={{fontWeight : '700',marginTop : 10}}>Placed On : {passit(new Date(item.data.placedon * 1000))}</Customtext>

          <Customtext type='light' style={{fontWeight : '700',marginTop : 10}}>{item.data.selecteddate} | {item.data.selectedtimeslot}</Customtext>
          <Customtext type='light' style={{fontWeight : '700',marginTop : 10}}>Pincode : {item.data.personpincode}</Customtext>
          <Customtext type='light' style={{fontWeight : '700',marginTop : 10}}>Category : {item.data.categoryname}</Customtext>
          <Customtext type='light' style={{fontWeight : '700',marginTop : 10}}>Net Amount of Order : Rs {item.data.netamount}</Customtext>
          <TouchableOpacity onPress={() => {}} style={{padding : 10,borderRadius : 5,backgroundColor : DEEPPINK,margin : 20}}><Customtext type='light' style={{fontWeight : '800',textAlign : 'center',color : 'white'}}>Missed</Customtext></TouchableOpacity>
          {/* <Customtext type='light' style={{fontWeight : '700',marginTop : 10}}>You can accept this booking in {secondsToHms(item.endshowtime,item.startshowtime)}</Customtext> */}
          <TouchableOpacity onPress={() => viewbookingtapped(item)} style={{padding : 10,borderRadius : 5,backgroundColor : DEEPPINK,margin : 20}}><Customtext type='light' style={{fontWeight : '800',textAlign : 'center',color : 'white'}}>View Booking</Customtext></TouchableOpacity>


      </View> 
  }




    const renderitemupc = ({item}) => {
  
      return <View style={{padding : 20,backgroundColor : LIGHTPINK,margin : 10,borderRadius : 5,marginLeft : 0}}>

          {item.status == "cancelledbyuser" || item.status == "cancelledbypartner" || item.status == "cancelledbyadmin" && <Customtext type='light'>Booking is Cancelled</Customtext>}
          <Customtext type='light' style={{fontWeight : '700'}}>{item.data.selecteddate} | {item.data.selectedtimeslot}</Customtext>
          <Customtext type='light' style={{fontWeight : '700',marginTop : 10}}>Pincode : {item.data.personpincode}</Customtext>
          <Customtext type='light' style={{fontWeight : '700',marginTop : 10}}>Category : {item.data.categoryname}</Customtext>
          <Customtext type='light' style={{fontWeight : '700',marginTop : 10}}>Net Amount of Order : Rs {item.data.netamount}</Customtext>
          {/* <TouchableOpacity onPress={() => {item.status == 'pending' ? acceptbookingtapped(item) : ""}} style={{padding : 10,borderRadius : 5,backgroundColor : DEEPPINK,margin : 20}}><Customtext type='light' style={{fontWeight : '800',textAlign : 'center',color : 'white'}}>{item.data.status == 'pending' ? 'Start Service' : item.data.status == 'running' ? 'Stop Service' : item.data.status == 'cancelledbyuser' ? 'Cancelled By Customer' : item.data.status == 'cancelledbypartner' ? 'Cancelled':item.data.status == 'cancelledbyadmin' ? 'Cancelled' : 'Completed'}</Customtext></TouchableOpacity> */}
          {/* <Customtext type='light' style={{fontWeight : '700',marginTop : 10}}>You can accept this booking in {secondsToHms(item.endshowtime,item.startshowtime)}</Customtext> */}
          <TouchableOpacity onPress={() => viewbookingtapped(item)} style={{padding : 10,borderRadius : 5,backgroundColor : DEEPPINK,margin : 20}}><Customtext type='light' style={{fontWeight : '800',textAlign : 'center',color : 'white'}}>View Booking</Customtext></TouchableOpacity>
          <Customtext type='light' style={{marginBottom : 10}}>Placed on : {passit(new Date(item.data.placedon * 1000))}</Customtext>

          <Customtext type='light' style={{marginBottom : 10}}>Order Id : {item.id}</Customtext>


      </View> 
  }


      const viewbookingtapped = (item) => {
          navigation.navigate(VIEWBOOKING,{bookingid : item.id});
      }

      



      const getmeorders = (user) => {
        var today = Math.round((new Date()).getTime() / 1000);
        setloadingscreen(true);
        db.collection('partners').doc(user.uid).collection('bookingsonqueue').onSnapshot((allqueues) => {
            var tmporders = [];
            var allproms = [];

            // setallqueueorders([]);
            allqueues.forEach((doc) => {
                var xyz = new Promise((resolve, reject) => { 
                db.collection('orders').doc(doc.id).get().then(fgh => {
                    var x = {id : fgh.id , data : fgh.data(),startshowtime : Number(doc.data().startshowtime) , endshowtime : Number(doc.data().endshowtime),mincredits : Number(doc.data().mincredits),eligibletodisplay : false};                    
                   if(fgh.data().haspartnerapproved == undefined || fgh.data().haspartnerapproved == false || fgh.data().haspartnerapproved == 'false') {
                    var fggh = allqueueorders.filter(llo => llo.id == fgh.id);
                    if(Number(today) >= Number(doc.data().startshowtime) && Number(today) <= Number(doc.data().endshowtime)) {
                        x.eligibletodisplay = true;
                    }
                    else {
                        x.eligibletodisplay = false;
                    }
                    }
                    resolve(x);
                    tmporders.push(x);
                }).catch(erf => {
                    reject(erf);
                })

            })
            allproms.push(xyz);

            });
            Promise.all(allproms).then(allres => {

                allres = allres.sort((a, b) => (Number(a.data.placedon) > Number(b.data.placedon)) ? -1 : 1);
                allres = allres.filter(eres => eres.eligibletodisplay == true);
                setallqueueorders(allres);
                setloadingscreen(false);
                findmeupcomingorders(user);
            }).catch(promerr => {

            })
            setloadingscreen(false);
            
        }).catch(ref => {
            setloadingscreen(false);
        });
     }

     const findmeupcomingorders = (user) => {
      db.collection('partners').doc(user.uid).collection('upcomingbookings').get().then(upc => {
        var allproms = [];
        upc.docs.map(eachupc => {
            var xyz = new Promise((resolve, reject) => { 
                db.collection('orders').doc(eachupc.id).get().then(fgh => {
                // if(fgh.data().status != "completed") {
                var x = {id : fgh.id , data : fgh.data()};
   
                var copy = allupcmings;
                copy.push(x);
                resolve(x);

                // }
                
            }).catch(erf => {
                reject(erf);
                setloadingscreen(false);
            })
            
        })
        allproms.push(xyz);
        })

        Promise.all(allproms).then(allres => {
            allres = allres.sort((a, b) => (Number(a.data.placedon) > Number(b.data.placedon)) ? -1 : 1);

            setallupcmings(allres);
            findmeallpast(user);
        }).catch(promerr => {
        })
        
    }).catch(efg => {
        setloadingscreen(false);
    })
     };

     const findmeallpast = (user) => {
      db.collection('partners').doc(user.uid).collection('pastbookings').get().then(upc => {
        var allproms = [];
        upc.docs.map(eachupc => {
            var xyz = new Promise((resolve, reject) => { 
                db.collection('orders').doc(eachupc.id).get().then(fgh => {
                // if(fgh.data().status != "completed") {
                var x = {id : fgh.id , data : fgh.data()};
                var copy = allpast;
                copy.push(x);
                resolve(x);

                // }
                
            }).catch(erf => {
                reject(erf);
                setloadingscreen(false);
            })
            
        })
        allproms.push(xyz);
        })

        Promise.all(allproms).then(allres => {
            allres = allres.sort((a, b) => (Number(a.data.placedon) > Number(b.data.placedon)) ? -1 : 1);

            setallpast(allres);
            findmeallmissed(user);
        }).catch(promerr => {
        })
        
    }).catch(efg => {
        setloadingscreen(false);
    })
     }


     const findmeallmissed = (user) => {
      var today = Math.round((new Date()).getTime() / 1000);
      db.collection('orders').where("attemptedpartnersarray", "array-contains",user.uid).where('assignedpartner',"!=",user.uid).get().then(alldocs => {
        var tmp = [];
        alldocs.docs.map(eachdoc => {

          if(Number(today) >= Number(eachdoc.data().starttimeepoc) && Number(today) <= Number(eachdoc.data().endtimeepoc)) { } else if(Number(today) >= Number(eachdoc.data().starttimeepoc)) {
           var x = {id : eachdoc.id , data : eachdoc.data()};
          tmp.push(x);

          }
        })
        setloadingscreen(false);
        setallmissed(tmp);
      })
     }
   

     useEffect(() => {
      const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true)
      return () => backHandler.remove()
    }, [])

      
      useEffect(() => {
        

        
         firebase.auth().onAuthStateChanged((user) => {
            if (user) {
              setcurrentuser(user);
              registerForPushNotificationsAsync().then(token => {
                if(token != undefined) {
                db.collection('partners').doc(user.uid).update({notificationtoken : token});
                setExpoPushToken(token);
                }

              db.collection('partners').doc(user.uid).get().then((df) => {
 
                  if(df.data().isactive == false) {
                    firebase.auth().signOut().then(() => {
                        navigation.navigate(LOGIN);
                    }).catch(e => {
                    });
                  }
                  else {
                    setcurrentusername(df.data().name);
                    setcurrentuserimage(df.data().profileimage);
                    setcurrentusercredits(Number(df.data().credits));
         
                    getmeorders(user);
                    
                    
                      db.collection('partners').doc(user.uid).update({
                          lastactive : Date()
                      }).then(df => {
                          
                      })
                      .catch(g => {
  
                      })


                  }

                  
                   
                
                   
          
                    
                
            
                
                 
                    
                  
                  
              }).catch(err => {
              });

            });
            }
            else {
                setcurrentuser(null);
            }

            
         });
        db.collection('dashboardcarouselimages').orderBy('position','asc').get()
        .then((querySnapshot) => {
            var tmparr = [];
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                
                var x = {id : doc.id, position : doc.data().position , imageurl : doc.data().imageurl};
                tmparr.push(x);
            });
            
            setallimagesdata(tmparr);
        })
        .catch((error) => {
        });


      }, [])

      
    return (
        <SafeAreaView>
            {loadingscreen == true && <Loader visible={loadingscreen}/>} 
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{height : height , width : width / 3 , position : 'absolute' , right : 0 , bottom : 0 , top : 60 , opacity : 0.15  }}>
                    <Image source={require('../../assets/images/loginlowerpatternvertical.png')} style = {{width : '100%' , height : '100%' , resizeMode : 'cover'}} />
                </View>
                 <View style={{marginTop : Platform.OS === 'ios' ? 10 : 60, display : 'flex', flexDirection : 'row', alignItems : 'center',justifyContent : 'space-between',paddingHorizontal : 20,paddingBottom : 10}}>
                    <View style={{padding : 0 , display : 'flex' , flexDirection : 'row',alignItems : 'center'}}>
                        <Customtext type ="heavy" style={{fontWeight : '800' , color : DEEPPINK, fontSize : 16, fontFamily : 'Rubik-ExtraBold'}}>Welcome {currentusername}</Customtext>
                    </View>
                    { 
                    <TouchableOpacity onPress={() => navigation.navigate(PROFILE)}>
                    <View style={{width : 40 , height : 40 , borderRadius : 20 , borderWidth : 1 , borderColor : LIGHTPINK}}>
                        {currentuser === null ? <View style={{width : 40, height : 40, borderRadius : 20,display : 'flex',justifyContent : 'center',alignItems : 'center',backgroundColor : LIGHTPINK}}><Ionicons name="person" size={18} color="black" /></View>: currentuserimage ? <CachedImage source={{uri : currentuserimage}} style={{width : 40, height : 40, borderRadius : 20}} /> : <View style={{width : 40, height : 40, borderRadius : 20,display : 'flex',justifyContent : 'center',alignItems : 'center',backgroundColor : LIGHTPINK}}><Customtext type='light' style={{fontWeight : '700'}}>{currentusername[0]}</Customtext></View>}
                    </View>
                    </TouchableOpacity>
                    }
                </View> 
          
                <View style={{minHeight : height}}>
                    <View style={{marginLeft : 10, marginTop : 0 , height : height/3 }}>
                        <FlatList
                            data = {allimagesdata}
                            keyExtractor = {keyextract}
                            renderItem={renderitem}
                            horizontal={true}
                            scrollEnabled={true}
                            contentContainerStyle={{
                                flexGrow: 1,
                                }}
                        />

                        

                    </View>

                    <Customtext type='light' style={{fontWeight : '700',padding : 20, letterSpacing : 1,lineHeight : 20,textAlign : 'left'}}>My Bookings</Customtext>
                  <View style={{display : 'flex',flexDirection : 'row',justifyContent : 'space-between',backgroundColor : LIGHTPINK,padding : 15}}>
                        <TouchableOpacity onPress={() => setcurrenthead('Queued')}><Customtext type='light' style={{fontWeight : '700' , letterSpacing : 1,lineHeight : 20,textAlign : 'center',color : currenthead == 'Queued' ? DEEPPINK : 'black'}}>Queued</Customtext></TouchableOpacity>
                        <TouchableOpacity  onPress={() => setcurrenthead('Upcoming')}><Customtext type='light' style={{fontWeight : '700' , letterSpacing : 1,lineHeight : 20,textAlign : 'center',color : currenthead == 'Upcoming' ? DEEPPINK : 'black'}}>Upcoming</Customtext></TouchableOpacity>
                        <TouchableOpacity onPress={() => setcurrenthead('Past')}><Customtext type='light' style={{fontWeight : '700' , letterSpacing : 1,lineHeight : 20,textAlign : 'center',color : currenthead == 'Past' ? DEEPPINK : 'black'}}>Past</Customtext></TouchableOpacity>
                        <TouchableOpacity onPress={() => setcurrenthead('Missed')}><Customtext type='light' style={{fontWeight : '700', letterSpacing : 1,lineHeight : 20,textAlign : 'center',color : currenthead == 'Missed' ? DEEPPINK : 'black'}}>Missed</Customtext></TouchableOpacity>
                  </View>

                  <FlatList
                            data = {currenthead == "Queued" ? allqueueorders :currenthead == "Upcoming" ? allupcmings : currenthead == "Past" ? allpast : currenthead == "Missed" ? allmissed : allqueueorders}
                            keyExtractor = {keyextractqueue}
                            renderItem={currenthead == "Queued" ? renderitemqueue : currenthead == "Upcoming" ? renderitemupc : currenthead == "Past" ? renderitempast : currenthead == "Missed" ? renderitemmissed : renderitemqueue}
                            horizontal={true}
                            scrollEnabled={true}
                            contentContainerStyle={{
                                flexGrow: 1,
                                }}
                        /> 
                    {((currenthead == "Queued" && allqueueorders.length == 0) || (currenthead == "Upcoming" && allupcmings.length == 0) ||(currenthead == "Past" && allpast.length == 0) || (currenthead == "Missed" && allmissed.length == 0)) && <View style={{padding : 30}}>
                      <Customtext type='light' style={{fontWeight : '700' , letterSpacing : 1,lineHeight : 20,textAlign : 'center'}}>Currently you do not have any {currenthead} Bookings</Customtext>
                    </View>}

                    {/* {allqueueorders.length > 0 ? <View style={{marginLeft : 10, marginTop : 0 , height : ((510)) }}>
                        <Customtext type='light' style={{fontWeight : '700',marginBottom : 20,marginTop : 20 , letterSpacing : 1,lineHeight : 20,textAlign : 'center'}}>You have recived following bookings, if you do not accept it before mentioned time it will be redirected to other partner</Customtext>
                        <FlatList
                            data = {allqueueorders}
                            keyExtractor = {keyextractqueue}
                            renderItem={renderitemqueue}
                            horizontal={true}
                            scrollEnabled={true}
                            contentContainerStyle={{
                                flexGrow: 1,
                                }}
                        /> 

                        

                    </View> : <View style={{padding : 20}}><Customtext type='light' style={{fontSize : 18,fontWeight : '600',textAlign : 'center' , fontFamily : 'Rubik-Medium'}}>Currently you do not have bookings to respond to, Kindly keep sufficient credits and minimise your leave time to get more bookings</Customtext></View>} */}


                    <View style={{paddingVertical : 20, backgroundColor : DEEPPINK , marginTop : 16}}>
                        <Text style={{fontSize : 24 , color : 'white' , margin : 20, fontWeight : '800' , letterSpacing : 2, lineHeight : 40 ,textAlign : 'center'}}>Recharge your wallet so that you dont miss any leads</Text>
                        <Image source={require('../../assets/images/referal.png')} style = {{padding : 20 ,width : '100%',marginLeft : '0%' , height : height/2 , resizeMode : 'contain',marginTop : -40}}/>
                        <TouchableOpacity onPress={() => {navigation.navigate(RECHARGESCREEN)}} style={{width : '40%',marginLeft : '30%',backgroundColor : LIGHTPINK , padding : 20,borderRadius : 5,display : 'flex',justifyContent : 'center',alignItems : 'center'}}><Customtext type='light' style={{color : 'black',fontWeight : '600',fontSize : 16}}>Recharge Now</Customtext></TouchableOpacity>
                        {/* <TouchableOpacity style={{marginTop : 20}}><Text style={{textAlign : 'center',color : 'white',marginBottom : 10,fontWeight : '600'}}>Click here to know more</Text></TouchableOpacity> */}
                    </View>
 



                    
                </View>

            </ScrollView>
        </SafeAreaView>
    )
}

export default index
