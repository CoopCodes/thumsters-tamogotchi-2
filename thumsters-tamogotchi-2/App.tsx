import { StatusBar } from 'expo-status-bar';
import { styled, css, ThemeProvider } from 'styled-components/native';
import { useReducer } from 'react';
import heartIcon from './assets/resources/images/heart.png'
import hungerIcon from './assets/resources/images/hunger.svg'
import happinessIcon from './assets/resources/images/happiness.svg'
import energyIcon from './assets/resources/images/energy.svg'
import Attribute from './components/Attribute';

const theme = {
  default: {
    backgroundColor: '#8053FF',
    interactionPrimary: '#9F53FF',
    interactionShadow: '#713BB2',
    health: '#FF4848',
    hunger: '#F3AD61',
    happiness: '#02D9A0',
  }
}

export const breakpoints = {
  's': 700,
  'xs': 580,
}

export const devices = {
  's': `max-width: ${breakpoints.s}px`,
  'xs': `max-width: ${breakpoints.xs}px`,
}

// Styled Components:

const Media = css`
  @media only screen and (${devices.s}) {
    scale: 0.9;
  }
  @media only screen and (${devices.xs}) {
    scale: 0.6;
  }
`

const Attributes = styled.View`
  margin-left: auto;
  margin-right: auto;
  gap: 0%;
  width: 90%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  ${Media}
`

const View = styled.View`
  background-color: ${(props) => (props.theme.default.backgroundColor)};
  height: 100vh;
  width: 100vw;
`

export default function App() {
  type action = {
    attribute: string,
    operation: string,
    perk: number,
  }

  interface Attributes {
    [key: string]: number
  }
  
  const attributesInitial: Attributes = {
    "health": 100,
    "hunger": 100,
    "happiness": 100,
    "energy": 100,
  }

  const reducer = (state: Attributes, action: action) => {
    const updatedAttribute: number = eval(`${state[action.attribute]} ${action.operation} ${action.perk}`); 
    console.log(state[action.attribute]);
    
    // The above adds/subtracts the initial value of the attribute,
    // to the additor. For example, "100 - 1". This would be run every 
    // so often, to slowly decrease the hunger attribute for example.
    
    if (action.attribute === 'health') {
      // Here we can add checkpoints to change the monsters appearance
      if (state[action.attribute] <= 100 && state[action.attribute] > 60) {
          // Do something
        }
      } // This can continue for all/any other attributes
      
      const attribute = action.attribute;
      return { ...state, [attribute]: updatedAttribute }; 
      // Changes the 'attributes' to itself, but the wanted attribute is changed.
  }
  
  const [attributes, attributesDispatch] = useReducer(reducer, attributesInitial);
  
  return (
    <ThemeProvider theme={theme}>
      <View>
        <Attributes>
          <Attribute attrName="health" image={heartIcon} progress={attributes.health}/>
          <Attribute attrName="hunger" image={hungerIcon} progress={attributes.hunger}/>
          <Attribute attrName="happiness" image={happinessIcon} progress={attributes.happiness}/>
          <Attribute attrName="energy" image={energyIcon} progress={attributes.energy}/>
        </Attributes>
      </View>
    </ThemeProvider>
  );
}
