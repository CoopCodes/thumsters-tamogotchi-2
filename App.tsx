import React, {
  useReducer,
  useEffect,
  useState,
  useCallback,
  createContext,
  useContext,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
} from "react-native";

import HeartIcon from "./assets/resources/images/Heart.svg";
import HungerIcon from "./assets/resources/images/Hunger.svg";
import HappinessIcon from "./assets/resources/images/Happiness.svg";
import energyIcon from "./assets/resources/images/Energy.svg";
import Attribute from "./components/Attribute";
import Bedroom from "./components/Rooms/Bedroom";
import { AttributesContext } from "./Contexts/AttributeContext";
import { MonsterContext, MonsterProvider } from "./Contexts/MonsterContext";
import {
  theme,
  Body,
  BodyPart,
  bodyImage,
  bodySets,
  emptyFunction,
  useLoadFonts,
  Colors,
} from "./global";
import { monsterAction } from "./Contexts/MonsterContext";
import LockerRoom from "./components/Rooms/LockerRoom";
import { NavigationContainer } from "@react-navigation/native";

import { useFonts, loadAsync } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import BottomTabs from "./components/BottomTabs";
import { SafeAreaProvider } from "react-native-safe-area-context";
import ShowAttributesContext from "./Contexts/ShowAttributeContext";
import MoodContext from "./Contexts/MoodContext";
import { Poppins_700Bold, Poppins_900Black } from "@expo-google-fonts/poppins";
import ThumbucksContext, { thumbucksInitial } from "./Contexts/ThumbucksContext";
import AllFoodsContext, { allFoodsInitial } from "./Contexts/AllFoodsContext";
import ColorContext from "./Contexts/ColorContext";

// const breakpoints = {
//   s: 700,
//   xs: 580,
// };

// const devices = {
//   s: `max-width: ${breakpoints.s}px`,
//   xs: `max-width: ${breakpoints.xs}px`,
// };

// const Media = StyleSheet.create({
//   media: {
//     '@media only screen and (max-width: 700px)': {
//       transform: [{ scale: 0.9 }],
//     },
//     '@media only screen and (max-width: 580px)': {
//       transform: [{ scale: 0.6 }],
//     },
//   },
// });



export default function App() {
  // Mood Context
  const [mood, setMood] = useState("");

  useLoadFonts()


  // Attribute Logic
  type attributesAction = {
    attribute: string;
    operation: string;
    perk: number;
  };

  interface Attributes {
    [key: string]: number;
  }

  const attributesInitial: Attributes = {
    health: 100,
    hunger: 80,
    happiness: 100,
    energy: 100,
  };

  let attributeTicks: { [key: string]: number } = {
    hunger: 144000,
    health: 1000,
    energy: 3000
  };

  const attributesReducer = (state: Attributes, action: attributesAction) => {
    const updatedAttribute: number = eval(
      `${state[action.attribute]} ${action.operation} ${action.perk}`
    );

    if (action.attribute === "health") {
      if (state[action.attribute] <= 100 && state[action.attribute] > 60) {
        // Do something
      }
    }
    const attribute = action.attribute;
    return { ...state, [attribute]: updatedAttribute };
  };

  const [attributes, attributesDispatch] = useReducer(
    attributesReducer,
    attributesInitial
  );

  // Makes performance horrible
  // useEffect(() => {
  //   const interval1 = setInterval(() => {
  //     if (attributes.energy > 0) {
  //       attributesDispatch({ attribute: "energy", operation: "-", perk: 1 });
  //     }
  //   }, 1000);

  // //   // Happens every attributeTicks.hunger milliseconds, if hunger is 0, then the health decreases
  // const interval2 = setInterval(() => {
  //     if (attributes.hunger > 0) {
  //       attributesDispatch({ attribute: "hunger", operation: "-", perk: 1 });
  //     } else if (attributes.hunger <= 1) {
  //       // Start health decreasing
  //       attributesDispatch({ attribute: "health", operation: "-", perk: 1 });
  //     }
  //   }, attributeTicks.hunger);
  //   return () => {
  //     clearInterval(interval1);
  //     clearInterval(interval2);
  //   }
  // }, []);

  // Monster Logic TODO: change the way body is accessed

  const [ showAttributesBar, setShowAttributeBar ] = useState(true);
  const [ thumbucks, setThumbucks ] = useState(thumbucksInitial.thumbucks);
  const [ allFoods, setAllFoods ] = useState(allFoodsInitial.allFoods);
  const [ color, setColor ] = useState<Colors>("Blue");
  
  return (
    <ColorContext.Provider value={{color: color, setColor: setColor}}>
      <MonsterProvider>
        <MoodContext.Provider value={{mood, setMood}}>
          <AttributesContext.Provider
            value={{
              attributes: attributes,
              attributesDispatch: attributesDispatch,
            }}
          >
            <ShowAttributesContext.Provider
              value={{
                showAttributesBar: false,
                setShowAttributeBar: setShowAttributeBar,
              }}
            >
              <ThumbucksContext.Provider value={{thumbucks: thumbucks, setThumbucks: setThumbucks}}>
                <AllFoodsContext.Provider value={{allFoods: allFoods, setAllFoods: setAllFoods}}>
                      <View
                        style={[
                          styles.view,
                          { backgroundColor: theme.default.backgroundColor },
                        ]}
                      >
                        {/* If showAttributesBar is true, then show it, else show nothing */}
                        {showAttributesBar ? (
                          <View style={[styles.attributes]}>
                            {/* Render Attribute components here */}
                            <Attribute
                              attrName="health"
                              Image={HeartIcon}
                              progress={attributes.health}
                            />
                            <Attribute
                              attrName="hunger"
                              Image={HungerIcon}
                              progress={attributes.hunger}
                            />
                            <Attribute
                              attrName="happiness"
                              Image={HappinessIcon}
                              progress={attributes.happiness}
                            />
                            <Attribute
                              attrName="energy"
                              Image={energyIcon}
                              progress={attributes.energy}
                            />
                          </View>
                        ) : (
                          <></>
                        )}
                        {/* <NavigationContainer>
                          <Tab.Navigator>
                            <Tab.Screen name="Bedroom" component={Bedroom} />
                            <Tab.Screen name="Home2" component={Bedroom} />
                          </Tab.Navigator>
                        </NavigationContainer> */}
                        {/* <Text style={ styles.text }>Hello</Text> */}
                        {/* <Bedroom></Bedroom> */}
                        {/* <LockerRoom removeAttributesBar={removeAttributesBar}/> */}
                        <SafeAreaProvider
                          style={{ backgroundColor: "black", marginBottom: -105 }}
                        >
                          <BottomTabs></BottomTabs>
                        </SafeAreaProvider>
                      </View>
                </AllFoodsContext.Provider>
              </ThumbucksContext.Provider>
            </ShowAttributesContext.Provider>
          </AttributesContext.Provider>
        </MoodContext.Provider>
      </MonsterProvider>
    </ColorContext.Provider>
  );
}

const styles = StyleSheet.create({
  view: {
    height: Dimensions.get("window").height,
    width: "100%",
    paddingTop: 0,
    fontFamily: theme.default.fontBold,
  },
  text: { fontFamily: "Poppins-ExtraBold", zIndex: 2 },
  attributes: {
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: 10,
    gap: -10,
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    transform: [{ translateY: -5 }],
    height: 110,
    backgroundColor: "#F3F4F6",
    borderBottomWidth: 3,
    borderTopWidth: 0,
    borderColor: "#E5E7EB",
  },
  bottomTabs: {
    position: "relative",
    backgroundColor: "black",
    bottom: 0,
  },
});
