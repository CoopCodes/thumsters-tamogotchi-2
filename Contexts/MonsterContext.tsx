import React, {
  createContext,
  Reducer,
  Ref,
  Dispatch,
  ReactNode,
  useReducer,
  RefObject,
  useContext,
  useEffect,
  useState,
  useRef,
  useMemo
} from "react";
import { Image, View } from "react-native";
import {
  IBodyParts,
  Body,
  emptyBody,
  bodySets,
  bodyImage,
  BodyPart,
  stateMachineName,
  Colors,
  intervalDuration,
} from "../global";
import { SvgProps } from "react-native-svg";
import Rive, { Fit, RiveRef } from "rive-react-native";
import { ColorContext } from "./ColorContext";
import { styles } from "../components/Monster";
import { useIsFocused } from "@react-navigation/native";

export interface MonsterInfo {
  Body: Body;
  RiveRef: Ref<RiveRef> | undefined;
  
}
export type monsterAction = {
  bodyParts?: IBodyParts | undefined;
  bodyPartToChange?: { bodyPartName: string; newValue: BodyPart };
  bodyArtboard?: { newValue: string, transitionInputName: string, bodyColor: string };
  ref?: Ref<RiveRef> | undefined;
  body?: Body | undefined;
};

type monsterInformation = {
  monster: MonsterInfo;
  monsterDispatch: Dispatch<monsterAction | undefined> | undefined;
  monsterUpdated: boolean;
  setMonsterUpdated: Dispatch<React.SetStateAction<boolean>>;
};

const initial: monsterInformation = {
  monster: emptyBody,
  monsterDispatch: undefined,
  monsterUpdated: false,
  setMonsterUpdated: () => {},
};

export const MonsterContext = createContext<monsterInformation>(initial);

interface MonsterContextProps {
  children: ReactNode;
}

export let updatingRiveAnimation = false;

export function setUpdatingAnimation(value: boolean) {
  updatingRiveAnimation = value;
}

export const MonsterProvider = ({ children }: MonsterContextProps) => {
  const { color, setColor } = useContext(ColorContext);

  const [monsterUpdated, setMonsterUpdated] = useState(false);
  // const [updatingRiveAnimation, setUpdatingAnimation] = useState(false);
  
  // useEffect(() => {
  //   console.log("UPDATING ANIMATION", updatingRiveAnimation)
  // }, [updatingRiveAnimation])

  
  const monsterReducer = (state: MonsterInfo, action: monsterAction | undefined) => {
    if (action === undefined) return state;
    if (action.bodyParts) state.Body.bodyparts = action.bodyParts;
    if (action.ref) {
      state.RiveRef = action.ref
    }

    // let intervalId: NodeJS.Timeout;
    
    if (action.bodyArtboard) {
      state.Body.bodyArtboard = action.bodyArtboard.newValue;
      state.Body.bodyTransitionInput = action.bodyArtboard.transitionInputName;
      state.Body.bodyColor = action.bodyArtboard.bodyColor;
      
      let intervalId0 = setInterval(() => {
        console.log("102", updatingRiveAnimation)
        if (updatingRiveAnimation) return;
        
        setUpdatingAnimation(true);
        
        setTimeout(() => {
            if (action.bodyArtboard) {
              (state.RiveRef as RefObject<RiveRef>).current?.setInputState(stateMachineName, action.bodyArtboard.transitionInputName, true);
            }
        }, 400) // Leave time for the animation to finish

        console.log("106", intervalId0)
        clearInterval(intervalId0)
        setUpdatingAnimation(false)
      }, intervalDuration)

      console.log("110", intervalId0)
      
      console.log(" COlor:", action.bodyArtboard?.bodyColor);
      if (setColor)
        setColor(action.bodyArtboard?.bodyColor as Colors);
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
        
        console.log("Changing", state.Body.bodyparts[bodypartnode]?.artboardName, "to", bodyPartToChange.newValue.artboardName);

        state.Body.bodyparts[bodypartnode] = bodyPartToChange.newValue;

        // This will trigger a re-render, and thus update the Rive animation to be in sync with the new state.
        
        // Set color on the bodypart as the same as the current body

        const colorInput = bodyPartToChange.newValue.colorInputs.find((c: string) => c === color) as Colors;

        // CHANGING BODYPARTS IDIOT
        let intervalId2 = setInterval(() => {
          console.log("171", intervalId2)
          if (updatingRiveAnimation || bodyPartToChange.newValue.transitionInputName === undefined) return;

          setUpdatingAnimation(true);

          (state.RiveRef as RefObject<RiveRef>)?.current?.setInputState(
            stateMachineName,
            bodypartToChange.newValue.transitionInputName!, // Checking beforehand if undeinfed
            true,
          );
          
          setTimeout(() => {
            setUpdatingAnimation(false)
            clearInterval(intervalId2);
          }, 500) // Cuz shit cant change at the same time for no reason
        }, intervalDuration)

        // JUST CHANGING COLOR DUMBASS LOOK
        let intervalId3 = setInterval(() => {
          if (updatingRiveAnimation) return;

          setUpdatingAnimation(true);

          (state.RiveRef as RefObject<RiveRef>)?.current?.setInputStateAtPath(
            colorInput,  // "Blue" for example
            true,
            bodypartToChange.newValue.artboardName // The path to the nested artboard
          );
          
          setUpdatingAnimation(false)
          clearInterval(intervalId3);
          console.log("188", intervalId3)
        }, intervalDuration)
      }
    }

    if (action.body) state.Body = action.body;
    
    setMonsterUpdated(true)
    
    return state;
  };

  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  
  const [monster, monsterDispatch] = useReducer(
    monsterReducer, { Body: bodySets["Harold"].body, RiveRef: undefined }
  );


  return (
    <MonsterContext.Provider
      value={{
        monster: monster,
        monsterDispatch: monsterDispatch,
        monsterUpdated: monsterUpdated,
        setMonsterUpdated: setMonsterUpdated,
      }}
    >
      {children}
    </MonsterContext.Provider>
  );
};