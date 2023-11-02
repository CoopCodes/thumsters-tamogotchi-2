import { useRef, useState, useContext } from "react";
import { BodyPart, theme, OnRemoveType, nodeRangeThreshold } from "../global";
import { Animated, PanResponder, View, Image, StyleSheet } from "react-native";
import { MonsterContext } from "../Contexts/MonsterContext";
import DraggableView from "react-native-draggable-reanimated";

// import Animated, {
//   useAnimatedStyle,
//   useAnimatedGestureHandler,
//   withSpring,
//   useSharedValue,
// } from "react-native-reanimated";

import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from "react-native-gesture-handler";

interface Props {
  bodypart: BodyPart;
  OnRemove: OnRemoveType;
}

const ListBodyPart = ({ bodypart }: Props) => {
  // const pan = useRef(new Animated.ValueXY()).current;
  const [isDragging, setIsDragging] = useState(false);
  const [withinNode, setWithinNode] = useState(false);
  const { monster, monsterDispatch } = useContext(MonsterContext);

  // ***** Pan Responder implementation: ***** //
  // const panResponder = useRef(
  //   PanResponder.create({
  //     onStartShouldSetPanResponder: () => true,
  //     onPanResponderGrant: () => {
  //       setIsDragging(true);
  //       // Set the initial position of the
  //       // component to the finger position

  //       pan.setValue({ x: bodypart.node[0], y: bodypart.node[1] });
  //       // The above line positions the
  //       // bodypart at the nodes position, under the finger.

  //       // Logic for detecting if it is close
  //       // to another node, thus connecting it to the body:
  //     },
  //     onPanResponderMove: (e, gs) => {
  //       // Move event and gesture object from panResponder
  //       Animated.event([null, { dx: pan.x, dy: pan.y }], {
  //         useNativeDriver: false,
  //       })(e, gs); // Pass event and gesture object to Animated.event function

  //       // Check if position is within any node
  //       let currentValue: { x: number; y: number } = {} as any;

  //       // pan.addListener((value: { x: number; y: number }) => {
  //       // });

  //       currentValue = {
  //         x: Math.round(gs.moveX),
  //         y: Math.round(gs.moveY)
  //       };

  //       if (monster !== undefined)
  //         Object.values(monster.bodypartnodesRelToVP).filter(value => value !== undefined).map(
  //           (node: Array<number>) => {
  //             if (
  //               currentValue.x >= node[0] - nodeRangeThreshold &&
  //               currentValue.x >= node[0] + nodeRangeThreshold &&
  //               currentValue.y >= node[1] - nodeRangeThreshold &&
  //               currentValue.y >= node[1] + nodeRangeThreshold
  //             ) {
  //               // Within `nodeRangeThreshold` of a node
  //               setWithinNode(true);
  //             } else {
  //               setWithinNode(false);
  //             }
  //           }
  //         );
  //     },
  //     onPanResponderRelease: () => {
  //       // setIsDragging(false);
  //       if (!withinNode) {
  //         Animated.spring(
  //           pan, // Auto-multiplexed
  //           {toValue: {x: 0, y: 0}, useNativeDriver: true}, // Back to zero
  //         ).start();
  //       }
  //       pan.flattenOffset();
  //     },
  //   })
  // ).current;

  // return (
  //   <View style={styles.parent}>
  //     <View style={styles.main}>
  //       <Animated.View
  //         style={[
  //           [
  //             {
  //               transform: [{ translateX: pan.x }, { translateY: pan.y }],
  //             },
  //             isDragging && { opacity: 1 },
  //           ],
  //         ]}
  //         {...panResponder.panHandlers}
  //       >
  //         <Image style={[{
  //           width: `${100 * bodypart.aspectRatio[0]}%`,
  //           height: `${100 * bodypart.aspectRatio[1]}%`
  //           }, styles.image]} source={bodypart.image} />
  //       </Animated.View>
  //     </View>
  //     <View style={styles.shadow} />
  //   </View>
  // );

  // ***** React native reanimated implementation: ***** //
  return (
    <DraggableView>
      <Image
        style={[
          {
            width: `${100 * bodypart.aspectRatio[0]}%`,
            height: `${100 * bodypart.aspectRatio[1]}%`,
          },
          styles.image,
        ]}
        source={bodypart.image}
      />
    </DraggableView>
  );

  // const onGestureEvent = useAnimatedGestureHandler<
  //   PanGestureHandlerGestureEvent,
  //   { x: number; y: number }
  // >({
  //   onStart: (_, ctx) => {
  //     // On gesture begin
  //     console.log(ctx.x, " ", ctx.y)
  //   },
  //   onEnd: ({ velocityX, velocityY }) => {
  //     // Exit gesture
  //   },
  // });

  // return (
  //   <View style={styles.parent}>
  //     <View style={styles.main}>
  //     <Animated.View>
  //       <PanGestureHandler onGestureEvent={onGestureEvent}>
  //         <Animated.View style={StyleSheet.absoluteFill}>
  //           <Image
  //             style={[
  //               {
  //                 width: `${100 * bodypart.aspectRatio[0]}%`,
  //                 height: `${100 * bodypart.aspectRatio[1]}%`,
  //               },
  //               styles.image,
  //             ]}
  //             source={bodypart.image}
  //           />

  //         </Animated.View>
  //       </PanGestureHandler>
  //     </Animated.View>
  //     </View>
  //     <View style={styles.shadow} />
  //   </View>
  // );
  // const translateX = useSharedValue(0);
  // const translateY = useSharedValue(0);

  // const onGestureEvent = useAnimatedGestureHandler<
  //   PanGestureHandlerGestureEvent,
  //   { x: number, y: number }
  // >({
  //   onStart: (_, ctx) => {
  //     ctx.x = translateX.value;
  //     ctx.y = translateY.value;
  //   },
  //   onActive: (event, ctx) => {
  //     translateX.value = ctx.x + event.translationX;
  //     translateY.value = ctx.y + event.translationY;
  //   },
  //   onEnd: () => {
  //     // Call your function here
  //     console.log("Panning ended");
  //   },
  // });

  // return (
  //   <View style={styles.parent}>
  //     <View style={styles.main}>
  //       <PanGestureHandler onGestureEvent={onGestureEvent}>
  //         <Animated.View
  //           style={[
  //             {
  //               transform: [
  //                 { translateX: translateX.value },
  //                 { translateY: translateY.value },
  //               ],
  //             },
  //           ]}
  //         >
  //           <Image
  //             style={[
  //               {
  //                 width: `${100 * bodypart.aspectRatio[0]}%`,
  //                 height: `${100 * bodypart.aspectRatio[1]}%`,
  //               },
  //               styles.image,
  //             ]}
  //             source={bodypart.image}
  //           />
  //         </Animated.View>
  //       </PanGestureHandler>
  //     </View>
  //     <View style={styles.shadow} />
  //   </View>
  // );
};

const styles = StyleSheet.create({
  parent: {
    height: 105,
    width: 105,
    marginRight: 10,
    zIndex: 10,
    overflow: "visible",
  },
  main: {
    position: "relative",
    zIndex: 9,
    backgroundColor: theme.default.interactionPrimary,
    borderRadius: 20,
    overflow: "visible",
  },
  shadow: {
    position: "absolute",
    height: "100%",
    width: "100%",
    backgroundColor: theme.default.interactionShadow,
    borderRadius: 20,
    transform: [{ translateX: 5 }, { translateY: 5 }],
    overflow: "visible",
  },
  image: {
    // position: 'absolute',

    transform: [{ scale: 0.8 }],
    zIndex: 10,
    overflow: "visible",
  },
});

export default ListBodyPart;
