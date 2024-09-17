import React, { useContext, useEffect, useReducer, useRef, useState } from "react";
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
  categories,
  theme,
  isBodyPartCategorySide,
  bodyPartCategoriesSide,
  usePrevious,
  nodeBodyPart,
} from "../../global";
import { bodySets, Body, bodyImage } from "../../global";
// import Monster from "../Monster";
import ListBodyPart from "../ListBodyPart";
import { Colors } from "react-native/Libraries/NewAppScreen";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
  TouchableOpacity,
} from "react-native-gesture-handler";
import PrimaryButton from "../Button";
import ShowAttributesContext from "../../Contexts/ShowAttributeContext";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import Rive, { Fit } from "rive-react-native";
import Monster from "../Monster";

const LockerRoom = ({ navigation }: { navigation: any }) => {
  const { showAttributesBar, setShowAttributeBar } = useContext(
    ShowAttributesContext
  );

  useEffect(() => {
    setShowAttributeBar(false);
  }, []);

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




  const [displayBodyParts, setDisplayBodyParts] = useState<BodyPart[]>(
    []
  );

  // ListBodyPart functionality:
  const [pressedBodyPart, setPressedBodyPart] = useState<BodyPart>();
  function changeBodyPart(bodyPart: BodyPart, side: "left" | "right" | "") {
    setPressedBodyPart(bodyPart);
    
    console.log(bodyPart)
    if (bodyPart !== undefined && bodyPart.category) {
      const bodyPartNameTemp: string =
        side.toLowerCase() + bodyPart.category.toLowerCase();

      if (isBodyPartCategorySide(bodyPartNameTemp)) {
        // Checking was it is of type bodyPartCatogiersseafasdfafd
        const bodyPartName: bodyPartCategoriesSide = bodyPartNameTemp;

        if (monster.Body.bodyparts[bodyPartName] === undefined)
          // If the body does not have this body part
          return;

        if (monsterDispatch) {
          
          let action: monsterAction = {}

          if (bodyPart.category !== "Body") {
            action = {
              bodyPartToChange: {
                bodyPartName: bodyPartName, // Getting the bodypart name and side
                newValue: bodyPart
              }
            }
          } else { // If it is a body
            action = {
              bodyArtboard: {
                newValue: bodyPart.artboardName,
                transitionInputName: "To " + bodyPart.bodySet
              }
            }
          }
          console.log(action);
          monsterDispatch(action);
        }
      }
    }
  }

  function removeBodyPart(bodyPartToRemove: BodyPart) {
    setDisplayBodyParts(
      displayBodyParts.filter((bodyPart) => bodyPart !== bodyPartToRemove)
    );
    console.log("removed self");
  }

  type Categories = (typeof categories)[number];

  // Function when conditions are pressed
  const CategoryClick = (category: Categories) => {
    // Clearing the current array
    let newBodyParts: BodyPart[] = [];
    // Getting all bodyparts, given the category,
    // and updating the displayBodyParts array.

    AllBodyParts.filter(
      (bodyPartToTest: BodyPart) =>
        bodyPartToTest.category === category
    ).map((bodyPart: BodyPart) => {
      newBodyParts.push(bodyPart);
    });
    setDisplayBodyParts(newBodyParts);
  };

  useEffect(() => {
    CategoryClick("Body"); // Calling function to actually show the bodyparts
  }, []);

  const preChangeSelectedBodyPart = useRef<BodyPart>();
  // let preChangeSelectedBodyPart = monster;

  const back = () => {
    setShowAttributeBar(true);
    navigation.goBack();
  };

  const [activeCategoryIndex, setActiveCategoryIndex] = useState<number>(0);

  // ** Drag and drop stuff ** //

  const [selectedBodyPart, setSelectedBodyPart] = useState<
    BodyPart | undefined
  >(undefined);

  const [isOverHitbox, setIsOverHitbox] = useState(false);

  const prevIsOverHitbox = usePrevious(isOverHitbox);

  const [hitBoxPosition, setHitBoxPosition] = useState({ x: 0, y: 0 });
  const [hitBoxDimensions, setHitBoxDimensions] = useState({
    width: 0,
    height: 0,
  });

  const [onPressInfo, setOnPressInfo] = useState({ x: 0, y: 0 });

  const bodyPartPressed = useSharedValue<boolean>(false);

  const bodyPartTranslateY = useSharedValue(0);
  const bodyPartTranslateX = useSharedValue(0);

  const bodyPartDimensions = { width: 52, height: 22 }; // Dimensions of the bodyPart

  const [, forceUpdate] = useReducer(x => x + 1, 0);

  const panBodyPart = Gesture.Pan()
    .onBegin(() => {
      runOnJS(onBegin)();
    })
    .onChange((event) => {
      const bodyPartCurrentX = onPressInfo.x + event.translationX;
      const bodyPartCurrentY = onPressInfo.y + event.translationY;

      if (
        bodyPartCurrentX + bodyPartDimensions.width >= hitBoxPosition.x &&
        bodyPartCurrentX <= hitBoxPosition.x + hitBoxDimensions.width &&
        bodyPartCurrentY + bodyPartDimensions.height >= hitBoxPosition.y + 200 &&
        bodyPartCurrentY <= hitBoxPosition.y + hitBoxDimensions.height
      ) {
        runOnJS(setIsOverHitbox)(true);
        
      } else {
        runOnJS(setIsOverHitbox)(false);
        // if (prevIsOverHitbox) 
          // runOnJS(exitHitbox)()
      }

      bodyPartTranslateX.value = onPressInfo.x + event.translationX;
      bodyPartTranslateY.value = onPressInfo.y + event.translationY;
    })
    .onFinalize(() => {
      bodyPartPressed.value = false;
      runOnJS(setSelectedBodyPart)(undefined);

      // Will be running only if the bodypart does not change
      if (isOverHitbox) {
        runOnJS(droppedBodyPartInHitbox)();
      }

      if (!isOverHitbox) {
        bodyPartTranslateX.value = withSpring(onPressInfo.x);
        bodyPartTranslateY.value = withSpring(onPressInfo.y);
        runOnJS(droppedOutsideHitbox)()
      }
  });

  const animatedStyles = useAnimatedStyle(() => ({
    top: bodyPartTranslateY.value + 0,
    left: bodyPartTranslateX.value + 25,
    display: isOverHitbox ? "none" : "flex",
    transform: [
      { translateX: bodyPartPressed.value ? 25 : 0 },
      { translateY: bodyPartPressed.value ? 25 : 0 },
      { scale: withTiming(bodyPartPressed.value ? 1.2 : 1) },
      { rotate: withTiming(bodyPartPressed.value ? "10deg" : "0deg") },
    ],
  })); 

  // detects when entered hitbox, and when exits
  useEffect(() => {
    if (isOverHitbox)
      enterHitbox();
    else if (prevIsOverHitbox && !isOverHitbox) {
      exitHitbox()
    }
  }, [isOverHitbox]);

  function enterHitbox() {
    // if (monsterDispatch)
      // monsterDispatch(replaceSelectedBodyPart(false, selectedBodyPart))

    // forceUpdate();
  }

  function exitHitbox() {
    if (monsterDispatch)
      monsterDispatch(replaceSelectedBodyPart(true))

    forceUpdate();
  }
  
  function droppedBodyPartInHitbox() {
    console.log("Dropped Inside Hitbox")
    let currBodyPart = selectedBodyPart;

    if (!currBodyPart) return;
    let bodyPartReflected: "left" | "right" | "" = (currBodyPart.category === undefined || ["Eyes", "Mouth", "Head", "Body"].includes(currBodyPart.category))? "" : !currBodyPart.reflected? "right" : "left";

    // changeBodyPart(currBodyPart, bodyPartReflected);

    if (monsterDispatch)
      monsterDispatch(replaceSelectedBodyPart(false, currBodyPart))
  }

  function droppedOutsideHitbox() {
    // console.log(preChangeSelectedBodyPart.current?.bodyPart.aspectRatio);

    // Set body to old body, before the nodes were added, but not working.
    if (monsterDispatch) {
      // const keys = Object.keys(preChangeSelectedBodyPart.current.bodypartnodes);
      // const correspondantBodyPartIndex = keys.findIndex(key => key === selectedBodyPart?.category);
      // console.log(replaceSelectedBodyPart(false, preChangeSelectedBodyPart.current?.bodyPart));
      // console.log(monster.bodypartnodes.mouth.bodyPart.aspectRatio)

      // monsterDispatch(replaceSelectedBodyPart(false, preChangeSelectedBodyPart.current?.bodyPart))
      console.log("Dropped Outside Hitbox")
      monsterDispatch({
        bodyPartToChange: {
          bodyPartName: "mouth",
          newValue: new BodyPart(...nodeBodyPart, preChangeSelectedBodyPart.current?.bodySet || "Node")
        }
      })
    }

  }

  // useEffect(() => {
  //   console.log("Prev Monster Changed")
  //   // console.log(prevMonster.current.bodypartnodes.mouth.bodyPart.aspectRatio);
  // }, [prevMonster.current.bodypartnodes.mouth.bodyPart.aspectRatio])

  function onBegin() {
    // Change the bodyparts that are of the selectedBodypart type to a node.

    const values = Object.values(monster.Body.bodyparts);

    // Selected Body Part Index
    const sbpIndex = values.findIndex((bodypart: BodyPart) => (bodypart && bodypart.category === categories[activeCategoryIndex]));

    preChangeSelectedBodyPart.current = values[sbpIndex];
    // console.log(preChangeSelectedBodyPart.current?.bodyPart.aspectRatio);

    // console.log(preChangeSelectedBodyPart.current?.bodyPart.aspectRatio)

    // const reflected = (selectedBodyPart?.node.length !== undefined &&selectedBodyPart?.node.length >= 3) ? true : false;

    // const correspondantBodyPartIndex = keys.findIndex(key => key === selectedBodyPart?.category?.toLowerCase());

    // if (correspondantBodyPartIndex !== -1) {

    // const action = replaceSelectedBodyPart(true);
    // console.log(action)
      
    // if (monsterDispatch)  
    //   monsterDispatch(action);
  }

  
  /**
   * Given currBodyPart and reflected, it will find the correspoding bodypart on the current body (e.g. currBodyPart is a "leftarm", so it finds the corresponding "leftarm" on the CURRENT body). Then changes that corresponding bodypart to the currBodyPart, which is the selected body part.
   */
  function replaceSelectedBodyPart(justNode: boolean, bodyPart?: BodyPart): monsterAction | undefined {
    // Filters all the bodyparts that are of the selectedBodypart type
    
    let action = {}
    
    let bodyPartKeys = Object.keys(monster.Body.bodyparts);
    
    if (categories[activeCategoryIndex] !== "Body") {
      Object.values(monster.Body.bodyparts).map(
        (bodypart: BodyPart, index: number) => {
          if (!(
            bodypart !== undefined &&
            bodypart.category === categories[activeCategoryIndex]
          )) {
            bodyPartKeys.splice(index, 1, "");
            return false;
          }
        }
      );
  
      const filteredKeys = bodyPartKeys.filter((key: string) => key !== "");

      console.log(filteredKeys);
        
      const bodyPartNameTemp = filteredKeys[0].toLowerCase();
      
      if (!bodyPartNameTemp || !isBodyPartCategorySide(bodyPartNameTemp))
        return;
      
      const bodyPartName: bodyPartCategoriesSide = bodyPartNameTemp;

      console.log(monster.Body.bodyparts[bodyPartName]);
  
      if (monster.Body.bodyparts[bodyPartName] === undefined) return;
            
      action = {
        bodyPartToChange: {
          bodyPartName: bodyPartName,
          newValue: justNode ? 
            new BodyPart(categories[activeCategoryIndex], "Node", "Nodes") 
            : bodyPart
        },
      };            
    } else {
      if (!selectedBodyPart) return;

      action = {
        bodyArtboard: {
          newValue: bodySets[selectedBodyPart?.bodySet].body.bodyArtboard,
          transitionInputName: bodySets[selectedBodyPart?.bodySet].body.bodyTransitionInput,
          bodyColor: bodySets[selectedBodyPart?.bodySet].body.bodyColor 
        }
      }
    }
    
    console.log(JSON.stringify(action, null, 2))
    return action;
  }

  // ** End of drag and drop stuff ** //

  const [color, setColor] = useState<string>("");

  return (
    <GestureHandlerRootView>
      <View style={styles.container}>
        {displayBodyParts.map((bodypart: BodyPart) => {
          const artboardName = bodypart.artboardName;
          return (
            <Animated.View
              key={bodypart.id}
              style={[
                styles.renderedBodyPartContainer,
                animatedStyles,
                {
                  opacity:
                    selectedBodyPart && selectedBodyPart.id === bodypart.id
                      ? 1
                      : 0,
                },
              ]}
            >
              <Rive
                style={{
                  width: bodypart.category === "Body" ? 200 : 50,
                  height: bodypart.category === "Body" ? 200 : 50,
                }}
                fit={Fit.Contain}
                resourceName="monster"
                artboardName={artboardName}
                autoplay={true}
                animationName="Idle"
                />
            </Animated.View>
          );
        })}
        <View style={styles.top}>
          <View style={styles.backButtonContainer}>
            <TouchableOpacity
              style={{ backgroundColor: "transparent", padding: 5 }}
              onPress={() => {
                forceUpdate()
              }}
            >
              <Text style={styles.backButton}>{"<"}</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.header}>Customise {"\n"} your thumster</Text>
          <View 
            style={styles.monster}
            onLayout={(event) => {
              const layout = event.nativeEvent.layout;

              setHitBoxPosition({ x: layout.x, y: layout.y - 100 });
              setHitBoxDimensions({
                width: layout.width,
                height: layout.height,
              });
            }}
            >
            {monster ? (
              <Monster scaleFactor={.2}/>
            ) : null}
          </View>
        </View>
        <View style={styles.bottom}>
          <FlatList
            style={styles.categoryBar}
            data={categories}
            contentContainerStyle={{ alignItems: "center" }}
            horizontal={true}
            renderItem={({ item, index }) => (
              <PrimaryButton
                title={item}
                key={index}
                buttonInnerStyles={[
                  styles.categoryButton,
                  {
                    marginLeft: index === 0 ? 20 : 0,
                    marginRight: index + 1 === categories.length ? 20 : 8,
                  },
                ]}
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
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ alignItems: "flex-end" }}
            renderItem={({ item }) => {
              if (item.transitionInputName === undefined || item.transitionInputName === "" || item.bodySet === "Nodes") return <></>

              return (
              <GestureDetector gesture={panBodyPart}>
                <ListBodyPart
                  bodypart={item}
                  OnRemove={() => removeBodyPart(item)}
                  OnPressIn={(e) => {
                    bodyPartPressed.value = true;
                    const [x, y] = [
                      e.nativeEvent.pageX - 60,
                      e.nativeEvent.pageY - 60,
                    ];
                    setSelectedBodyPart(item);
                    setOnPressInfo({ x: x, y: y });
                    bodyPartTranslateX.value = x;
                    bodyPartTranslateY.value = y;
                  }}
                />
              </GestureDetector>
              // <View style={{ backgroundColor: "red", height: 100, width: 100 }}></View>
            )}}
          />
        </View>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  renderedBodyPartContainer: {
    transformOrigin: "50%",
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 50,
  },
  renderedBodyPart: {
    height: 50,
    width: 50,
  },
  backButtonContainer: {
    position: "absolute",
    top: 30,
    left: 20,
    elevation: 10,
    zIndex: 100,
    backgroundColor: "transparent",
  },
  backButton: {
    fontWeight: "800",
    fontSize: 25,
    color: theme.default.interactionPrimary,
  },
  container: {
    height: "100%", // 109
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
    color: "#4D4752",
    fontFamily: "Poppins_900Black",
    marginTop: Dimensions.get("window").height * 0.1, // or use a fixed value
    textAlign: "center",
    letterSpacing: -0.3,
  },
  monster: {
    marginTop: "auto",
    height: Dimensions.get("window").height * 0.35,
    width: "100%",
    resizeMode: "contain",
    // backgroundColor: 'black',
  },
  bottom: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    paddingBottom: 100,
  },
  categoryBar: {
    flex: 1,
    flexGrow: 0.35,
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

{
  /* <View style={styles.shadow} />
              <View style={styles.main}>
                <Text style={styles.categoryButtonText}>{item}</Text>
              </View> */
}
//   <TouchableOpacity
//   key={index}
//   style={styles.categoryButton}
//   onPress={() => {
//     CategoryClick(item);
//     console.log(item + " was pressed");
//   }}
// >

// </TouchableOpacity>

// const filteredValues = Object.values(monster.Body.bodyparts).filter(
//   (bodypart: BodyPart, index: number) => {
//     // console.log(bodypart?.category, categories[activeCategoryIndex]);
//     if (
//       bodypart !== undefined &&
//       bodypart.category === categories[activeCategoryIndex]
//     ) {
//       return true;
//     } else {
//       bodyPartKeys.splice(index, 1, "");
//       return false;
//     }
//   }
// );

// const filteredValues = Object.values(monster.Body.bodyparts).filter(
//   (bodypart: BodyPart, index: number) => {
//     if (
//       bodypart !== undefined &&
//       bodypart.category === categories[activeCategoryIndex]
//     ) {
//       return true;
//     } else {
//       bodyPartKeys.splice(index, 1, "");
//       return false;
//     }
//   }
// );
