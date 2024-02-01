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
  emptyFunction,
} from "../../global";
import { bodysInfo, Body, bodyImage } from "../../global";
import Monster from "../Monster";
import BedroomImage from "../../assets/resources/images/Bedroom.png";
import ListBodyPart from "../ListBodyPart";
import { Colors } from "react-native/Libraries/NewAppScreen";
import {
  Gesture,
  GestureHandlerRootView,
  TouchableOpacity,
} from "react-native-gesture-handler";
import PrimaryButton from "../Button";

interface Props {
  removeAttributesBar: emptyFunction;
}

const LockerRoom = ({ removeAttributesBar }: Props) => {
  removeAttributesBar();

  // Monster Initialization
  const { monster, monsterDispatch } = useContext(MonsterContext);
  useEffect(() => {
    if (monsterDispatch) {
      const action: monsterAction = {
        bodyParts: bodysInfo[1].bodyparts,
        bodyImage: bodyImage,
        body: monster,
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

  function changeBodyPart(bodyPart: BodyPart, side: "left" | "right" | "") {
    setPressedBodyPart(bodyPart);

    if (pressedBodyPart != null && bodyPart.category) {
      type bodyPartCategories = "eyes" | "head" | "leftarm" | "leftleg" | "mouth" | "rightarm" | "rightleg";
      const bodyPartNameTemp: string = side + bodyPart.category;

      function isBodyPartCategory(value: string): value is bodyPartCategories {
        return ["eyes", "head", "leftarm", "leftleg", "mouth", "rightarm", "rightleg"].includes(value);
      }

      if (isBodyPartCategory(bodyPartNameTemp)) { // Checking if it is of type bodyPartCatogiersseafasdfafd
        const bodyPartName: bodyPartCategories = bodyPartNameTemp;
        
        if (monster.bodypartnodes[bodyPartName] === undefined) 
          return


        const action: monsterAction = {
          bodyPartToChange: {
            bodyPartName: bodyPartName, // Getting the bodypart name and side
            newValue: {
              bodyPart: pressedBodyPart,
              ref: monster.bodypartnodes[bodyPartName]!.ref,
            },
          },
        };
        if (monsterDispatch) monsterDispatch(action);
      }

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
    CategoryClick("Mouth"); // Calling function to actually show the bodyparts
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <Text style={styles.header}>Customise your thumster</Text>
        <View style={styles.monster}>
          {monster ? (
            <Monster monsterBody={monster} mood={""} scaleFactor={0.2} />
          ) : null}
        </View>
      </View>
      <GestureHandlerRootView style={styles.bottom}>
        <FlatList
          style={styles.categoryBar}
          data={categories}
          contentContainerStyle={{ alignItems: "center" }}
          horizontal={true}
          renderItem={({ item, index }) => (
            <PrimaryButton title={item} key={index} buttonInnerStyles={styles.categoryButton}
            onPress={() => {
                CategoryClick(item);
                console.log(item + " was pressed");
              }}/>
          )}
        />
        <FlatList
          style={styles.bodyPartList}
          data={displayBodyParts}
          horizontal={true}
          keyExtractor={(item) => item.key}
          contentContainerStyle={{ marginRight: 10, alignItems: "flex-end" }}
          renderItem={({ item }) => (
            <ListBodyPart
              bodypart={item.bodyPart}
              OnRemove={() => removeBodyPart(item)}
              OnPress={changeBodyPart}
            />
          )}
        />
      </GestureHandlerRootView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    height: "109%"
  },
  top: {
    flex: 1.5,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    // You may use a responsive font utility or calculate the size dynamically
    fontSize: 25,
    fontWeight: "800",
    color: "#4D4752",
    marginTop: Dimensions.get("window").height * 0.1, // or use a fixed value
  },
  monster: {
    marginTop: "auto",
    height: Dimensions.get("window").height * 0.35,
    resizeMode: "contain", // change as needed
    // backgroundColor: 'black',
  },
  bottom: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  categoryBar: {
    flex: 1,
    flexGrow: 1,
    // height: 100,
    borderBottomWidth: 3,
    borderTopWidth: 3,
    borderColor: "#E5E7EB",
    paddingLeft: 20,
    // paddingRight: 20,/
    paddingVertical: 10,
    flexDirection: "row",
  },
  categoryButton: {
    minWidth: 89,
    marginTop: 5.5,
    height: 56,
    justifyContent: "center",
    marginRight: 8, // used in place of 'gap' property
  },
  bodyPartsBar: {
    flex: 2,
    paddingTop: 40,
    paddingBottom: 50,
    flexDirection: "row",
  },
  bodyPartList: {
    height: "40%",
    // flex: 1,
    paddingLeft: 20,
    paddingBottom: 20,
  },
});
export default LockerRoom;

{/* <View style={styles.shadow} />
              <View style={styles.main}>
                <Text style={styles.categoryButtonText}>{item}</Text>
              </View> */}
            //   <TouchableOpacity
            //   key={index}
            //   style={styles.categoryButton}
            //   onPress={() => {
            //     CategoryClick(item);
            //     console.log(item + " was pressed");
            //   }}
            // >
              
            // </TouchableOpacity>