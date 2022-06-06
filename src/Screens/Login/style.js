import { StyleSheet, TextInput } from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { BACKGROUNDCOLOR, DEEPPINK } from "../../Constants/Colors";

export default StyleSheet.create({
    input : {
       borderWidth : 0,
       padding : 10,
       color : BACKGROUNDCOLOR,
       borderColor : BACKGROUNDCOLOR,
       borderRadius : 5,
       flex : 1,
       fontSize : 20,
       textAlign : 'left',
       letterSpacing : 2,
       fontWeight : '600'

   }
});