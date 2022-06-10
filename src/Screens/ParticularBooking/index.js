import React , {useEffect , useState} from 'react'
import { View, Text, SafeAreaView, Image, Dimensions, FlatList, TextInput, Alert ,StyleSheet} from 'react-native'
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
import DynamicTabView from 'react-native-dynamic-tab-view';




const index = (props) => {
    const [loadingscreen, setloadingscreen] = useState(false);

    const {width,height} = Dimensions.get('screen');
        const navigation = useNavigation(); 
        const [allqueueorders, setallqueueorders] = useState([]);
        const [allupcomingbookings, setallupcomingbookings] = useState([]);
        const [refreshdata, setrefreshdata] = useState(false);
        const [currentusercredits, setcurrentusercredits] = useState(0);
        const [currentuser, setcurrentuser] = useState(null);

        const [tabdata, settabdata] = useState([
            {title : 'All',key : 'all'},
            {title : 'Today',key : 'today'},
            {title : 'Tomorrow',key : 'tomorrow'}
        ]);



        const keyextractupc = (item) => {
           
            return item.id
        }
        const renderitemupc = ({item}) => {
  
            return <View style={{padding : 20,backgroundColor : LIGHTPINK,margin : 10,borderRadius : 5,marginLeft : 0}}>
                <Customtext type='light' style={{marginBottom : 10}}>Placed on : {passit(new Date(item.data.placedon * 1000))}</Customtext>
                {item.status == "cancelledbyuser" || item.status == "cancelledbypartner" || item.status == "cancelledbyadmin" && <Customtext type='light'>Booking is Cancelled</Customtext>}
                <Customtext type='light' style={{fontWeight : '700'}}>{item.data.selecteddate} | {item.data.selectedtimeslot}</Customtext>
                <Customtext type='light' style={{fontWeight : '700',marginTop : 10}}>Pincode : {item.data.personpincode}</Customtext>
                <Customtext type='light' style={{fontWeight : '700',marginTop : 10}}>Category : {item.data.categoryname}</Customtext>
                <Customtext type='light' style={{fontWeight : '700',marginTop : 10}}>Net Amount of Order : Rs {item.data.netamount}</Customtext>
                <TouchableOpacity onPress={() => {item.status == 'pending' ? acceptbookingtapped(item) : ""}} style={{padding : 10,borderRadius : 5,backgroundColor : DEEPPINK,margin : 20}}><Customtext type='light' style={{fontWeight : '800',textAlign : 'center',color : 'white'}}>{item.data.status == 'pending' ? 'Start Service' : item.data.status == 'running' ? 'Stop Service' : item.data.status == 'cancelledbyuser' ? 'Cancelled By Customer' : item.data.status == 'cancelledbypartner' ? 'Cancelled':item.data.status == 'cancelledbyadmin' ? 'Cancelled' : 'Completed'}</Customtext></TouchableOpacity>
                {/* <Customtext type='light' style={{fontWeight : '700',marginTop : 10}}>You can accept this booking in {secondsToHms(item.endshowtime,item.startshowtime)}</Customtext> */}
                <TouchableOpacity onPress={() => viewbookingtapped(item)} style={{padding : 10,borderRadius : 5,backgroundColor : DEEPPINK,margin : 20}}><Customtext type='light' style={{fontWeight : '800',textAlign : 'center',color : 'white'}}>View Booking</Customtext></TouchableOpacity>

                <Customtext type='light' style={{marginBottom : 10}}>Order Id : {item.id}</Customtext>

  
            </View> 
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
                      onPress: () => console.log("Cancel Pressed"),
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
       
        
       var ddts = handleepocdate(item.data.selecteddate , item.data.selectedtimeslot);
       
        
        item.data.cart.map(eachcart => {
            totaltime = totaltime + Number(eachcart.servicetime);
        })
        if(item.freeitem != null ) {
            totaltime = totaltime + Number(item.freeitem.servicetime);
        }
        if(totaltime < 2 * 60) {
            totaltime = 120;
        }
        var endddts = ddts + (totaltime * 60);
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
                        start : ddts,
                        end : endddts
                    }).then(ddfg => {
                        db.collection('partners').doc(currentuser.uid).collection('upcomingbookings').doc(item.id).set({
                            start : ddts,
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
                                            onPress: () => navigation.pop(),
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

    const passit = (today) => {
        let date=today.getDate() + "-"+ parseInt(today.getMonth()+1) +"-"+today.getFullYear()+" "+today.getHours()+":"+today.getMinutes()+":"+today.getSeconds();

        return date;
    }
  
        const renderitemqueue = ({item}) => {
  
            return <View style={{padding : 20,backgroundColor : LIGHTPINK,margin : 10,borderRadius : 5,marginLeft : 0}}>
                <Customtext type='light' style={{fontWeight : '700'}}>{item.data.selecteddate} | {item.data.selectedtimeslot}</Customtext>
                <Customtext type='light' style={{fontWeight : '700',marginTop : 10}}>Pincode : {item.data.personpincode}</Customtext>
                <Customtext type='light' style={{fontWeight : '700',marginTop : 10}}>Category : {item.data.categoryname}</Customtext>
                <Customtext type='light' style={{fontWeight : '700',marginTop : 10}}>Net Amount of Order : Rs {item.data.netamount}</Customtext>
                <TouchableOpacity onPress={() => handlemiddleaccpettapped(item)} style={{padding : 10,borderRadius : 5,backgroundColor : DEEPPINK,margin : 20}}><Customtext type='light' style={{fontWeight : '800',textAlign : 'center',color : 'white'}}>Accept Booking</Customtext></TouchableOpacity>
                <TouchableOpacity onPress={() => viewbookingtapped(item)} style={{padding : 10,borderRadius : 5,backgroundColor : DEEPPINK,margin : 20}}><Customtext type='light' style={{fontWeight : '800',textAlign : 'center',color : 'white'}}>View Booking</Customtext></TouchableOpacity>
                <Customtext type='light' style={{fontWeight : '700',marginTop : 10}}>You can accept this booking by </Customtext>
                <Customtext type='light' style={{fontWeight : '700',marginTop : 10}}>{passit(new Date(item.endshowtime * 1000))}</Customtext>


  
            </View> 
        }
        const viewbookingtapped = (item) => {
            navigation.navigate(VIEWBOOKING,{bookingid : item.id});
        }

        function formatDate(dt) {
            var fulldays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
               var date = dt.getDate();
               var someDateTimeStamp = (Math.round((dt).getTime() / 1000));
               var month = months[dt.getMonth()];
               var  timeDiff = someDateTimeStamp - Date.now();
               var  diffDays = new Date().getDate() - date;
               var  diffMonths = new Date().getMonth() - dt.getMonth();
               var diffYears = new Date().getFullYear() - dt.getFullYear();
        
            if(diffYears === 0 && diffDays === 0 && diffMonths === 0){
              return "Today";
            }else if(diffYears === 0 && diffDays === 1) {
              return "Yesterday";
            }else if(diffYears === 0 && diffDays === -1) {
              return "Tomorrow";
            }else if(diffYears === 0 && (diffDays < -1 && diffDays > -7)) {
              return fulldays[dt.getDay()];
            }else if(diffYears >= 1){
              return month + " " + date + ", " + new Date(someDateTimeStamp).getFullYear();
              }else {
                return month + " " + date;
              }
        }

        const getmeupcoming = (user) => {
            setloadingscreen(true);

            db.collection('orders').doc(props.route.params.bookingid).get().then(fgh => {
                // if(fgh.data().status != "completed") {
                var x = {id : fgh.id , data : fgh.data()};
                var copy = allupcomingbookings;
                copy.push(x);
                setallupcomingbookings(copy);
                setrefreshdata(!refreshdata);
                setloadingscreen(false);

                // }
                
            }).catch(erf => {
                setloadingscreen(false);
            })

           
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
                         if(fgh.data().haspartnerapproved == false || fgh.data().haspartnerapproved == 'false') {
                        var fggh = allqueueorders.filter(llo => llo.id == fgh.id);
                        if(Number(today) >= Number(doc.data().startshowtime) && Number(today) <= Number(doc.data().endshowtime)) {
                            x.eligibletodisplay = true;
                            // var copy = allqueueorders;
                            // copy.push(x);
                            // console.log("Found this "+x.id);
                            // console.log(x.data.netamount);
                            
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
                }).catch(promerr => {

                })
                setloadingscreen(false);
                
            }).catch(ref => {
                setloadingscreen(false);
            });
         }

         useEffect(() => {
        

        
            firebase.auth().onAuthStateChanged((user) => {
               if (user) {
                   setcurrentuser(user);
                db.collection('partners').doc(user.uid).get().then((df) => {
                   
                    setcurrentusercredits(Number(df.data().credits));
                    getmeupcoming(user);
                    // getmeorders(user);

                }).catch(err => {
                });
  
                     
               }
   
               
            });
   
   
   
         }, [])


         const renderTab = (item, index) => {
          return <View>
                       
          </View>
        }
  
        const onChangeTab = () => {
  
        }

    return (
        <View>
                        {loadingscreen == true && <Loader visible={loadingscreen}/>} 

            <View style={{display : 'flex',flexDirection : 'row',justifyContent : 'space-between',alignItems : 'center',padding : 10}}>
                    <TouchableOpacity style={{ width : 60,marginTop : topgapforheading}} onPress={() =>  navigation.pop()}>
                        <Ionicons name="arrow-back-circle" size={36} color={DEEPPINK} />
                    </TouchableOpacity>
                   
                </View>
            <ScrollView showsVerticalScrollIndicator={false}>

                <View style={{display : 'flex',flexDirection : 'row',justifyContent : 'space-between',alignItems : 'center',padding : 10}}>
                 
                </View>
     
                    <Customtext type='light' style={{fontWeight : '800',color : DEEPPINK,fontSize : 18,letterSpacing : 0.8,textAlign : 'right',margin : 10 }}>Booking</Customtext>
                    {/* <DynamicTabView
        data={tabdata}
        renderTab={renderTab}
        onChangeTab={onChangeTab}
        defaultIndex={0}
        containerStyle={styless.container}
        headerTextStyle={styless.headerText}

        headerBackgroundColor={LIGHTPINK}
        headerUnderlayColor={DEEPPINK}
      /> */}
                    {allupcomingbookings.length == 0 ? <View style={{padding : 20,display : 'flex',alignContent : 'center',justifyContent : 'center'}}><Customtext type='light' style={{textAlign : 'center',fontWeight : '700',marginBottom : 50}}>Currently you have no upcoming bookings </Customtext></View> : <View style={{marginLeft : 10, marginTop : 0,maxWidth : 1 * width }}>
                        <FlatList
                        extraData={refreshdata}
                            data = {allupcomingbookings}
                            keyExtractor = {keyextractupc}
                            renderItem={renderitemupc}
                            horizontal={false}
                            scrollEnabled={true}
                            contentContainerStyle={{
                                flexGrow: 1,
                                }}
                        />

                        

                    </View> }
            </ScrollView>
            
        </View>
    )
    
}

   
const styless = StyleSheet.create({
    container: {
      flex: 1
    },
    // `headerContainer: {
    //   marginTop: 16
    // },`
    headerText: {
      color:'black'
    },
    // tabItemContainer: {
    //   backgroundColor: "#cf6bab"
    // }
  });


export default index
