import React , {useState , useEffect } from 'react'
import { View, Text, TouchableOpacity, Image, TextInput } from 'react-native'
import { DEEPPINK, GREYISH, topgapforheading } from '../../Constants/Colors'
import { Ionicons } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from './style.js';
import * as ImagePicker from 'expo-image-picker';
import * as firebase from 'firebase';
import Loader from '../../components/Loader';
import db from '../../config/firebase';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { CERTIFICATEIMAGESPORTAL, WORKIMAGESPORTAL } from '../../Constants/routesName';
import { MaterialIcons } from '@expo/vector-icons';

import Customtext from '../../components/Customtext';






const index = (props) => {
    const [bankname, onChangeBankname] = React.useState(null);
    const [gstnum, onChangeGstnum] = React.useState("");
    const [accnum, onChangeAccnum] = React.useState(null);
    const [confirmaccnum, onChangeConfirmaccnum] = React.useState(null);
    const [ifsc, onChangeIfsc] = React.useState(null);
    const [accountholdername, onChangeAccountholdername] = React.useState(null);
    const [partnerauthid, setpartnerauthid] = useState("xyz123");
    const [pancard, onChangePancard] = React.useState("");
    

  const [banknameerror, setbanknameerror] = useState(false);
  const [gsterror, setGsterror] = useState(false);
  const [accnumerror, setaccnumerror] = useState(false);
  const [confirmaccnumerror, setconfirmaccnumerror] = useState(false);
  const [ifscerror, setifscerror] = useState(false);
  const [accholdernameerror, setaccholdernameerror] = useState(false);
  const [pancarderror, setpancarderror] = useState(false);


    const [loadingscreen, setloadingscreen] = useState(false);






  
    const [alreadyexistingdata, setalreadyexistingdata] = useState({});

    const [message, setmessage] = useState("");

    const navigation = useNavigation(); 




    useEffect(() => {
        setpartnerauthid(props.route.params.partnerid);
        const userid = props.route.params.partnerid;
        db.collection('partners').doc(userid).get().then(info => {
            console.log(info.data());
            setalreadyexistingdata(info.data());
            onChangeAccnum(info.data().accountnumber);
            onChangeConfirmaccnum(info.data().accountnumber);
            onChangeConfirmaccnum("");
            onChangeIfsc(info.data().ifsc);
            onChangeAccountholdername(info.data().accountholdername);
            onChangeBankname(info.data().bankname);
            onChangeGstnum(info.data().gstnum);
            onChangePancard(info.data().pancard);
     
       
        }).catch(e => {
            console.log("ERR")
        })
    }, [])

    const attempuploads = () => {
        setaccnumerror(false);
        setbanknameerror(false);
        setconfirmaccnumerror(false);
        setifscerror(false);
        setaccholdernameerror(false);
        setpancarderror(false);
       
        if(accnum == null || accnum == "") {
            setmessage("Please Enter your Account Number");
            setaccnumerror(true);
        }
        else if(bankname == null || bankname == "") {
            setmessage("Please Enter your Bank Name");
            setbanknameerror(true);
        }
        else if(confirmaccnum == null || confirmaccnum == "") {
            setmessage("Please confirm your account number");
            setconfirmaccnumerror(true);
        }
        else if(ifsc == null || ifsc == "") {
            setmessage("Please Enter your ifsc");
            setifscerror(true);
        }
        else if(accountholdername == null || accountholdername == "")  {
            setmessage("Please enter account holder name");
            setaccholdernameerror(true);
        }
        else if(accnum !== confirmaccnum) {
            setmessage("Please make sure your account number and confirm account number are exactly same");
            setaccnumerror(true);
        }
        else if(pancard == null || pancard == "")  {
            setmessage("Please enter pancard number");
            setpancarderror(true);
        }
        else {
            lastupload();
        }
    }


   

    const lastupload = () => {
        console.log("GST ");
        console.log(gstnum);
        const userid = partnerauthid;
        setloadingscreen(true);
        db.collection('partners').doc(userid).update({
            accountnumber : accnum,
            ifsc : ifsc,
            accountholdername : accountholdername,
            bankname : bankname,
            gstnum : gstnum == undefined ? "" : gstnum,
            pancard : pancard
        }).then(done => {
            setmessage("Details Uploaded");
            setloadingscreen(false);
            navigation.navigate(CERTIFICATEIMAGESPORTAL , {partnerid : partnerauthid});
        }).catch(ee => {
            console.log(ee);
            setloadingscreen(false);
        })
    }





    return (
        <View>
             {loadingscreen == true && <Loader visible={loadingscreen}/>} 

            <View style={{marginTop : topgapforheading  ,display : 'flex' , flexDirection : 'row',justifyContent : 'space-between' , padding  :10}}>
            <TouchableOpacity style={{ width : 60}} onPress={() =>  navigation.pop()}>
                        
                        
                        <Ionicons name="arrow-back-circle" size={36} color={DEEPPINK} />
                        
                        
                </TouchableOpacity>
                <Customtext type='light' style={{padding : 20 , color : DEEPPINK , fontWeight : '700'}}>Step 6 of 8</Customtext>
            </View>
            
            <Customtext type='light' style={{ padding : 20 , fontWeight : '700' , fontSize : 24}}>{message == "" ? "Join Uzify by filling all the informations" : message } </Customtext>
            <KeyboardAwareScrollView style={{paddingBottom : 100}}>
                <View style={{marginTop : 20,display : 'flex', alignItems : 'center'}}>
                <Customtext type='light' style={{textAlign : 'left',width : '90%',marginTop : 20,fontWeight : '700'}}>Enter Bank name</Customtext>
                    <TextInput
                               style={styles.input}
                               onChangeText={(text) => onChangeBankname(text)}
                               value={bankname}
                               placeholder="Enter Bank Name"
                               placeholderTextColor={GREYISH}    
                    />
                         {banknameerror && <View style={{display : 'flex',flexDirection : 'row',alignItems : 'center',paddingLeft : 8}}>
                        <MaterialIcons name="error" size={20} color="red" />
                        <Customtext type='light' style={{paddingLeft : 8, textAlign : 'left',width : '90%',marginTop : 5,fontWeight : '700',color : DEEPPINK}}>Please Enter your bankname</Customtext>
                    </View>}
                    <Customtext type='light' style={{textAlign : 'left',width : '90%',marginTop : 20,fontWeight : '700'}}>Enter Account Holder name</Customtext>
                    <TextInput
                               style={styles.input}
                               onChangeText={(text) => onChangeAccountholdername(text)}
                               value={accountholdername}
                               placeholder="Enter Account Holder Name"
                               placeholderTextColor={GREYISH}    
                    />
                         {accholdernameerror && <View style={{display : 'flex',flexDirection : 'row',alignItems : 'center',paddingLeft : 8}}>
                        <MaterialIcons name="error" size={20} color="red" />
                        <Customtext type='light' style={{paddingLeft : 8, textAlign : 'left',width : '90%',marginTop : 5,fontWeight : '700',color : DEEPPINK}}>Please Enter account holder name</Customtext>
                    </View>}
                    <Customtext type='light' style={{textAlign : 'left',width : '90%',marginTop : 20,fontWeight : '700'}}>Enter your bank account number</Customtext>
                    <TextInput
                               style={[styles.input]}
                               onChangeText={(text) => onChangeAccnum(text)}
                               value={accnum}
                               placeholder="Enter bank account number"
                               placeholderTextColor={GREYISH}
                               keyboardType="numeric"
                               secureTextEntry={true}
                       
                    />
                         {accnumerror && <View style={{display : 'flex',flexDirection : 'row',alignItems : 'center',paddingLeft : 8}}>
                        <MaterialIcons name="error" size={20} color="red" />
                        <Customtext type='light' style={{paddingLeft : 8, textAlign : 'left',width : '90%',marginTop : 5,fontWeight : '700',color : DEEPPINK}}>Please Enter your account number</Customtext>
                    </View>}
                    <Customtext type='light' style={{textAlign : 'left',width : '90%',marginTop : 20,fontWeight : '700'}}>Re - Enter your bank account number</Customtext>
                    <TextInput
                               style={[styles.input]}
                               onChangeText={(text) => onChangeConfirmaccnum(text)}
                               value={confirmaccnum}
                               placeholder="Re-enter bank account number"
                               placeholderTextColor={GREYISH} 
                               keyboardType="numeric"
                               
                              
                    />
                         {confirmaccnumerror && <View style={{display : 'flex',flexDirection : 'row',alignItems : 'center',paddingLeft : 8}}>
                        <MaterialIcons name="error" size={20} color="red" />
                        <Customtext type='light' style={{paddingLeft : 8, textAlign : 'left',width : '90%',marginTop : 5,fontWeight : '700',color : DEEPPINK}}>Please Re Enter your account number</Customtext>
                    </View>}
                     <Customtext type='light' style={{textAlign : 'left',width : '90%',marginTop : 20,fontWeight : '700'}}>Enter IFSC </Customtext>
                    <TextInput
                               style={[styles.input]}
                               onChangeText={(text) => onChangeIfsc(text)}
                               value={ifsc}
                               placeholder="Enter IFSC"
                               placeholderTextColor={GREYISH}
                               
                    />
                         {ifscerror && <View style={{display : 'flex',flexDirection : 'row',alignItems : 'center',paddingLeft : 8}}>
                        <MaterialIcons name="error" size={20} color="red" />
                        <Customtext type='light' style={{paddingLeft : 8, textAlign : 'left',width : '90%',marginTop : 5,fontWeight : '700',color : DEEPPINK}}>Please Enter your IFSC</Customtext>
                    </View>}
                    <Customtext type='light' style={{textAlign : 'left',width : '90%',marginTop : 20,fontWeight : '700'}}>Enter GST Number(Optional)</Customtext>
                    <TextInput
                               style={styles.input}
                               onChangeText={(text) => onChangeGstnum(text)}
                               value={gstnum}
                               placeholder="Enter GST Number"
                               placeholderTextColor={GREYISH}    
                    />
                    <Customtext type='light' style={{textAlign : 'left',width : '90%',marginTop : 20,fontWeight : '700'}}>Enter Pan Card Number</Customtext>
                    <TextInput
                               style={styles.input}
                               onChangeText={(text) => onChangePancard(text)}
                               value={pancard}
                               placeholder="Enter Pancard Number"
                               placeholderTextColor={GREYISH}    
                    />
                         {pancarderror && <View style={{display : 'flex',flexDirection : 'row',alignItems : 'center',paddingLeft : 8}}>
                        <MaterialIcons name="error" size={20} color="red" />
                        <Customtext type='light' style={{paddingLeft : 8, textAlign : 'left',width : '90%',marginTop : 5,fontWeight : '700',color : DEEPPINK}}>Please Enter your pancard</Customtext>
                    </View>}
                    
                    
                    



                    <TouchableOpacity onPress={attempuploads}  style = {{padding : 12 , backgroundColor : DEEPPINK , borderRadius : 5 , marginTop : 60,marginBottom : 300 , width : '90%'}}><Customtext type='light' style={{fontWeight : '800',color : 'white',textAlign : 'center',fontSize : 18}}>Next</Customtext></TouchableOpacity>


                </View>

            </KeyboardAwareScrollView>
        </View>
    )
}

export default index
