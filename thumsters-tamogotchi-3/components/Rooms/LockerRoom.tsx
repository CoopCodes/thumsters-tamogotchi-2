import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Image,
  Text,
  ImageSourcePropType,
  StyleSheet,
  Platform,
  ScrollView,
  Button,
  FlatList,
  Dimensions,
} from "react-native";
import { MonsterContext, monsterAction } from "../../Contexts/MonsterContext";
import {
  BodyPart,
  AllBodyParts,
  bodyPartInfo,
  categories,
  theme,
} from "../../global";
import { bodysInfo, Body, bodyImage } from "../../global";
import Monster from "../Monster";
import BedroomImage from "../../assets/resources/images/Bedroom.png";
import ListBodyPart from "../ListBodyPart";
import { Colors } from "react-native/Libraries/NewAppScreen";

interface Props {}

const LockerRoom = ({}: Props) => {
  
  // Monster Initialization
  const { monster, monsterDispatch } = useContext(MonsterContext);
  useEffect(() => {
    if (monsterDispatch) {
      const action: monsterAction = {
        bodyParts: bodysInfo[0].bodyparts,
        bodyImage: bodyImage,
        body: monster,
        OnNodePress: OnNodePress
      };
      monsterDispatch(action);
    }
  }, []);
  
  interface ListBodyPartType {
    key: string;
    bodyPart: BodyPart;
  }
  
  const [displayBodyParts, setDisplayBodyParts] = useState<ListBodyPartType[]>(
    []
    );
    
    // ListBodyPart functionality:
    const [pressedBodyPart, setPressedBodyPart] = useState<BodyPart>();
    
    function OnNodePress(bodyPart: BodyPart) {
      console.log(bodyPart.category + " node was pressed");
      if (pressedBodyPart != null) {
        const bodyPartNameIndex = Object.values(monster.bodypartnodes).indexOf(bodyPart); // Getting index of bodypart node pressed
        const action: monsterAction = {
          bodyPartToChange: { 
            bodyPartName: Object.keys(monster.bodypartnodes)[bodyPartNameIndex], // Getting the bodypart name
            newValue: { // Setting the bodypart to the selected bodypart
              bodyPart: pressedBodyPart,
              ref: Object.values(monster.bodypartnodes)[bodyPartNameIndex].ref,
             }
          }
        }
        if (monsterDispatch)
          monsterDispatch(action)
      }
    }

    function removeBodyPart(bodyPartToRemove: ListBodyPartType) {
      setDisplayBodyParts(
        displayBodyParts.filter((bodyPart) => bodyPart !== bodyPartToRemove)
        );
        console.log("removed self");
      }
      
      type Categories = (typeof categories)[number];
      
      // Function when conditions are pressed
      const CategoryClick = (category: Categories) => {
        // Clearing the current array
        let newBodyParts: ListBodyPartType[] = [];
        // Getting all bodyparts, given the category,
        // and updating the displayBodyParts array.
        let i = 0;

    AllBodyParts.filter(
      (bodyPartToTest: ListBodyPartType) =>
      bodyPartToTest.bodyPart.category === category
      ).map((bodyPart: ListBodyPartType) => {
        let modBodyPart = bodyPart;
        modBodyPart.key = `${i}`;
        newBodyParts.push(bodyPart);
        i++;
    });
    setDisplayBodyParts(newBodyParts);
    // console.log(displayBodyParts);
  };

  useEffect(() => {
    CategoryClick("Eyes"); // Calling function to actually show the bodyparts

    // rdisplayBodyParts.length);
  }, []);

  return (
    <View style={styles.room}>
      {/* <Image style={styles.bedroom} source={BedroomImage}></Image> */}
      <View style={styles.monsterParent}>
        <View style={styles.monster}>
          {monster ? <Monster monsterBody={monster} mood={""}/> : null}
        </View>
      </View>
      <View style={styles.customizationBar}>
        {/* List of bodyparts */}
        {/* Should turn into component */}
        <FlatList
          style={styles.categoryButtons}
          data={categories}
          horizontal={true}
          renderItem={({ item }) => (
            <View style={styles.categoryButton}>
              {/* Main button */}
              <View style={styles.categoryButtonMain}>
                <Text style={styles.categoryButtonText}>{item}</Text>
              </View>
              {/* Shadow */}
              <View style={styles.categoryButtonShadow}>
                <Text style={[{ color: "transparent" }]}>{item}</Text>
              </View>
            </View>
          )}
        />
        <FlatList
          style={styles.bodyPartList}
          data={displayBodyParts}
          horizontal={true}
          keyExtractor={(item) => item.key}
          contentContainerStyle={{marginRight: 10}}
          renderItem={({ item }) => (
            <ListBodyPart
              bodypart={item.bodyPart}
              OnRemove={() => removeBodyPart(item)}
              OnPress={setPressedBodyPart}
            />
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  room: {
    height: "104%",
    width: "100%",
    zIndex: -1,
    backgroundColor: theme.default.backgroundColor,
    flex: 1,
    gap: -100,
    justifyContent: "flex-start",
  },
  monster: {
    // marginTop: -180,
    transform: [{ scale: 0.68 }, { translateY: -100 }],
  },
  monsterParent: {
    width: "100%",
    height: Dimensions.get("window").height * .68,
  },
  customizationBar: {
    flex: 1,
    flexDirection: "column",
    width: "100%",
    height: 5000,
    gap: 0,
    backgroundColor: theme.default.customizationBar,
    paddingTop: 10,
  },
  categoryButtons: {
    marginLeft: 10,
    width: "100%",
    height: "300%",
  },
  categoryButton: {
    marginRight: 10,
  },
  categoryButtonMain: {
    zIndex: 2,
    backgroundColor: theme.default.interactionPrimary,
    borderRadius: 100,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  categoryButtonText: {
    color: "white",
  },
  categoryButtonShadow: {
    position: "absolute",
    zIndex: 1,
    backgroundColor: theme.default.interactionShadow,
    borderRadius: 100,
    paddingHorizontal: 10,
    paddingVertical: 3,
    transform: [{ translateX: 2 }, { translateY: 2 }],
  },
  bodyPartList: {
    marginLeft: 10,
    position: "relative",
    // borderColor: "black",
    // borderWidth: 5,
    width: "100%",
    height: 1000,
  },
});

export default LockerRoom;
