import { StatusBar } from 'expo-status-bar';
import { styled, css, ThemeProvider } from 'styled-components';
import { useReducer } from 'react';

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

const Attributes = styled.div`
  margin-left: auto;
  margin-right: auto;
  gap: 0%;
  width: 90%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  ${Media}
`

const View = styled.body`
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
  
  const attributesInitial: Attributes {
    "health": 100,
    "hunger": 100,
    "happiness": 100,
    "energy": 100,
  }

  const reducer = (state: any, action: action) => {
      // const updatedAttribute = eval(`${attributesInitial[action.attribute] ${action.operation} ${action.perk}`) 
      console.log(attributesInitial[action.attribute])

      // The above adds/subtracts the initial value of the attribute,
      // to the additor. For example, "100 - 1". This would be run every 
      // so often, to slowly decrease the hunger attribute for example.
      
      if (action.attribute === 'health') {
        // Here we can add checkpoints to change the monsters appearance
        if (action.attribute <= 100 && action.attribute > 60) {
          // Do something
        }
      } // This can continue for all/any other attributes
      
      return updatedAttribute;
    }
  }
  
  const [attributes, attributesDispatch] = useReducer(reducer, attributesInitial)


  return (
    <ThemeProvider theme={theme}>
      <View>
        <Attributes className="attributes">
          <Attribute attrName="health" imagePath='./resources/images/heart.png'  progress={attribute.health}/>
          <Attribute attrName="hunger" imagePath='./resources/images/hunger.svg'  progress={attribute.hunger}/>
          <Attribute attrName="happiness" imagePath={happinessState} progress={attribute.happiness}/>
        </Attributes>
      </View>
    </ThemeProvider>
  );
}
