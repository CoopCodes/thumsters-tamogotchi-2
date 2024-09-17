import { createMaterialBottomTabNavigator } from "react-native-paper/react-navigation";
import BedroomIcon from "../assets/resources/images/BedroomIcon.svg";

import { Image, View, StyleSheet } from "react-native";

import Bedroom from "./Rooms/Bedroom";
import { NavigationContainer } from "@react-navigation/native";
import { IMonsterProp, theme } from "../global";
import LockerRoom from "./Rooms/LockerRoom";
import HomeStackScreen from "./Navigators/HomeStackScreen";
import Bathroom from "./Rooms/Bathroom";
import Kitchen from "./Rooms/Kitchen";

const Tab = createMaterialBottomTabNavigator();

interface Props {
  monsterProp: IMonsterProp;
}

function BottomTabs({ monsterProp }: Props) {
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
          component={() => <HomeStackScreen monsterProp={monsterProp}/>}
          options={{
            tabBarIcon: () => (
              <View style={styles.tabIcon}>
                <BedroomIcon
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                />
              </View>
            ),
          }}
        />
        <Tab.Screen
          name="Bathroom"
          component={Bathroom}
          initialParams={{ monsterProp: monsterProp }}
          options={{
            tabBarIcon: () => (
              <View style={styles.tabIcon}>
                <BedroomIcon
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                />
              </View>
            ),
          }}
        />
        <Tab.Screen
          name="Kitchen"
          component={() => <Kitchen monsterProp={monsterProp}/>}
          initialParams={{ monsterProp: monsterProp }}
          options={{
            tabBarIcon: () => (
              <View style={styles.tabIcon}>
                <BedroomIcon
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                />
              </View>
            ),
          }}
        />
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
