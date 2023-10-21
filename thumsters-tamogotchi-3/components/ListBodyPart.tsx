import { useRef, useState } from "react";
import { BodyPart } from "../global";
import { Animated, PanResponder, View } from "react-native";

interface Props {
	bodypart: BodyPart,
}

const ListBodyPart = ({ bodypart }: Props) => {
  const pan = useRef(new Animated.ValueXY()).current;
  const [isDragging, setIsDragging] = useState(false);

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
    onPanResponderMove: Animated.event(
        [
          null,
          { dx: pan.x, dy: pan.y }
        ],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: () => {
        setIsDragging(false);
        // Revert the component to its original position
        pan.flattenOffset();
      }
    })
  ).current;

  return (
    <View style={{ flex: 1 }}>
      <Animated.View
        style={[
          {
            transform: [{ translateX: pan.x }, { translateY: pan.y }]
          },
          isDragging && { opacity: 0.8 }
        ]}
        {...panResponder.panHandlers}
      >
        {/* Your component content */}
      </Animated.View>
    </View>
  );
};

export default ListBodyPart;