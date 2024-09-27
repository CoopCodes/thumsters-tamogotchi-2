import { useRef, useState, useContext, Ref, useEffect } from "react";
import Node from "../assets/resources/Monsters/1/Nodenode.svg";

import { BodyPart, theme, OnRemoveType, nodeRangeThreshold, vw, ChangeBodyPart } from "../global";
import { Animated, PanResponder, View, Image, StyleSheet, ViewStyle, StyleProp, Pressable, GestureResponderEvent } from "react-native";
import { MonsterContext } from "../Contexts/MonsterContext";
import { Gesture, GestureDetector, GestureHandlerRootView, GestureStateChangeEvent, HandlerStateChangeEvent, LongPressGestureHandler, LongPressGestureHandlerEventPayload, PanGesture, State, TapGestureHandlerEventPayload, TouchableOpacity } from "react-native-gesture-handler";
import Rive, { Fit, RiveRef } from "rive-react-native";
import { runOnJS } from "react-native-reanimated";
import { ColorContext } from "../Contexts/ColorContext";

interface Props {
  bodypart: BodyPart;
  OnRemove: OnRemoveType;
  OnPressIn: (e: GestureResponderEvent) => void;
  // OnPressIn: (e: GestureStateChangeEvent<TapGestureHandlerEventPayload>) => void;
  panGesture: PanGesture;
}

const ListBodyPart = ({ bodypart, OnPressIn, panGesture }: Props) => {

  let bodyPartReflected: "left" | "right" | "" = (bodypart.category === undefined || ["Eyes", "Mouth", "Head", "Body"].includes(bodypart.category))? "" : !bodypart.reflected ? "right" : "left";

  const ref = useRef<RiveRef>(null);

  const { color } = useContext(ColorContext);
  // style={[
  //   styles.parent,
  //   {
  //     backgroundColor: bodypart.badContrast ? "white" : "transparent",
  //   }
  // ]}
  // onLongPress={(e: GestureResponderEvent) => {
  //   OnPressIn(e)
  // }}
  // onPressOut={onPressOut}

  // onHandlerStateChange={(event) => {
  //   if (event.nativeEvent.state === State.ACTIVE) {
  //     OnPressIn(event);
  //   }
  // }}
  // minDurationMs={300}

  // const tapGesture = Gesture.Tap()
  //   .onEnd((e) => {
  //     runOnJS(OnPressIn)(e)      
  //   })

  // <GestureDetector gesture={tapGesture}>

  return (
    <Pressable
      onPress={(e) => {
        OnPressIn(e);
      }}
    >
      <View
        style={[
          styles.parent,
          {
            backgroundColor: bodypart.badContrast ? "white" : "transparent",
          }
        ]}
      >
        <Rive
          style={
            {
              width: vw(33),
              height: "100%",
              transform: [{ scaleX: bodypart.reflected ? -1 : 1 }],
        
              position: 'relative',
              zIndex: 10,
              overflow: "visible",
              top: 'auto',
              bottom: 0,
              pointerEvents: "none" // DO NOT REMOVE, YOU WILL BE ANNIHILATED
            }
          }
          ref={ref}
          fit={Fit.Contain}
          resourceName="monster_test"
          // resourceName="monster"
          artboardName={bodypart.artboardName}
          onStateChanged={(name: string) => {
            if (ref.current && bodypart.colorInputs.includes(color)) {
              ref.current.setInputState(name, color, true);
              bodypart.stateMachineName = name;
            }
          }}
        
          autoplay={true}
        />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  parent: {
    borderRadius: 20,
    marginRight: 20,
    overflow: "visible",
  },
  image: {
    position: 'relative',
    zIndex: 10,
    overflow: "visible",
    top: 'auto',
    bottom: 0,
    objectFit: 'contain'
  },
});

export default ListBodyPart;
