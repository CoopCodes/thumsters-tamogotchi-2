import React, { useContext, useEffect, useReducer, useState } from "react";
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
  emptyBody,
  isBodyPartCategorySide,
  bodyPartCategoriesSide,
  usePrevious,
} from "../../global";
import { bodySets, Body, bodyImage } from "../../global";
import Monster from "../Monster";
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
    console.log("OOOOOOOHG")
    setPressedBodyPart(bodyPart);

    if (pressedBodyPart !== null && bodyPart.category) {
      const bodyPartNameTemp: string =
        side.toLowerCase() + bodyPart.category.toLowerCase();

      if (isBodyPartCategorySide(bodyPartNameTemp)) {
        // Checking was it is of type bodyPartCatogiersseafasdfafd
        const bodyPartName: bodyPartCategoriesSide = bodyPartNameTemp;

        if (monster.bodypartnodes[bodyPartName] === undefined)
          // If the body does not have this body part
          return;

        if (monsterDispatch) {
          const action: monsterAction = {
            bodyPartToChange: {
              bodyPartName: bodyPartName, // Getting the bodypart name and side
              newValue: {
                bodyPart: bodyPart,
                ref: monster.bodypartnodes[bodyPartName]?.ref,
                riveRef: monster.bodypartnodes[bodyPartName]?.riveRef,
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

  // const [prevMonster, setPrevMonster] = useState(monster);
  let prevMonster = monster;

  const back = () => {
    setShowAttributeBar(true);
    navigation.goBack();
  };

  const [activeCategoryIndex, setActiveCategoryIndex] = useState<number>(3);

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
      runOnJS(onFinalize)()
      if (isOverHitbox) {
        runOnJS(droppedBodyPartInHitbox)(selectedBodyPart);
      }

      if (!isOverHitbox) {
        bodyPartTranslateX.value = withSpring(onPressInfo.x);
        bodyPartTranslateY.value = withSpring(onPressInfo.y);
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
      console.log("Exiting Hitbox")
      exitHitbox()
    }
  }, [isOverHitbox]);

  function enterHitbox() {
    console.log("entered hitbox");
    // console.log(monsterDispatch, selectedBodyPart?.category)
    if (monsterDispatch)
      monsterDispatch(replaceSelectedBodyPart(false, selectedBodyPart))

    forceUpdate();
  }

  function exitHitbox() {
    if (monsterDispatch)
      monsterDispatch(replaceSelectedBodyPart(true))

    forceUpdate();
  }
  
  function droppedBodyPartInHitbox(currBodyPart?: BodyPart) {
    if (!currBodyPart) return;
    let bodyPartReflected: "left" | "right" | "" = (currBodyPart.category === undefined || ["Eyes", "Mouth", "Head", "Body"].includes(currBodyPart.category))? "" : (!(currBodyPart.node.length <= 3 ? false : true))? "right" : "left";

    changeBodyPart(currBodyPart, bodyPartReflected);
  }
    
  function onFinalize() {
    // Set body to old body, before the nodes were added, but not working.
    if (monsterDispatch) {
      monsterDispatch({
        body: prevMonster
      })
    }
  }


  function onBegin() {
    // Change the bodyparts that are of the selectedBodypart type to a node.
    prevMonster = {...monster};
    // console.log(prevMonster?.bodypartnodes.mouth.bodyPart.width)
    // console.log(prevMonster === monster)

    
    if (monsterDispatch) 
      monsterDispatch(replaceSelectedBodyPart(true))
  }

  function replaceSelectedBodyPart(justNode: boolean, bodyPart?: BodyPart) {
    // Filters all the bodyparts that are of the selectedBodypart type
    let keys = Object.keys(monster.bodypartnodes);
    // if (justNode === false) console.log(Object.values(monster.bodypartnodes), Object.keys(monster.bodypartnodes))

    const filteredValues = Object.values(monster.bodypartnodes).filter(
      (bodypart: bodyPartInfo, index: number) => {
        // if (justNode === false) console.log(bodypart.bodyPart.category, categories[activeCategoryIndex])
        if (
          bodypart !== undefined &&
          bodypart.bodyPart.category === categories[activeCategoryIndex]
        ) {
          return true;
        } else {
          keys.splice(index, 1, "");
          return false;
        }
      }
    );

    const filteredKeys = keys.filter((key: string) => key !== "");

    let action = {}

    filteredValues.map((_: bodyPartInfo, index: number) => {
      const bodyPartNameTemp = filteredKeys[index].toLowerCase();

      if (!bodyPartNameTemp || !isBodyPartCategorySide(bodyPartNameTemp))
        return;
      
      
      const bodyPartName: bodyPartCategoriesSide = bodyPartNameTemp;

      if (monster.bodypartnodes[bodyPartName] === undefined) return;


      action = {
        bodyPartToChange: {
          bodyPartName: bodyPartName,
          newValue: {
            bodyPart: justNode ? 
              bodySets[0].bodyparts[bodyPartName]?.bodyPart || bodySets[0].bodyparts.mouth.bodyPart 
              : 
              bodyPart,
            ref: monster.bodypartnodes[bodyPartName]?.ref,
            riveRef: monster.bodypartnodes[bodyPartName]?.riveRef,
          },
        },
      };
    });
    return action;
  }

  // ** End of drag and drop stuff ** //

  return (
    <GestureHandlerRootView>
      <View style={styles.container}>
        {displayBodyParts.map((bodypart: ListBodyPartType) => {
          const Image = bodypart.bodyPart.image;
          console.log(Image)
          return (
            <Animated.View
              key={bodypart.key}
              style={[
                styles.renderedBodyPartContainer,
                animatedStyles,
                {
                  // opacity:
                  //   selectedBodyPart &&
                  //   selectedBodyPart.bodySet === bodypart.bodyPart.bodySet && selectedBodyPart.alignments === bodypart.bodyPart.alignments
                  //     ? 1
                  //     : 0,
                },
              ]}
            >
              {!(typeof Image === "string") ? (
                <Image height={50} style={styles.renderedBodyPart} />
              ) : (
                <Rive
                  style={{
                    width: 50,
                    height: 50,
                  }}
                  fit={Fit.Contain}
                  resourceName="body1"
                  artboardName={Image}
                  autoplay={true}
                  animationName="Idle"
                  />
              )}
            </Animated.View>
          );
        })}
        <View style={styles.top}>
          <View style={styles.backButtonContainer}>
            <TouchableOpacity
              style={{ backgroundColor: "transparent", padding: 5 }}
              onPress={back}
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
              <Monster monsterBody={monster} scaleFactor={0.2} />
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
            keyExtractor={(item) => item.key}
            contentContainerStyle={{ alignItems: "flex-end" }}
            renderItem={({ item }) => (
              <GestureDetector gesture={panBodyPart}>
                <ListBodyPart
                  bodypart={item.bodyPart}
                  OnRemove={() => removeBodyPart(item)}
                  // OnPress={changeBodyPart}
                  OnPressIn={(e) => {
                    bodyPartPressed.value = true;
                    const [x, y] = [
                      e.nativeEvent.pageX - 60,
                      e.nativeEvent.pageY - 60,
                    ];
                    setSelectedBodyPart(item.bodyPart);
                    setOnPressInfo({ x: x, y: y });
                    bodyPartTranslateX.value = x;
                    bodyPartTranslateY.value = y;
                    console.log("AAAAH");
                  }}
                />
              </GestureDetector>
              // <View style={{ backgroundColor: "red", height: 100, width: 100 }}></View>
            )}
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
    color: "#4D4752",
    fontFamily: "Poppins_900Black",
    marginTop: Dimensions.get("window").height * 0.1, // or use a fixed value
    textAlign: "center",
    letterSpacing: -0.3,
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
