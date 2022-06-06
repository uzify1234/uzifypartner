
import { StyleSheet, TextInput } from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { BACKGROUNDCOLOR, DEEPPINK } from "../../Constants/Colors";

export default StyleSheet.create({
    input : {
       borderWidth : 1,
       padding : 10,
       color : DEEPPINK,
       borderColor : DEEPPINK,
       borderRadius : 5,
       textAlign : 'left',
       letterSpacing : 2,
       fontWeight : '600',
       
       paddingHorizontal : 20,
       fontSize : 16

   }
});