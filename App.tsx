import React, {
  useReducer,
  useEffect,
  useState,
  useCallback,
  createContext,
  useContext,
  RefObject,
  useRef,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  LogBox,
  AppRegistry,
} from "react-native";

import HeartIcon from "./assets/resources/images/Heart.svg";
import HungerIcon from "./assets/resources/images/Hunger.svg";
import HappinessIcon from "./assets/resources/images/Happiness.svg";
import energyIcon from "./assets/resources/images/Energy.svg";
import Attribute from "./components/Attribute";
import Bedroom from "./components/Rooms/Bedroom";
import { AttributesContext } from "./Contexts/AttributeContext";
import {
  MonsterContext,
  MonsterInfo,
  MonsterProvider,
} from "./Contexts/MonsterContext";
import {
  theme,
  Body,
  BodyPart,
  bodyImage,
  bodySets,
  emptyFunction,
  useLoadFonts,
  Colors,
  stateMachineName,
  IMonsterProp,
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
import ThumbucksContext, {
  thumbucksInitial,
} from "./Contexts/ThumbucksContext";
import AllFoodsContext, { allFoodsInitial } from "./Contexts/AllFoodsContext";
import ColorContext from "./Contexts/ColorContext";
import { expo } from "./app.json";
import { RiveRef } from "rive-react-native";

LogBox.ignoreLogs(["Looks like you're passing an inline function for", "Non-serializable values were found in the navigation state", "Require cycle"]);

AppRegistry.registerComponent(expo.name, () => App);

export default function App() {
  // Mood Context
  const [mood, setMood] = useState("");

  useLoadFonts();

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
    energy: 3000,
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

  const [showAttributesBar, setShowAttributeBar] = useState(true);
  const [thumbucks, setThumbucks] = useState(thumbucksInitial.thumbucks);
  const [allFoods, setAllFoods] = useState(allFoodsInitial.allFoods);
  const [color, setColor] = useState<Colors>("Blue");

  // * Global Monster State * //

  const monsterReducer = (
    state: MonsterInfo,
    action: monsterAction | undefined
  ) => {
    if (action === undefined) return state;
    if (action.bodyParts) state.Body.bodyparts = action.bodyParts;
    if (action.ref) {
      state.RiveRef = action.ref;
    }

    if (action.bodyArtboard) {
      state.Body.bodyArtboard = action.bodyArtboard.newValue;
      state.Body.bodyTransitionInput = action.bodyArtboard.transitionInputName;
      state.Body.bodyColor = action.bodyArtboard.bodyColor;
      
      // Update color
      setColor(action.bodyArtboard?.bodyColor as Colors);
      
      
      setTimeout(() => {
        if (!action.bodyArtboard) return state;
  
        (state.RiveRef as RefObject<RiveRef>).current?.setInputState(
          stateMachineName,
          action.bodyArtboard.transitionInputName,
          true
        );
      })
    }

    if (action.bodyPartToChange) {
      const bodypartToChange = action.bodyPartToChange;

      let i;
      // x would be leftarm, righarm, etc...
      Object.keys(state.Body.bodyparts).map((x: string, index: number) => {
        // Checking if the passed in bodypart to change is on the body
        // if bodypart is the entered bodypart, then will set i to index
        if (x === bodypartToChange?.bodyPartName) i = index;
        // i is the index of the bodypart to change, in the keys of IBodyParts, for example, leftarm would be i=0.
      });

      if (i) {
        // This line is getting the type of the keys of the state.Body.bodyparts object.
        // For example, if the object is { leftarm: BodyPart, rightarm: BodyPart, etc... }
        // Then the type would be 'leftarm' | 'rightarm' | etc...
        type BodyPartNodes = keyof typeof state.Body.bodyparts;

        const bodyPartToChange = bodypartToChange;

        const bodypartnode = bodyPartToChange.bodyPartName as BodyPartNodes;

        console.log(
          "Changing",
          state.Body.bodyparts[bodypartnode]?.artboardName,
          "to",
          bodyPartToChange.newValue.artboardName
        );

        state.Body.bodyparts[bodypartnode] = bodyPartToChange.newValue;

        // This will trigger a re-render, and thus update the Rive animation to be in sync with the new state.

        // Set color on the bodypart as the same as the current body

        const colorInput = bodyPartToChange.newValue.colorInputs.find(
          (c: string) => c === color
        ) as Colors;

        if (bodyPartToChange.newValue.transitionInputName) {
          (state.RiveRef as RefObject<RiveRef>)?.current?.setInputState(
            stateMachineName,
            bodyPartToChange.newValue.transitionInputName,
            true
          );
        }

        // Changing Color
        (state.RiveRef as RefObject<RiveRef>)?.current?.setInputStateAtPath(
          colorInput, // "Blue" for example
          true,
          bodypartToChange.newValue.artboardName // The path to the nested artboard
        );
      }
    }

    if (action.body) state.Body = action.body;

    console.log("uPDATINGGGG");

    return state;
  };

  const MonsterRef = useRef<RiveRef>(null);

  const [monster, monsterDispatch] = useReducer(monsterReducer, {
    Body: bodySets["Harold"].body,
    RiveRef: MonsterRef,
  });

  // * End Global Monster State * //

  return (
    <MoodContext.Provider value={{ mood, setMood }}>
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
          <ColorContext.Provider value={{ color: color, setColor: setColor }}>
            <ThumbucksContext.Provider
              value={{ thumbucks: thumbucks, setThumbucks: setThumbucks }}
            >
              <AllFoodsContext.Provider
                value={{ allFoods: allFoods, setAllFoods: setAllFoods }}
              >
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
                    <BottomTabs
                      monsterProp={{
                        monster: monster,
                        monsterDispatch: monsterDispatch,
                      }}
                    ></BottomTabs>
                  </SafeAreaProvider>
                </View>
              </AllFoodsContext.Provider>
            </ThumbucksContext.Provider>
          </ColorContext.Provider>
        </ShowAttributesContext.Provider>
      </AttributesContext.Provider>
    </MoodContext.Provider>
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
