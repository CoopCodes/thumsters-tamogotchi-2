import { useRef, useState, useContext } from "react";
import { BodyPart, theme, OnRemoveType, nodeRangeThreshold } from "../global";
import { Animated, PanResponder, View, Image, StyleSheet } from "react-native";
import { MonsterContext } from "../Contexts/MonsterContext";

interface Props {
  bodypart: BodyPart;
  OnRemove: OnRemoveType;
}

const ListBodyPart = ({ bodypart }: Props) => {
  const pan = useRef(new Animated.ValueXY()).current;
  const [isDragging, setIsDragging] = useState(false);
  const [withinNode, setWithinNode] = useState(false);
  const { monster, monsterDispatch } = useContext(MonsterContext);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        setIsDragging(true);
        // Set the initial position of the
        // component to the finger position

        pan.setValue({ x: bodypart.node[0], y: bodypart.node[1] });
        // The above line positions the
        // bodypart at the nodes position, under the finger.

        // Logic for detecting if it is close
        // to another node, thus connecting it to the body:
      },
      onPanResponderMove: (e, gestureState) => {
        // Move event and gesture object from panResponder
        Animated.event([null, { dx: pan.x, dy: pan.y }], {
          useNativeDriver: false,
        })(e, gestureState); // Pass event and gesture object to Animated.event function

        // Check if position is within any node
        let currentValue: { x: number; y: number } = {} as any;

        pan.addListener((value: { x: number; y: number }) => {
          currentValue = value;
        });

        console.log(
          `Current position - X: ${currentValue.x}, Y: ${currentValue.y}`
        );
        if (monster !== undefined)
          Object.values(monster.bodypartnodesRelToVP).filter(value => value !== undefined).map(
            (node: Array<number>) => {
              // for (let nx = -nodeRangeThreshold; nx <= 2*nodeRangeThreshold; nx++) { // All x values within threshold
              //   for (let ny = -nodeRangeThreshold; ny <= 2*nodeRangeThreshold; ny++) { // All y values within threshold
              //     if (pan.x === nx && pan.y === ny) {

              //     }
              //   }
              // }
              if (
                currentValue.x >= node[0] - nodeRangeThreshold &&
                currentValue.x >= node[0] + nodeRangeThreshold &&
                currentValue.y >= node[1] - nodeRangeThreshold &&
                currentValue.y >= node[1] + nodeRangeThreshold
              ) {
                // Within `nodeRangeThreshold` of a node
                setWithinNode(true);
              } else {
                setWithinNode(false);
              }
            }
          );
      },
      onPanResponderRelease: () => {
        setIsDragging(false);
        if (!withinNode) {
          Animated.spring(
            pan, // Auto-multiplexed
            {toValue: {x: 0, y: 0}, useNativeDriver: true}, // Back to zero
          ).start();
        }
        pan.flattenOffset();
      },
    })
  ).current;

  return (
    <View style={styles.parent}>
      <View style={styles.main}>
        <Animated.View
          style={[
            [
              {
                transform: [{ translateX: pan.x }, { translateY: pan.y }],
              },
              isDragging && { opacity: 0.8 },
            ],
          ]}
          {...panResponder.panHandlers}
        >
          <Image style={[{ 
            width: `${100 * bodypart.aspectRatio[0]}%`, 
            height: `${100 * bodypart.aspectRatio[1]}%`
            }, styles.image]} source={bodypart.image} />
        </Animated.View>
      </View>
      <View style={styles.shadow} />
    </View>
  );
};

const styles = StyleSheet.create({
  parent: {
    height: 105,
    width: 105,
    marginRight: 10,
    overflow: "visible"
  },
  main: {
    zIndex: 100,
    backgroundColor: theme.default.interactionPrimary,
    borderRadius: 20,
  },
  shadow: {
    position: "absolute",
    height: "100%",
    width: "100%",
    backgroundColor: theme.default.interactionShadow,
    borderRadius: 20,
    transform: [{ translateX: 5 }, { translateY: 5 }],
  },
  image: {
    transform: [{ scale: 0.8 }],
    zIndex: 10,
  },
});

export default ListBodyPart;
