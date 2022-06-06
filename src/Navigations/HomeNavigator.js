import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Text, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {LOGIN, REGISTER} from '../Constants/routesName';
import Login from '../Screens/Login';

import { DEEPPINK, GREYISH } from '../Constants/Colors';









const Homenestednavigator = () => {
    const Homenestednavigator = createStackNavigator();
    return (
        
        <Homenestednavigator.Navigator initialRouteName={HOME} screenOptions={{headerShown:false}}>
            <Homenestednavigator.Screen name={HOME} component={Home} ></Homenestednavigator.Screen>
            <Homenestednavigator.Screen name={EACHCATEGORY} component={Eachcategory} ></Homenestednavigator.Screen>   
            
        </Homenestednavigator.Navigator>
    )
}


const TabNavigator = () => {
    const TabStack = createBottomTabNavigator();
    return (
        
        <TabStack.Navigator initialRouteName={HOME} screenOptions={{headerShown:false}} screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
  
              if (route.name === 'Home') {
                return <AntDesign name="home" size={size} color={color} />
              } else if (route.name === 'Settings') {
                return <AntDesign name="setting" size={size} color={color} />
              }
              else if(route.name === 'Rewards') {
                return <MaterialCommunityIcons name="sale" size={size} color={color} />
              }
              else {
                  return <AntDesign name="profile" size={size} color={color} />
              }
  
              // You can return any component that you like here!
            
            },
          })}
          tabBarOptions={{
            activeTintColor: DEEPPINK,
            inactiveTintColor: GREYISH,
          }}>
            <TabStack.Screen name={LOGIN} component={Login} ></TabStack.Screen>
       
        </TabStack.Navigator>
    )
}

export default TabNavigator