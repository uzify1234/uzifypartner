import React from 'react'
import { View, Text, Dimensions } from 'react-native'
import { DEEPPINK , LIGHTPINK , GREYISH} from '../../Constants/Colors';


const index = (props) => {
    const {width,height} = Dimensions.get('screen');
    const style = [props.style || {},{fontFamily : props.type != undefined && props.type == 'heavy' ? 'Rubik-ExtraBold' : 'Rubik-Medium'}];
    const allprops = Object.assign({},props,{style : style});

    return (
        <Text {...allprops}>
           {props.children}
        </Text>
    )
}



export default index