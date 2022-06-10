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
import DateTimePicker from '@react-native-community/datetimepicker';
import Customtext from '../../components/Customtext';


const index = (props) => {
    const [loadingscreen, setloadingscreen] = useState(false);

    const {width,height} = Dimensions.get('screen');
        const navigation = useNavigation(); 
        const [currentuser, setcurrentuser] = useState(null);
        const [allleaveshistory, setallleaveshistory] = useState([]);



        const [date, setDate] = useState(null);
        const [mode, setMode] = useState('date');
        const [show, setShow] = useState(false);

        const [date2, setDate2] = useState(null);
        const [mode2, setMode2] = useState('date');
        const [show2, setShow2] = useState(false);
      
        const onChange = (event, selectedDate) => {
          const currentDate = selectedDate || date;
          setShow(Platform.OS === 'ios');
          setDate(currentDate);
        };

        const onChange2 = (event, selectedDate) => {
            const currentDate = selectedDate || date2;
            setShow2(Platform.OS === 'ios');
            setDate2(currentDate);
          };
      
        const showMode = (currentMode) => {
          setShow(true);
          setMode(currentMode);
        };

        const showMode2 = (currentMode) => {
            setShow2(true);
            setMode2(currentMode);
          };
      
        const showDatepicker = () => {
          showMode('date');
        };
        const showDatepicker2 = () => {
            showMode2('date');
          };
      
        const showTimepicker = () => {
          showMode('time');
        };
        const showTimepicker2 = () => {
            showMode2('time');
          };


    useEffect(() => {

    }, [])


    const addleavetapped = () => {
        if(date == null) {
            Alert.alert(
                "Choose Start Date & Time",
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
        else if (date2 == null) {
            Alert.alert(
                "Choose End Date & Time",
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
       else  {
           
        var sd = Math.round((date).getTime() / 1000);
        var ed = Math.round((date2).getTime() / 1000);
        if(sd > ed) {
        Alert.alert(
            "Start date can not be later to End date",
            "",
            [
              {
                text: "Ok",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
              }
             
            ]
          );
        }else {
      
           var randleavetime = db.collection('partners').doc(currentuser.uid).collection('leavetime').doc().id;
           var sd = Math.round((date).getTime() / 1000);
           var ed = Math.round((date2).getTime() / 1000);
           db.collection('partners').doc(currentuser.uid).collection('leavetime').doc(randleavetime).set({
               start : sd,
               end : ed
           }).then(lvdon => {
               setDate(null);
               setDate2(null);
               fetchleaves(currentuser.uid);
            Alert.alert(
                "Leave updated",
                "",
                [
                  {
                    text: "Ok",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                  }
                 
                ]
              );
           }).catch(lverr => {
           });
       }
    }
}
const deletethisleave = (leave) => {
  Alert.alert(
    "Are you sure you want to delete this leave ? ",
    "",
    [
      {
        text: "Yes I want to delete",
        onPress: () => {
          db.collection('partners').doc(currentuser.uid).collection('leavetime').doc(leave.id).delete().then(dodel => {
            fetchleaves(currentuser.uid);
            Alert.alert(
              "Leave Deleted",
              "",
              [
               
                {
                  text: "Ok",
                  onPress: () => console.log("Cancel Pressed"),
                  style: "cancel"
                }
               
              ]
            );
          }).catch(erdel => {

          })
        },
        style: "cancel"
      },
      {
        text: "No I do not want to delete",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel"
      }
     
    ]
  );
}



    const keyextract = (item) => {
        return item.id
    }

    const renderitem = ({item}) => {
        return <View style={{backgroundColor : LIGHTPINK,padding : 20,margin : 10,borderRadius : 5}}>
          <View style={{display : 'flex',flexDirection : 'row',justifyContent : 'space-between'}}>
            <Customtext type='light' style={{fontWeight : '700',fontSize : 16,color : DEEPPINK,padding : 10}}>Leave Timings</Customtext>
            <TouchableOpacity onPress={() => {deletethisleave(item)}} style={{padding : 10}}><Text style={{fontWeight : '800',color : DEEPPINK}}>Delete</Text></TouchableOpacity>

          </View>
            <Customtext type='light' style={{fontWeight : '600',fontSize : 14,color : 'black',marginTop : 10}}>{passit(new Date(item.data.start*1000)) } - {passit(new Date(item.data.end*1000))}</Customtext>


        </View>
    }


    const fetchleaves = (uid) => {
        db.collection('partners').doc(uid).collection('leavetime').orderBy('start','desc').get().then(leavehist => {
            var tmp = [];
            leavehist.docs.map(eachcred => {
                var x = {id : eachcred.id , data : eachcred.data()};
                tmp.push(x);
               

            })
            setallleaveshistory(tmp);
        }).catch(errcred => {

        })
    }


    useEffect(() => {
        

        
        firebase.auth().onAuthStateChanged((user) => {
           if (user) {
             setcurrentuser(user);
             fetchleaves(user.uid);
     
           }
           else {
               setcurrentuser(null);
           }

           
        });
   


     }, [])

     const passit = (today) => {
      let date=today.getDate() + "-"+ parseInt(today.getMonth()+1) +"-"+today.getFullYear()+" "+today.getHours()+":"+today.getMinutes()+":"+today.getSeconds();

      return date;
  }

    return (
        <View>
                        {loadingscreen == true && <Loader visible={loadingscreen}/>} 

            <View style={{marginTop : topgapforheading , position : 'relative',display : 'flex',flexDirection : 'row',alignItems : 'center'}}>
                <TouchableOpacity style={{ width : 60}} onPress={() =>  navigation.pop()}>
                        <View style={{borderRadius : 10 , padding : 10 , zIndex : 1035}}>
                        <Ionicons name="arrow-back-circle" size={36} color={DEEPPINK} style={{zIndex : 1035}} />
                        </View>
                    </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
            <Customtext type='light' style={{fontSize : 16, fontWeight : '700',margin : 20}}>Add a new Leave</Customtext>

            <View style={{padding : 20}}>
                <View style={{display : 'flex',flexDirection : 'row',justifyContent :'space-between'}}>
                    <TouchableOpacity onPress={showDatepicker} style={{padding : 12 , backgroundColor : DEEPPINK,borderRadius : 10,width : '95%'}} ><Customtext type='light' style={{fontWeight : '600',color : 'white',textAlign : 'center'}}>Select leave starting date</Customtext></TouchableOpacity>
                    <TouchableOpacity onPress={showTimepicker} style={{padding : 12 , backgroundColor : DEEPPINK,borderRadius : 10,width : '95%'}} ><Customtext type='light' style={{fontWeight : '600',color : 'white',textAlign : 'center'}}>Select leave starting time</Customtext></TouchableOpacity>
                </View>
                <View>
                    <Customtext type='light' style={{padding : 10 , color : DEEPPINK,fontWeight : '700',fontSize : 16}}>Leave Start Date : {date != null ?  passit(date)  : ""}</Customtext>

                </View>
                {show && (
                    <DateTimePicker
                    testID="dateTimePicker"
                    value={date || new Date()}
                    mode={mode}
                    is24Hour={true}
                    display="default"
                    onChange={onChange}
                    minimumDate={new Date()}
                    />
                )}
            </View>


            <View style={{padding : 20}}>
                <View style={{display : 'flex',flexDirection : 'row',justifyContent :'space-between'}}>
                    <TouchableOpacity onPress={showDatepicker2} style={{padding : 12 , backgroundColor : DEEPPINK,borderRadius : 10,width : '95%'}} ><Customtext type='light' style={{fontWeight : '600',color : 'white',textAlign : 'center'}}>Select leave ending date</Customtext></TouchableOpacity>
                    <TouchableOpacity onPress={showTimepicker2} style={{padding : 12 , backgroundColor : DEEPPINK,borderRadius : 10,width : '95%'}} ><Customtext type='light' style={{fontWeight : '600',color : 'white',textAlign : 'center'}}>Select leave ending time</Customtext></TouchableOpacity>
                </View>
                <View>
                    <Customtext type='light' style={{padding : 10 , color : DEEPPINK,fontWeight : '700',fontSize : 16}}>Leave End Date : {date2 != null ? passit(date2) : ""}</Customtext>

                </View>
                {show2 && (
                    <DateTimePicker
                    testID="dateTimePicker"
                    value={date2 || new Date()}
                    mode={mode2}
                    is24Hour={true}
                    display="default"
                    onChange={onChange2}
                    minimumDate={new Date()}
                    
                    />
                )}
            </View>

            <TouchableOpacity onPress={addleavetapped} style={{padding : 15,backgroundColor : DEEPPINK,width : '50%',marginLeft : '25%',borderRadius : 10,marginTop : 20}}><Customtext type='light' style={{fontWeight : '700',color : 'white',fontSize : 18,letterSpacing : 1,textAlign : 'center'}}>Add Leave</Customtext></TouchableOpacity>

            <Image source={require('../../assets/images/calendar.png')} style={{width : '100%',marginLeft: '0%' ,height : 300, resizeMode : 'contain'}} />
            
                
            <Customtext type='light' style={{fontSize : 16, fontWeight : '700',margin : 20}}>Leaves History</Customtext>
            {
              allleaveshistory.length == 0 ?  <Customtext type='light' style={{fontSize : 18, fontWeight : '700',margin : 20,textAlign : 'center' , color  :DEEPPINK,marginBottom : 30}}>No Leaves Found</Customtext> :

                        <FlatList
                            data = {allleaveshistory}
                            keyExtractor = {keyextract}
                            renderItem={renderitem}
                            horizontal={false}
                            scrollEnabled={true}
                            contentContainerStyle={{
                                flexGrow: 1,
                                }}
                            style={{marginBottom : 200}}
                        />

            }

            

        </ScrollView>
    </View>
    )
}

export default index
