import { createMaterialBottomTabNavigator } from 'react-native-paper/react-navigation';
import bedroomIcon from '../assets/resources/images/BedroomIcon.png';

import { Image, View, StyleSheet } from "react-native"

import Bedroom from './Rooms/Bedroom';
import { NavigationContainer } from '@react-navigation/native';
import { theme } from '../global';
import { HomeStack } from './Rooms/Bedroom';

const Tab = createMaterialBottomTabNavigator();

interface Props {
  removeAttributesBar: () => void
}

function BottomTabs({ removeAttributesBar }: Props) {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Bedroom"
        activeColor={theme.default.interactionPrimary}
        barStyle={{ 
          backgroundColor: 'white', 
          position: "absolute", 
          // bottom: -90, 
          zIndex: 2,
        }}
      >
        <HomeStack.Navigator initialRouteName='Bedroom' screenOptions={{
          headerShown: false
        }}>
          <HomeStack.Screen name="Bedroom"
            component={Bedroom}
            initialParams={{
              removeAttributesBar: removeAttributesBar
              
            }}
          />
          <HomeStack.Screen
            name="Locker Room"
            component={Bedroom}
          />
        </HomeStack.Navigator>
        {/* <Tab.Screen
          name="Bedroom"
          component={Bedroom}
          options={{
            tabBarIcon: () => (
              <View style={styles.tabIcon}>
                <Image source={bedroomIcon} style={{ width: "100%", height: "100%",objectFit: "contain" }}/>
              </View>
            ),
          }} initialParams={{
            removeAttributesBar: removeAttributesBar
          }}
        />
          <Tab.Screen
          name="Locker Room"
          component={Bedroom}
          options={{
            tabBarIcon: () => (
              <View style={styles.tabIcon}>
                <Image source={bedroomIcon} style={{ width: "100%", height: "100%",objectFit: "contain" }}/>
              </View>
            ),
            
          }}
        /> */}
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabIcon: {
    width: "100%",
    zIndex: 2,
    overflow: "visible"
  }
})

export default BottomTabs