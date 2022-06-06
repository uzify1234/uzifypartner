import React,{useState , useEffect} from 'react'
import { View, Text, Image,TouchableOpacity, SafeAreaView } from 'react-native'
import { DEEPPINK, topgapforheading } from '../../Constants/Colors.js';
import styles from './style.js';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Customtext from '../../components/Customtext';
import { LOGIN } from '../../Constants/routesName.js';


const index = (props) => {
    const navigation = useNavigation(); 
    const [partnerauthid, setpartnerauthid] = useState("xyz123");


    useEffect(() => {
        setpartnerauthid(props.route.params.partnerid);
    }, [])

    return (
        <SafeAreaView>
            <View style={{marginTop : topgapforheading , position : 'relative',display : 'flex',flexDirection : 'row',alignItems : 'center'}}>
                {/* <TouchableOpacity style={{ width : 60}} onPress={() =>  navigation.pop(8)}>
                        <View style={{borderRadius : 10 , padding : 10 , zIndex : 1035}}>
                        <Ionicons name="arrow-back-circle" size={36} color={DEEPPINK} style={{zIndex : 1035}} />
                        </View>
                    </TouchableOpacity> */}
            </View>
            <View style={{display  : 'flex',justifyContent : 'center',alignItems : 'center',height : '70%',width : '100%'}}>
                <Image source={require('../../assets/images/orderplaced.png')} style = {{width : '90%' , height : 300 , resizeMode : 'contain'}} />
                <Image source={require('../../assets/images/congratulations.png')} style = {{width : '90%' , height : 60 , resizeMode : 'cover'}} />

                <Customtext type='light' style={{fontWeight : '700',textAlign : 'center' , fontSize : 20 , color : DEEPPINK,marginTop : 20,padding : 15}}>Your Profile is submitted. Wait for the verification before you start accepting leads.</Customtext>
            </View>
            <TouchableOpacity onPress={() => {navigation.navigate(LOGIN)}} style={{backgroundColor : DEEPPINK,padding : 15,width : '60%',marginLeft : '20%',borderRadius  :5}}><Text style={{color : 'white',textAlign : 'center',fontWeight : '700'}}>Back to Login</Text></TouchableOpacity>
        </SafeAreaView>
    )
}

export default index
