import React, { useReducer, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import heartIcon from './assets/resources/images/heart.png'2
import hungerIcon from './assets/resources/images/hunger.png'
import happinessIcon from './assets/resources/images/happiness.png'
import energyIcon from './assets/resources/images/energy.png'
import Attribute from './components/Attribute';
import { theme } from './global';

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
  type action = {
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

  
  const reducer = (state: Attributes, action: action) => {
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
    reducer, attributesInitial
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

    return (
      <View style={[styles.view, { backgroundColor: theme.default.backgroundColor }]}>
      <View style={[styles.attributes]}>
        {/* Render Attribute components here */}
        <Attribute attrName="health" image={heartIcon} progress={attributes.health}/>
        <Attribute attrName="hunger" image={hungerIcon} progress={attributes.hunger}/>
        <Attribute attrName="happiness" image={happinessIcon} progress={attributes.happiness}/>
        <Attribute attrName="energy" image={energyIcon} progress={attributes.energy}/>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    height: '100%',
    width: '100%',
  },
  attributes: {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 100,
    gap: -10,
    width: '90%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
});