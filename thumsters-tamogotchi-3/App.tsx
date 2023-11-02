import React, { useReducer, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ImageSourcePropType, Dimensions } from 'react-native';

import heartIcon from './assets/resources/images/heart.png'
import hungerIcon from './assets/resources/images/hunger.png'
import happinessIcon from './assets/resources/images/happiness.png'
import energyIcon from './assets/resources/images/energy.png'
import Attribute from './components/Attribute';
import Bedroom from './components/Rooms/Bedroom';
import { AttributesContext } from './Contexts/AttributeContext';
import { MonsterContext } from './Contexts/MonsterContext';
import { theme, Body, BodyPart, bodyImage, bodysInfo, bodyPartInfo, IBodyPartNodes } from './global';
import { monsterAction } from "./Contexts/MonsterContext"
import LockerRoom from './components/Rooms/LockerRoom';

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
  }
  
  const attributesReducer = (state: Attributes, action: attributesAction) => {
    const updatedAttribute: number = eval(
      `${state[action.attribute]} ${action.operation} ${action.perk}`
    );
    
    if (action.attribute === 'health') {
      if (state[action.attribute] <= 100 && state[action.attribute] > 60) {
        // Do something
      }
    }
    const attribute = action.attribute;
    return { ...state, [attribute]: updatedAttribute };
  };
  
  const [attributes, attributesDispatch] = useReducer(
    attributesReducer, attributesInitial
  );
    
  useEffect(() => {
    setInterval(() => { 
      if (attributes.hunger > 0) {
        attributesDispatch({ attribute: "hunger", operation: "-", perk: 1 })   
      } else if (attributes.hunger === 0) { // Start health decreasing
        attributesDispatch({ attribute: "health", operation: "-", perk: 1 })   
      }
    }, attributeTicks.hunger);
  }, [])
 
  // Monster Logic TODO: change the way body is accessed

  const monsterReducer = (state: Body, action: monsterAction) => {
    if (action.bodyParts)
      state.bodypartnodes = action.bodyParts;
    state.bodyImage = action.bodyImage;

    if (action.body)
      state = action.body;
    return state;
  }

  // const [monster, monsterDispatch] = useReducer(monsterReducer, new Body({
  //   leftarm: bodysInfo[1].bodyparts.leftarm,
  //   rightarm: bodysInfo[1].bodyparts.rightarm,
  //   leftleg: bodysInfo[1].bodyparts.leftleg,
  //   rightleg: bodysInfo[1].bodyparts.rightleg,
  //   eyes: bodysInfo[1].bodyparts.eyes,
  //   head: undefined,
  //   mouth: bodysInfo[1].bodyparts.mouth,
  // }, bodysInfo[1].body, [757, 1200], {
  //   x: 0,
  //   y: -100,
  //   scale: 1.05,
  // }, bodyImage));

  const [monster, monsterDispatch] = useReducer(monsterReducer, new Body({
    leftarm: bodysInfo[0].bodyparts.leftarm,
    rightarm: bodysInfo[0].bodyparts.rightarm,
    leftleg: bodysInfo[0].bodyparts.leftleg,
    rightleg: bodysInfo[0].bodyparts.rightleg,
    eyes: bodysInfo[0].bodyparts.eyes,
    head: undefined,
    mouth: bodysInfo[0].bodyparts.mouth,
  }, bodysInfo[1].body, [757, 1200], {
    x: 0,
    y: -100,
    scale: 1.05,
  }, "./assets/resources/Monsters/1/Body.svg"));

  return (
    <MonsterContext.Provider value={{
      monster: monster,
      monsterDispatch: monsterDispatch,
    }}>
      <AttributesContext.Provider value={{
        attributes: attributes,
        attributesDispatch: attributesDispatch,
      }}>
      <View style={[styles.view, { backgroundColor: theme.default.backgroundColor }]}>
        <View style={[styles.attributes]}>
          {/* Render Attribute components here */}
          <Attribute attrName="health" image={heartIcon} progress={attributes.health}/>
          <Attribute attrName="hunger" image={hungerIcon} progress={attributes.hunger}/>
          <Attribute attrName="happiness" image={happinessIcon} progress={attributes.happiness}/>
          <Attribute attrName="energy" image={energyIcon} progress={attributes.energy}/>
        </View>
        {/* <LockerRoom/> */}
        <Bedroom/>
      </View>
      </AttributesContext.Provider>
    </MonsterContext.Provider>
  );
}

const styles = StyleSheet.create({
  view: {
    height: Dimensions.get('window').height,
    width: '100%',
    paddingTop: 0,
    // borderColor: "black",
    // borderWidth: 5,
    // gap: -(Dimensions.get('window').height / 6),
  },
  attributes: {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 10,
    gap: -10,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: "center",
    height: 100,
  },
  // room: {
  //   height: '100%',
  //   width: '100%'
  // }
});