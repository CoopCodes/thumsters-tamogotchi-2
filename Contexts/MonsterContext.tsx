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
  useMemo,
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
  overlayRef?: Ref<RiveRef> | undefined;
  bodyParts?: IBodyParts | undefined;
  bodyPartToChange?: { bodyPartName: string; newValue: BodyPart };
  bodyArtboard?: {
    newValue: string;
    transitionInputName: string;
    bodyColor: string;
  };
  ref?: Ref<RiveRef> | undefined;
  body?: Body | undefined;
};

type monsterInformation = {
  monster: MonsterInfo;
  monsterDispatch: Dispatch<monsterAction | undefined> | undefined;
};

const initial: monsterInformation = {
  monster: emptyBody,
  monsterDispatch: undefined,
};

export const MonsterContext = createContext<monsterInformation>(initial);

interface MonsterContextProps {
  children: ReactNode;
}

export const MonsterProvider = ({ children }: MonsterContextProps) => {
  const { color, setColor } = useContext(ColorContext);

  const monsterReducer = (
    state: MonsterInfo,
    action: monsterAction | undefined
  ) => {
    if (action === undefined) return state;
    if (action.bodyParts) state.Body.bodyparts = action.bodyParts;
    if (action.ref) {
      state.RiveRef = action.ref;
    }

    let OverlayRef = undefined;
    if (action.overlayRef) {
      OverlayRef = (action.overlayRef as RefObject<RiveRef>)
    }

    if (action.bodyArtboard) {
      state.Body.bodyArtboard = action.bodyArtboard.newValue;
      state.Body.bodyTransitionInput = action.bodyArtboard.transitionInputName;
      state.Body.bodyColor = action.bodyArtboard.bodyColor;

      if (action.bodyArtboard) {
        if (OverlayRef) {
          OverlayRef.current?.setInputState(stateMachineName, action.bodyArtboard.bodyColor, true);
          OverlayRef.current?.setInputState(stateMachineName, "Slide Up", true);
        }
        
        setTimeout(() => {
          // Changing Body
          if (action.bodyArtboard)
            (state.RiveRef as RefObject<RiveRef>).current?.setInputState(
              stateMachineName,
              action.bodyArtboard.transitionInputName,
              true
            )
            
            if (setColor) setColor(action.bodyArtboard?.bodyColor as Colors);
        }) // To get overlay to play at the same time

      }

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

        // CHANGING BODYPARTS IDIOT
        if (bodyPartToChange.newValue.transitionInputName === undefined)
          return state;

        // if (OverlayRef) {
        //   OverlayRef.current?.setInputState(stateMachineName, "Slide Up", true);
        // }
        
        setTimeout(() => {
          (state.RiveRef as RefObject<RiveRef>)?.current?.setInputState(
            stateMachineName,
            bodypartToChange.newValue.transitionInputName!, // Checking beforehand if undeinfed
            true
          );
  
          // JUST CHANGING COLOR DUMBASS LOOK
          (state.RiveRef as RefObject<RiveRef>)?.current?.setInputStateAtPath(
            colorInput, // "Blue" for example
            true,
            bodypartToChange.newValue.artboardName // The path to the nested artboard
          );
        })
      }
    }

    if (action.body) state.Body = action.body;

    return state;
  };

  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  const [monster, monsterDispatch] = useReducer(monsterReducer, {
    Body: bodySets["Harold"].body,
    RiveRef: undefined,
  });

  return (
    <MonsterContext.Provider
      value={{
        monster: monster,
        monsterDispatch: monsterDispatch,
      }}
    >
      {children}
    </MonsterContext.Provider>
  );
};
