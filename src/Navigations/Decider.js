import React , {useContext} from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { ActivityIndicator, Text, View } from 'react-native';
import AuthNavigator from './AuthNavigator';
import TabNavigator from './HomeNavigator';





const Decider = (props) => {
    const [authLoaded , setAuthLoaded] = React.useState(true);
    const [isLoggedin , setisLoggedin] = React.useState(false);

    
    return (
        <>
      {
          authLoaded ? (
            <View style={{ width : '100%' , height : '100%'}}>

            
                <NavigationContainer ref={props.navigationRef}>
                    {
                        <AuthNavigator />     
                    }   
                </NavigationContainer> 
        </View>
        ) : <Text style={{marginTop : 60 , textAlign : 'center' , color : 'red'}}>Loading</Text>

      }
      </>
        
        
        
    )
}

export default Decider
