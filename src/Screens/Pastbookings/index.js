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

const index = () => {
    const [loadingscreen, setloadingscreen] = useState(false);

    const {width,height} = Dimensions.get('screen');
        const navigation = useNavigation(); 
        const [allqueueorders, setallqueueorders] = useState([]);
        const [allupcomingbookings, setallupcomingbookings] = useState([]);
        const [refreshdata, setrefreshdata] = useState(false);


        const passit = (today) => {
            let date=today.getDate() + "-"+ parseInt(today.getMonth()+1) +"-"+today.getFullYear()+" "+today.getHours()+":"+today.getMinutes()+":"+today.getSeconds();
    
            return date;
        }

        const keyextractupc = (item) => {
            return item.id
        }
        const renderitemupc = ({item}) => {
  
            return <View style={{padding : 20,backgroundColor : LIGHTPINK,margin : 10,borderRadius : 5,marginLeft : 0}}>
                <Customtext type='light' style={{fontWeight : '700',marginTop : 10}}>Order Id : {item.data.publicfacingid}</Customtext>
                <Customtext type='light' style={{fontWeight : '700',marginTop : 10}}>Placed On : {passit(new Date(item.data.placedon * 1000))}</Customtext>

                <Customtext type='light' style={{fontWeight : '700',marginTop : 10}}>{item.data.selecteddate} | {item.data.selectedtimeslot}</Customtext>
                <Customtext type='light' style={{fontWeight : '700',marginTop : 10}}>Pincode : {item.data.personpincode}</Customtext>
                <Customtext type='light' style={{fontWeight : '700',marginTop : 10}}>Category : {item.data.categoryname}</Customtext>
                <Customtext type='light' style={{fontWeight : '700',marginTop : 10}}>Net Amount of Order : Rs {item.data.netamount}</Customtext>
                <TouchableOpacity onPress={() => {}} style={{padding : 10,borderRadius : 5,backgroundColor : DEEPPINK,margin : 20}}><Customtext type='light' style={{fontWeight : '800',textAlign : 'center',color : 'white'}}>Completed</Customtext></TouchableOpacity>
                {/* <Customtext type='light' style={{fontWeight : '700',marginTop : 10}}>You can accept this booking in {secondsToHms(item.endshowtime,item.startshowtime)}</Customtext> */}
                <TouchableOpacity onPress={() => viewbookingtapped(item)} style={{padding : 10,borderRadius : 5,backgroundColor : DEEPPINK,margin : 20}}><Customtext type='light' style={{fontWeight : '800',textAlign : 'center',color : 'white'}}>View Booking</Customtext></TouchableOpacity>
  
  
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





        const viewbookingtapped = (item) => {
            navigation.navigate(VIEWBOOKING,{bookingid : item.id});
        }



        const getmeupcoming = (user) => {
            setloadingscreen(true);
            db.collection('partners').doc(user.uid).collection('pastbookings').get().then(upc => {
                upc.docs.map(eachupc => {
                    db.collection('orders').doc(eachupc.id).get().then(fgh => {
                        if(fgh.data().status != "pending") {
                        var x = {id : fgh.id , data : fgh.data()};
                        var copy = allupcomingbookings;
                        copy.push(x);
               
                        setallupcomingbookings(copy);
                        setrefreshdata(!refreshdata);
                        }
                        
                    }).catch(erf => {
                    })
                })
                setloadingscreen(false);
            }).catch(efg => {
                setloadingscreen(false);
            })
        }

    

         useEffect(() => {
        

        
            firebase.auth().onAuthStateChanged((user) => {
               if (user) {
                    getmeupcoming(user);
                     
                     
               }
   
               
            });
   
   
   
         }, [])

    return (
        <SafeAreaView>
            <View>
            {loadingscreen == true && <Loader visible={loadingscreen}/>} 

                <View style={{display : 'flex',flexDirection : 'row',justifyContent : 'space-between',alignItems : 'center',padding : 10}}>
                    <TouchableOpacity style={{ width : 60,marginTop : topgapforheading}} onPress={() =>  navigation.pop()}>
                        <Ionicons name="arrow-back-circle" size={36} color={DEEPPINK} />
                    </TouchableOpacity>
                    <Customtext type='light' style={{fontWeight : '800',color : DEEPPINK,fontSize : 18,letterSpacing : 0.8,textAlign : 'right',margin : 10 }}>Past Bookings</Customtext>

                </View>
       
                    {allupcomingbookings.length == 0 ? <View style={{padding : 20,display : 'flex',alignContent : 'center',justifyContent : 'center'}}><Customtext type='light' style={{textAlign : 'center',fontWeight : '700',marginBottom : 50}}>Currently you have no upcoming bookings </Customtext></View> : <View style={{marginLeft : 10, marginTop : 0,maxWidth : 1 * width }}>
                        <FlatList
                        style={{height : height * 0.85}}
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
            </View>
            
        </SafeAreaView>
    )
}

export default index
