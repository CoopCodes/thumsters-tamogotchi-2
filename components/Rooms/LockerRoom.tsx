import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Image,
  Text,
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
import { bodySets, Body, bodyImage } from "../../global";
import Monster from "../Monster";
 import ListBodyPart from "../ListBodyPart";
import { Colors } from "react-native/Libraries/NewAppScreen";
import {
  GestureHandlerRootView,
  TouchableOpacity,
} from "react-native-gesture-handler";
import PrimaryButton from "../Button";
import ShowAttributesContext from "../../Contexts/ShowAttributeContext";


const LockerRoom = ({ navigation }: { navigation: any }) => {
  const { showAttributesBar, setShowAttributeBar } = useContext(ShowAttributesContext);

  useEffect(() => {
    setShowAttributeBar(false);
  }, [])

  // Monster Initialization
  const { monster, monsterDispatch } = useContext(MonsterContext);
  // useEffect(() => {
  //   if (monsterDispatch) {
  //     const action: monsterAction = {
  //       bodyParts: bodySets[1].bodyparts,
  //       bodyImage: bodyImage,
  //       body: monster,
  //     };
  //     monsterDispatch(action);
  //   }
  // }, []);

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

    if (pressedBodyPart !== null && bodyPart.category) {
      type bodyPartCategories = "eyes" | "head" | "leftarm" | "leftleg" | "mouth" | "rightarm" | "rightleg";
      const bodyPartNameTemp: string = side.toLowerCase() + bodyPart.category.toLowerCase();
      console.log(bodyPartNameTemp)
    

      function isBodyPartCategory(value: string): value is bodyPartCategories {
        return ["eyes", "head", "leftarm", "leftleg", "mouth", "rightarm", "rightleg"].includes(value);
      }
      
      if (isBodyPartCategory(bodyPartNameTemp)) { // Checking was it is of type bodyPartCatogiersseafasdfafd
        const bodyPartName: bodyPartCategories = bodyPartNameTemp;
        
        if (monster.bodypartnodes[bodyPartName] === undefined) // If the body does not have this body part
          return

          if (monsterDispatch) {
          const action: monsterAction = {
            bodyPartToChange: {
              bodyPartName: bodyPartName, // Getting the bodypart name and side
              newValue: {
                bodyPart: bodyPart,
                ref: monster.bodypartnodes[bodyPartName]?.ref,
                riveRef : monster.bodypartnodes[bodyPartName]?.riveRef
              },
            },
          };
          monsterDispatch(action);
        }
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
  
  const back = () => {
    setShowAttributeBar(true);
    navigation.goBack();
  };  

  const [activeCategoryIndex, setActiveCategoryIndex] = useState<number>(0);

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <View style={styles.backButtonContainer}>
          <TouchableOpacity 
            style={{ backgroundColor: "transparent", padding: 5 }}
            onPress={back}>
            <Text style={styles.backButton}>{"<"}</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.header}>Customise your thumster</Text>
        <View style={styles.monster}>
          {monster ? (
            <Monster monsterBody={monster} scaleFactor={0.2} />
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
            <PrimaryButton title={item} key={index} buttonInnerStyles={[styles.categoryButton, {
                marginLeft: (index === 0)? 20 : 0,
                marginRight: ((index + 1) === categories.length)? 20 : 8
              }]}
            onPress={() => {
                CategoryClick(item);
                setActiveCategoryIndex(index);
            }}
            activeIndex={activeCategoryIndex}
            index={index}
            selectable={true}

            />
          )}
        />
        <FlatList
          style={styles.bodyPartList}
          data={displayBodyParts}
          horizontal={true}
          keyExtractor={(item) => item.key}
          contentContainerStyle={{ alignItems: "flex-end" }}
          renderItem={({ item }) => (
            <ListBodyPart
              bodypart={item.bodyPart}
              OnRemove={() => removeBodyPart(item)}
              OnPress={changeBodyPart}
            />
            // <View style={{ backgroundColor: "red", height: 100, width: 100 }}></View>
          )}
        />
      </GestureHandlerRootView>
    </View>
  );
};

const styles = StyleSheet.create({
  
  backButtonContainer: {
    position: "absolute",
    top: 30,
    left: 20,
    elevation: 10,
    zIndex: 100,
    backgroundColor: "transparent"
  },
  backButton: {
    fontWeight: "800",
    fontSize: 25,
    color: theme.default.interactionPrimary,
  },
  container: {
    height: "100%", // 109
    backgroundColor: "blue",
    // flex: ,
  },
  top: {
    position: "relative",
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
    transform: [{ translateY: 70 }],
    height: Dimensions.get("window").height * 0.35,
    resizeMode: "contain", // change as needed
    // backgroundColor: 'black',
  },
  bottom: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    paddingBottom: 100,
  },
  categoryBar: {
    flex: 1,
    flexGrow: .35,
    borderBottomWidth: 3,
    borderTopWidth: 3,
    borderColor: "#E5E7EB",
    paddingVertical: 10,
    flexDirection: "row",
    overflow: "visible",
  },
  categoryButton: {
    minWidth: 89,
    marginTop: 5.5,
    minHeight: "90%",
    
    justifyContent: "center",
    marginRight: 8, // used in place of 'gap' property
  },
  bodyPartList: {
    height: 0,
    // backgroundColor: "white",
    // flex: 1,
    paddingLeft: 20,
    paddingBottom: 50,
  },
  // bodyPartsBar: {
  //   flex: 2,
  //   paddingTop: 40,
  //   paddingBottom: 50,
  //   flexDirection: "row",
  // },
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