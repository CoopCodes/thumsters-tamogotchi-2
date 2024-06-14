import React, { useContext, useEffect } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
} from "react-native";
import { MonsterContext, monsterAction } from "../../Contexts/MonsterContext";
import { bodySets, bodyImage } from "../../global";
import Monster from "../Monster";

// Import images
import clothesHanger from "../../assets/resources/images/ClothesHanger.png"
import { useLoadFonts } from "../../global";



function RoomTemplate() {
  const { monster, monsterDispatch } = useContext(MonsterContext);
  useEffect(() => {
    if (monsterDispatch) {
      const action: monsterAction = {
        bodyParts: bodySets[1].bodyparts,
        bodyImage: bodyImage,
        body: monster,
      };
      monsterDispatch(action);
    }
  }, []);

  const fontInfo = useLoadFonts();
  if (!fontInfo?.fontsLoaded) {
    return null;
  }

  return (
    <View>
      {/* If you want to add the Monster: */}
      <View style={styles.monster}>
          {monster ? (
            <Monster scaleFactor={0.3} monsterBody={monster} mood={""} />
          ) : null}
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  monster: {
    transform: [{ scale: 0.7 }, { translateY: -43 }],
    zIndex: 2,
    marginTop: "auto",
    height: Dimensions.get("window").height * 0.35,
    resizeMode: "contain", // change as needed
  },
});

export default RoomTemplate