import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Image,
  Text,
  ImageSourcePropType,
  StyleSheet,
  Platform,
  TouchableOpacity,
  useWindowDimensions
} from "react-native";
import { MonsterContext, monsterAction } from "../../Contexts/MonsterContext";
import { theme } from "../../global";
import { bodysInfo, Body, bodyImage } from "../../global";
import Monster from "../Monster";
import clothesHanger from "../../assets/resources/images/ClothesHanger.png";
import PrimaryButton from "../Button";

interface Props {}

const Bedroom = ({}: Props) => {
  const { monster, monsterDispatch } = useContext(MonsterContext);
  useEffect(() => {
    if (monsterDispatch) {
      const action: monsterAction = {
        bodyParts: monster?.bodypartnodes,
        bodyImage: bodyImage,
        body: monster,
      };
      monsterDispatch(action);
    }
  }, []);

  // console.log(monster)

  // Create a sample body to test
  // const monsterBodyParts = Object.values(bodyParts[1]); // Gets all the body parts of monster '1'
  // let newBody: Body = new Body(
  //     bodyParts[1],
  //     bodyImage
  // );
  // <Image style={styles.bedroom} source={BedroomImage}></Image>
  // <View style={styles.monster}>
  //             {
  //                 monster
  //                 ? <Monster scaleFactor={.3} monsterBody={monster} mood={""}/>
  //                 : null
  //             }
  //         </View>

  return (
    <View>
      {/* <View style={styles.top}>
        <Text style={styles.title}>Bedroom</Text>
        <View style={styles.monster}>
          {monster ? (
            <Monster scaleFactor={0.3} monsterBody={monster} mood={""} />
          ) : null}
        </View>
        <View style={styles.background}>
          <View style={styles.topLeft}>
            <Image style={styles.leftImage}></Image>
          </View>
          <View style={styles.topRight}>
            <Image style={styles.rightImage}></Image>
          </View>
        </View>
      </View>
      <View style={styles.bottom}>
        <View style={styles.bottomLeft}>
            <PrimaryButton 
              image={clothesHanger}
              width={192}
              height={100}
            />
        </View>
        <View style={styles.bottomRight}>
          <PrimaryButton 
                image={clothesHanger}
                width={192}
                height={100}
              />
        </View>
      </View> */}
    </View>
  );
}; 

const styles = StyleSheet.create({
  monster: {
    height: "100%",
    width: "100%",
    transform: [{ scale: 0.7 }, { translateY: 100 }],
  },
  bedroom: {
    position: "absolute",
    top: -150,
    height: "100%",
    width: "100%",
    zIndex: -1,
  },
});

export default Bedroom;
