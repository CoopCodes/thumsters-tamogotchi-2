import React, { useReducer, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageSourcePropType,
  Dimensions,
} from "react-native";

import heartIcon from "./assets/resources/images/heart.png";
import hungerIcon from "./assets/resources/images/hunger.png";
import happinessIcon from "./assets/resources/images/happiness.png";
import energyIcon from "./assets/resources/images/energy.png";
import Attribute from "./components/Attribute";
import Bedroom from "./components/Rooms/Bedroom";
import { AttributesContext } from "./Contexts/AttributeContext";
import { MonsterContext, MonsterProvider } from "./Contexts/MonsterContext";
import {
  theme,
  Body,
  BodyPart,
  bodyImage,
  bodysInfo,
  bodyPartInfo,
  IBodyPartNodes,
  emptyFunction,
} from "./global";
import { monsterAction } from "./Contexts/MonsterContext";
import LockerRoom from "./components/Rooms/LockerRoom";

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
    hunger: 100,
    happiness: 100,
    energy: 100,
  };

  let attributeTicks: { [key: string]: number } = {
    hunger: 1000,
    health: 1000,
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

  useEffect(() => {
    setInterval(() => {
      if (attributes.hunger > 0) {
        attributesDispatch({ attribute: "hunger", operation: "-", perk: 1 });
      } else if (attributes.hunger === 0) {
        // Start health decreasing
        attributesDispatch({ attribute: "health", operation: "-", perk: 1 });
      }
    }, attributeTicks.hunger);
  }, []);

  // Monster Logic TODO: change the way body is accessed

  

  const [showAttributesBar, setShowAttributeBar] = useState(true);

  const removeAttributesBar: emptyFunction = () => {
    setShowAttributeBar(false);
  };

  return (
    <MonsterProvider>
      <AttributesContext.Provider
        value={{
          attributes: attributes,
          attributesDispatch: attributesDispatch,
        }}
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
                image={heartIcon}
                progress={attributes.health}
              />
              <Attribute
                attrName="hunger"
                image={hungerIcon}
                progress={attributes.hunger}
              />
              <Attribute
                attrName="happiness"
                image={happinessIcon}
                progress={attributes.happiness}
              />
              <Attribute
                attrName="energy"
                image={energyIcon}
                progress={attributes.energy}
              />
            </View>
          ) : (
            <></>
          )}
          {/* <Bedroom /> */}
          <LockerRoom removeAttributesBar={removeAttributesBar} />
        </View>
      </AttributesContext.Provider>
    </MonsterProvider>
  );
}

const styles = StyleSheet.create({
  view: {
    height: Dimensions.get("window").height,
    width: "100%",
    paddingTop: 0,
    fontFamily: theme.default.fontBold,
  },
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
    height: 100,
  },
  // room: {
  //   height: '100%',
  //   width: '100%'
  // }
});
