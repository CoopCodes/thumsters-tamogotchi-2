import { createMaterialBottomTabNavigator } from "react-native-paper/react-navigation";
import bedroomIcon from "../assets/resources/images/BedroomIcon.png";

import { Image, View, StyleSheet } from "react-native";

import Bedroom from "./Rooms/Bedroom";
import { NavigationContainer } from "@react-navigation/native";
import { theme } from "../global";
import LockerRoom from "./Rooms/LockerRoom";
import HomeStackScreen from "./Navigators/HomeStackScreen";

const Tab = createMaterialBottomTabNavigator();


function BottomTabs() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        style={styles.bar}
        initialRouteName="Bedroom"
        activeColor={theme.default.interactionPrimary}
        barStyle={{
          backgroundColor: "white",
          position: "absolute",
          // bottom: -90,
          zIndex: 2,
        }}
      >
        <Tab.Screen
          name="Bedroom"
          component={HomeStackScreen}
          options={{
            tabBarIcon: () => (
              <View style={styles.tabIcon}>
                <Image
                  source={bedroomIcon}  
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              </View>
            ),
          }}
        />
        {/* <Tab.Screen
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
  bar: {
    position: "absolute",
    bottom: 50,
    top: 0,
    left: 0,
    right: 0,
    zIndex: 2,
  },
  tabIcon: {
    width: "100%",
    zIndex: 2,
    overflow: "visible",
  },
});

export default BottomTabs;
