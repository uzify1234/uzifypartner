import React , {useState , useEffect , useRef } from 'react'
import { View, Text, TouchableOpacity, Image, TextInput, FlatList, Dimensions ,Pressable , ScrollView , CheckBox ,StyleSheet} from 'react-native'
import { DEEPPINK, GREYISH, LIGHTPINK,topgapforheading } from '../../Constants/Colors'
import { Ionicons } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from './style.js';
import * as ImagePicker from 'expo-image-picker';
import * as firebase from 'firebase';
import Loader from '../../components/Loader';
import db from '../../config/firebase';
import { useNavigation, useScrollToTop } from '@react-navigation/native';
import {ExpandableListView} from 'react-native-expandable-listview';
import Extandingheads from '../../components/Extandingheads';
import PickerCheckBox from 'react-native-picker-checkbox';
import { AntDesign } from '@expo/vector-icons';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { GENERALINFO } from '../../Constants/routesName';
import Customtext from '../../components/Customtext';
import DynamicTabView from 'react-native-dynamic-tab-view';











const index = (props) => {

    const navigation = useNavigation(); 
    const {width,height} = Dimensions.get('screen');
    const [partnerauthid, setpartnerauthid] = useState("xyz123");
    const flatListRef = useRef();
    const scrollRef = useRef();
    const [loadingscreen, setloadingscreen] = useState(false);

    const [anythingchanged, setanythingchanged] = useState(false);
    const [alreadyexistingdata, setalreadyexistingdata] = useState({});

    const [message, setmessage] = useState("");

    const [allavailablepincodes, setallavailablepincodes] = useState([]);
    const [selectedpincodes, setselectedpincodes] = useState([]);
    const [refreshdata, setrefreshdata] = useState(false);
    const [listcontent, setlistcontent] = useState([]);

    const [actualrefresh, setactualrefresh] = useState(false);
    const [partnerselectedcities, setpartnerselectedcities] = useState([]);

    const [tabdata, settabdata] = useState([]);
    const [wholedatatotal, setwholedatatotal] = useState([]);

   
    const [refresh, setrefresh] = useState(false);
    const [onlycities, setonlycities] = useState([]);

    const [currentlytappedcity, setcurrentlytappedcity] = useState(null);


    const scrollToIndex = () => {
      
        if(scrollRef.current) {
            console.log('scroll to index called !')
            let index = 0
            scrollRef.current?.scrollTo({
                y: 0,
                animated: true,
              });
            }
      }

    const onlycitieskey = (item) => {
        return item.id
      }
      const onlycitiesrender = ({item}) => { 

        console.log("Current tapped city");
        console.log(currentlytappedcity);
        var findout = "";
        if(currentlytappedcity != null) {
            findout = currentlytappedcity.cityname;
        }

        return <TouchableOpacity onPress={() => {setTimeout(() => scrollToIndex(), 500); setcurrentlytappedcity(item)}}><Customtext type='light' style={{ padding : 10 , fontWeight : '700' , fontSize : 16,marginRight : 20,color : findout == item.cityname ? DEEPPINK : 'black'}}>{item.cityname}</Customtext>
        </TouchableOpacity>

      }

      useEffect(() => {
        //   if(flatListRef !== undefined && flatListRef.current !== undefined && flatListRef?.current) {
        //     flatListRef.current?.scrollToOffset({ offset: 0 })
        //     useScrollToTop(navigation,flatListRef);
        //   }
        setTimeout(() => scrollToIndex(), 500);
      }, [currentlytappedcity])


      const onlycitieskey2 = (item) => {
        return item.id
      }
      const onlycitiesrender2 = ({item}) => { 

        
   
          return <View style={{margin : 5,backgroundColor : LIGHTPINK,borderRadius : 10}}>
        {
                      item.areas.length > 0 && 
                          (
                              <View style={{padding : 10,backgroundColor : LIGHTPINK,borderRadius : 5,margin : 5}}>
                              <BouncyCheckbox
                              size={25}
                              fillColor={DEEPPINK}
                              unfillColor="#FFFFFF"
                              text={item.id}
                              iconStyle={{ borderColor: DEEPPINK , borderRadius : 2,marginBottom : 10,marginLeft : 10 }}
                              textStyle={{ fontWeight : '700' , color : 'black' }}
                              isChecked={item.selected}
                              onPress={(isChecked) => {item.selected = !item.selected;setSelection(currentlytappedcity.id , item.id)}}
                              />
                              {
                                  item.areas.map(eacharea => {
                                      return(<Text style={{fontWeight : '500',margin : 2}}>{eacharea}</Text>)
                                  })
                              }
                              </View>
                          )
                      
                  }


</View>
      }


    const setSelection = (city,pincode) => {
        console.log(city+ " and "+pincode);
        // console.log(selectedpincodes);
        var copy = selectedpincodes;
        var gf = selectedpincodes.filter(eg => eg.id == city );
        if(gf.length == 0) {
            setactualrefresh(false);
          var x = {
              "id": pincode,
              "name": pincode
          }
          var y = {
              "categoryName": city,
              "id": city,
              "subCategory":[
                 x
              ]
                   
          }
          copy.push(y);
          setselectedpincodes(copy);
          console.log("City itself not found");
          setactualrefresh(true);



        } 
        else {
          var hf = selectedpincodes.filter(eg => eg.id == city );
          var hhf = hf[0].subCategory.filter(hj => hj.id == pincode);
          if(hhf.length > 0) {
            setactualrefresh(false);
            var wholecopy = selectedpincodes;

              var copy = selectedpincodes.filter(eg => eg.id == city );
            //   console.log("Here");
              var collect = [];
              var innercopy = selectedpincodes.filter(eg => eg.id == city )[0].subCategory;
            //   console.log("Or Here");
              innercopy.map(einf => {
                  if(einf.id !== pincode) {
                      collect.push(einf);
                  }
              })
              wholecopy.map(eachwholecopy => {
                if(eachwholecopy.id == city) {
                  eachwholecopy.subCategory = innercopy;
                }
            })
              copy[0].subCategory = collect;
              setselectedpincodes(wholecopy);
              console.log("City and pincode both  found");
              setactualrefresh(true);


          }
          else {
            setactualrefresh(false);
              var wholecopy = selectedpincodes;
              var copy = selectedpincodes.filter(eg => eg.id == city );
              var innercopy = selectedpincodes.filter(eg => eg.id == city )[0].subCategory;
              var x = {
                  "id": pincode,
                  "name": pincode
              }
              innercopy.push(x);
              wholecopy.map(eachwholecopy => {
                  if(eachwholecopy.id == city) {
                    eachwholecopy.subCategory = innercopy;
                  }
              })
              copy[0].subCategory = innercopy;
              setselectedpincodes(wholecopy);
              console.log("City found but pincode not found");
              setactualrefresh(true);
             
          }

        }

        console.log(selectedpincodes);


    }

    const cattapped = (item) => {


    }

    const keyextractservice2 = (item) => {
        return item.id
      }

      const renderitemservice2 = ({item}) => { return <View style={{width : '50%',minWidth : width * 0.4}}><Pressable onPress={() => cattapped(item)} style={{backgroundColor : selectedpincodes.filter(ef => ef.id == item.id).length == 0 ? LIGHTPINK : DEEPPINK ,padding : 5 , marginHorizontal : 5 ,marginVertical : 5, borderRadius : 4 }}><View style={{display : 'flex' , alignItems : 'center'  }}><Image source={{uri : item.iconurl}} style={{width : 80 , height : 80 , borderRadius : 5,marginRight : 2,marginBottom : 10}} /><View>
      <Customtext type='light' style={{fontSize : 16 , fontWeight : '700'}}>{item.categoryname}</Customtext><View style={{display : 'flex',flexDirection : 'row',alignItems : 'center'}}></View></View></View></Pressable></View>
  }

    useEffect(() => {
    
        setpartnerauthid(props.route.params.partnerid);
        const userid = props.route.params.partnerid;
        var wholedata = [];
        var wholedatainsetails = [];
        db.collection('partners').doc(userid).get().then(allinfo => {
            var cities = allinfo.data().selectedcities;
            setpartnerselectedcities(cities);
            var allcities = [];
            var tpppselectedpincodes = [];
            if(allinfo.data().selectedpincodes !== undefined) {

                Object.entries(allinfo.data().selectedpincodes).map(([key, value]) => {
                    // console.log("Hey Passing "+key+" and "+value);
                    setSelection(value,key);
                })
                // Object.entries(allinfo.data().selectedpincodes).map((key,value) => {
                //     console.log("Passing "+key+" and "+allinfo.data().selectedpincodes[key]);
                //     setSelection(key,value);
                //  })
                
            }
            cities.map(eachcity => {
                var allproms = [];
                var newp = new Promise((resolve, reject) => { 
                    db.collection('cities').doc(eachcity).get().then(edfcist => {
                        db.collection('cities').doc(eachcity).collection('pincodes').get().then(allpincodes => {
                            var singlecity = [];
                            allpincodes.docs.map(eahcdoc => {
                                // console.log(eahcdoc.data());
                                if(eahcdoc.data().isactive == true || eahcdoc.data().isactive == "true") {
                                    var found = false;
                                    if(allinfo.data().selectedpincodes !== undefined) {
                                    Object.keys(allinfo.data().selectedpincodes).map((key) => {
                                        // console.log("Key is "+key);
                                        if(key == eahcdoc.data().id) {
                                            found = true;
                                        }
                                     })
                                    }
    
                                var x = {id: eahcdoc.data().id, name: eahcdoc.data().id,selected : found,areas :eahcdoc.data().areas };
                                singlecity.push(x);
                            
                                }
                            });
                            var y = {id : eachcity ,categoryName : eachcity , subCategory : singlecity , cityname : edfcist.data().cityname};

                            resolve(y);
                            
                            // allcities.push(y);
                            // console.log("All Cities ------------------------>");
                            // console.log(allcities);
                            // setlistcontent([...allcities]);
                            
                            setactualrefresh(true);
                        }).catch(egh => {
                            console.log(egh);
                            reject(egh);
                        })
                    })
                    .catch(gerr => {
                        console.log(gerr);
                    })
                }) 
                allproms.push(newp);
                
                Promise.all(allproms).then(results => {
                    console.log("Check this final");
                    
                    wholedatainsetails.push(results[0]);
                    setwholedatatotal(wholedatainsetails);
                    setlistcontent(wholedatainsetails);
                    setcurrentlytappedcity(wholedatainsetails[0]);
                    console.log(wholedatainsetails[0]);
                   
                    
                    results.map(eachres => {
                        var x = {title : eachres.cityname , key : eachres.categoryName};
                        console.log(x);
                        wholedata.push(x);
                    })
                    settabdata(wholedata);
                    // console.log(wholedata);
                })

                
            })
  
        }).catch(err => {
            console.log(err);
        })

  
   
    }, [])

    const attempuploads = () => {
        // console.log(selectedpincodes);
        const userid = partnerauthid;
        var citieschecked = 0;
        var usefularray = {};
        var actuallyarray = [];
        partnerselectedcities.map(eachcity => {
            // console.log(eachcity);
            var dm = selectedpincodes.filter(cc => cc.id == eachcity).length;
            if(dm > 0) {
                var coll = selectedpincodes.filter(cc => cc.id == eachcity)[0];
                if(coll.subCategory.length == 0) {
                    alert("You need to choose atleast one Pincode for each city");
                    setmessage("You need to choose atleast one Pincode for each city");
                    return;
                }
                else {
                    citieschecked = citieschecked + 1;
                    coll.subCategory.map(eachcoll => {
                        var x = {pincode : eachcoll.id , cityid : eachcity};
                        usefularray[eachcoll.id] = eachcity;
                        actuallyarray.push(eachcoll.id);
                    })
                    if(citieschecked == partnerselectedcities.length){
                        // console.log("Lets check this point");
                        // console.log(usefularray);
                        db.collection('partners').doc(userid).update({
                            selectedpincodes : usefularray,
                            selectedpincodesarray : actuallyarray
                        }).then(done => {
                            setmessage("Details Updated");
                            navigation.navigate(GENERALINFO , {partnerid : partnerauthid});
                        }).catch(err => {

                        })
                    }
                }
            }
            else {
                alert("You need to choose atleast one Pincode for each city");
                setmessage("You need to choose atleast one Pincode for each city");
                return;
            }
        })


        
        
    }

    const handleConfirm = (pItems) => {
        console.log('pItems =>', pItems);
      }

    const handleItemClick = ({index}) => {
        console.log(index);
      };
    
      const handleInnerItemClick = ({innerIndex, item, itemIndex}) =>  {
        console.log(innerIndex);
      };


      const getmecolor = (city,pincode) => {
        if(selectedpincodes.filter(eg => eg.id == city ).length > 0) {
            if(selectedpincodes.filter(eg => eg.id == city )[0].subCategory.filter(efg => efg.id == pincode ).length > 0) {
                return 'yes';
            }
            else {
                return 'white';
            }
        }
        else {
            return 'white';
        }
        
       
      }

      const getmecitycount = (city) => {
        if(selectedpincodes.filter(eg => eg.id == city ).length > 0) {
            return selectedpincodes.filter(eg => eg.id == city )[0].subCategory.length
        }
        else {
        return 0;
        }
      }

      const getmetotalcount = () => {
        var count = 0;
        selectedpincodes.map(ek => {
            count = count + ek.subCategory.length;
        })
        return count;
      }
 
      const renderTab = (item, index) => {
          console.log("render");
          var fm = listcontent.filter(ek => ek.categoryName == item.key);
        //   console.log(fm);
        return <View>
                      {
                                    fm.length > 0 && fm[0].subCategory.map(eachsc => {
                                        return(
                                            <View style={{padding : 10,backgroundColor : LIGHTPINK,borderRadius : 5,margin : 5}}>
                                            <BouncyCheckbox
                                            size={25}
                                            fillColor={DEEPPINK}
                                            unfillColor="#FFFFFF"
                                            text={eachsc.id}
                                            iconStyle={{ borderColor: DEEPPINK , borderRadius : 2,marginBottom : 10,marginLeft : 10 }}
                                            textStyle={{ fontWeight : '700' , color : 'black' }}
                                            isChecked={eachsc.selected}
                                            onPress={(isChecked) => {setSelection(fm[0].id , eachsc.id)}}
                                            />
                                            {
                                                eachsc.areas.map(eacharea => {
                                                    return(<Text style={{fontWeight : '500',margin : 2}}>{eacharea}</Text>)
                                                })
                                            }
                                            </View>
                                        )
                                    })
                                }


        </View>
      }

      const onChangeTab = () => {

      }

    return (
        <View>
             {loadingscreen == true && <Loader visible={loadingscreen}/>} 

            <View style={{marginTop : topgapforheading  ,display : 'flex' , flexDirection : 'row',justifyContent : 'space-between' , padding  :10}}>
                <View style={{display : 'flex',flexDirection : 'row',justifyContent : 'center',alignItems : 'center'}}>
                <TouchableOpacity style={{ width : 50}} onPress={() =>  navigation.pop()}>
                        
                        
                        <Ionicons name="arrow-back-circle" size={36} color={DEEPPINK} />

                        
                </TouchableOpacity>
                <Customtext type='light' style={{ fontWeight : '700' , fontSize : 16}}>Choose Pincodes</Customtext>
                </View>

                <Customtext type='light' style={{padding : 20 , color : DEEPPINK , fontWeight : '700'}}>Step 4 of 8</Customtext>

            </View>
            <TouchableOpacity onPress={attempuploads}  style = {{padding : 12 , backgroundColor : DEEPPINK , borderRadius : 5 ,marginLeft : '5%', marginTop : 20,marginBottom : 20 , width : '90%'}}><Customtext type='light' style={{fontWeight : '800',color : 'white',textAlign : 'center',fontSize : 18}}>Next</Customtext></TouchableOpacity>


            <View style={{backgroundColor : LIGHTPINK,padding : 20}}>
            <FlatList 
                        extraData={refresh}
                        data = {listcontent}
                        keyExtractor = {onlycitieskey}
                        renderItem={onlycitiesrender}
                        horizontal={true}
                        scrollEnabled={true}
                        contentContainerStyle={{
                            flexGrow: 1,
                            }}
                    />
            </View>
            

            <ScrollView showsVerticalScrollIndicator={false} ref={scrollRef}>


            <View style={{backgroundColor : 'white',padding : 20}}>

           {currentlytappedcity != null && <FlatList 
                        extraData={currentlytappedcity}
                        data = {listcontent.filter(ek => ek.categoryName == currentlytappedcity.categoryName)[0].subCategory}
                        keyExtractor = {onlycitieskey2}
                        renderItem={onlycitiesrender2}
                        horizontal={false}
                        scrollEnabled={true}
                        ref={flatListRef}
                    /> }
            </View>

        {/* <ScrollView showsVerticalScrollIndicator={false} style={{padding : 10,flex : 1,height : '100%'}}>
        <DynamicTabView
        data={tabdata}
        renderTab={renderTab}
        onChangeTab={onChangeTab}
        defaultIndex={0}
        containerStyle={styless.container}
        headerTextStyle={styless.headerText}
        
        headerBackgroundColor={LIGHTPINK}
        headerUnderlayColor={DEEPPINK}
      />
        </ScrollView> */}
                  
           
                    
               

                

                    

            


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
