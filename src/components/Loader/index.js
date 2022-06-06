import React from 'react'
import { View, Text, Dimensions } from 'react-native'
import { DEEPPINK } from '../../Constants/Colors';
import Customtext from '../Customtext';



const index = ({visible,uploading}) => {
    const {width,height} = Dimensions.get('screen');


    return (
        <View style={{flex : 1,minHeight : height  ,justifyContent :'center'}}>
           { visible == true && <View style={{backgroundColor : 'white',zIndex : 1050 , width : width , height : height , display : 'flex',justifyContent : 'center', alignItems : 'center'}}>
                <Customtext type='heavy' style={{fontWeight : '800',color : DEEPPINK,fontSize : 22,letterSpacing  :1}}>LOADING</Customtext>
                {
                uploading != undefined && uploading && <Customtext type='light' style={{fontWeight : '800',color : 'black',fontSize : 18,letterSpacing  :1,marginTop : 10,padding : 10}}>Please wait, this might take a while</Customtext>

            }

            </View>
            }
    
            
        </View>
    )
}



export default index


