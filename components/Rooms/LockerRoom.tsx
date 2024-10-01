import React, { useContext, useEffect, useLayoutEffect, useReducer, useRef, useState } from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
  Platform,
  ScrollView,
  Button,
  Dimensions,
} from "react-native";
import { FlatList, gestureHandlerRootHOC } from "react-native-gesture-handler"
import { MonsterContext, MonsterInfo, monsterAction } from "../../Contexts/MonsterContext";
import {
  BodyPart,
  AllBodyParts,
  categories,
  theme,
  isBodyPartCategorySide,
  bodyPartCategoriesSide,
  usePrevious,
  nodeBodyPart,
  stateMachineName,
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
import Rive, { Fit, RiveRef } from "rive-react-native";
import Monster from "../Monster";
import { ColorContext } from "../../Contexts/ColorContext";
import { PanGesture } from "react-native-gesture-handler/lib/typescript/handlers/gestures/panGesture";

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
          } 
          // else { // If it is a body
          //   action = {
          //     bodyArtboard: {
          //       newValue: bodyPart.artboardName,
          //       transitionInputName: "To " + bodyPart.bodySet
          //     }
          //   }
          // }
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
  const UpdateDisplayBodyParts = (category: Categories, monsterBody = monster.Body) => {
    // Clearing the current array
    let newBodyParts: BodyPart[] = [];
    // Getting all bodyparts, given the category,
    // and updating the displayBodyParts array.

    AllBodyParts.filter(
      (bodyPartToTest: BodyPart) =>
        bodyPartToTest?.category === category
    ).map((bodyPart: BodyPart) => {
      if (!monsterBody.isBodyPartOnBody(bodyPart)) // if bodyPart exists on body
        newBodyParts.push(bodyPart);
    });
    setDisplayBodyParts(newBodyParts);
  };

  useEffect(() => {
    UpdateDisplayBodyParts("Body"); // Calling function to actually show the bodyparts
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
        runOnJS(droppedInHitbox)();
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
  
  const prevMonster = useRef<Body | undefined>(undefined);

  function enterHitbox() {
    // prevMonster.current = new Body(monster.Body.bodyparts, monster.Body.bodyArtboard, monster.Body.bodyTransitionInput, monster.Body.bodyTransitionInput);
    // prevMonster.current = {...monster.Body, isBodyPartOnBody: monster.Body.isBodyPartOnBody};
    prevMonster.current = {...JSON.parse(JSON.stringify(monster.Body)), isBodyPartOnBody: monster.Body.isBodyPartOnBody}
    // prevMonster.current?.isBodyPartOnBody = monster.Body.isBodyPartOnBody;
    // prevMonster.current = Object.create(monster.Body)
    
    // console.log(" AAAAH prevMonster", JSON.stringify(prevMonster, null, 2))
    console.log(" AAAAH prevMonster", prevMonster.current?.bodyparts.eyes.artboardName)
    

    if (monsterDispatch)
        monsterDispatch(replaceSelectedBodyPart(false, selectedBodyPart))
  }

  function exitHitbox() {
    // console.log("prevMonster", JSON.stringify(prevMonster, null, 2))
    console.log("prevMonster", prevMonster.current?.bodyparts.eyes.artboardName)

    if (monsterDispatch && prevMonster) {
      monsterDispatch({ body: prevMonster.current })
      
      if (syncBodyParts.current) {
        console.log("syncing body parts haha", monster.RiveRef)
        syncBodyParts.current({Body: prevMonster.current!, RiveRef: monster.RiveRef});
      }
    }

    prevMonster.current = undefined
  }
  
  function droppedInHitbox() {
    setIsHolding(false);
    setIsOverHitbox(false);
    console.log("Dropped Inside Hitbox")
    // let currBodyPart = selectedBodyPart;

    // if (!currBodyPart) return;
    // let bodyPartReflected: "left" | "right" | "" = (currBodyPart.category === undefined || ["Eyes", "Mouth", "Head", "Body"].includes(currBodyPart.category))? "" : !currBodyPart.reflected? "right" : "left";

    // changeBodyPart(currBodyPart, bodyPartReflected);

    // if (monsterDispatch)
    //   monsterDispatch(replaceSelectedBodyPart(false, currBodyPart))

    UpdateDisplayBodyParts(categories[activeCategoryIndex]);
  }

  function droppedOutsideHitbox() {
    setIsHolding(false);
    setIsOverHitbox(false);
    
    UpdateDisplayBodyParts(categories[activeCategoryIndex]);

    // console.log(preChangeSelectedBodyPart.current?.bodyPart.aspectRatio);

    // Set body to old body, before the nodes were added, but not working.
    if (monsterDispatch) {
      // const keys = Object.keys(preChangeSelectedBodyPart.current.bodypartnodes);
      // const correspondantBodyPartIndex = keys.findIndex(key => key === selectedBodyPart?.category);
      // console.log(replaceSelectedBodyPart(false, preChangeSelectedBodyPart.current?.bodyPart));
      // console.log(monster.bodypartnodes.mouth.bodyPart.aspectRatio)

      // monsterDispatch(replaceSelectedBodyPart(false, preChangeSelectedBodyPart.current?.bodyPart))
      console.log("Dropped Outside Hitbox")
      // monsterDispatch({
      //   bodyPartToChange: {
      //     bodyPartName: "mouth",
      //     newValue: new BodyPart(...nodeBodyPart, preChangeSelectedBodyPart.current?.bodySet || "Node")
      //   }
      // })
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
          console.log(bodypart?.category, categories[activeCategoryIndex]);
          if (!(
            bodypart !== undefined &&
            bodypart.category === categories[activeCategoryIndex]
          )) {
            bodyPartKeys.splice(index, 1, "");
          }
        }
      );
  
      const filteredKeys = bodyPartKeys.filter((key: string) => key !== "");

      console.log(filteredKeys);

      if (filteredKeys.length === 0) {
        console.warn("Error: No Corresponding Bodypart on Body Found of category", "'" + categories[activeCategoryIndex] + "'"); 
        return;
      }
        
      const bodyPartNameTemp = filteredKeys[0].toLowerCase();
      
      if (!bodyPartNameTemp || !isBodyPartCategorySide(bodyPartNameTemp))
        return;
      
      const bodyPartName: bodyPartCategoriesSide = bodyPartNameTemp;

      console.log(monster.Body.bodyparts[bodyPartName]);
  
      if (monster.Body.bodyparts[bodyPartName] === undefined) return;
      
      action = {
        overlayRef: !justNode? OverlayRef : undefined,
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
        overlayRef: OverlayRef,
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

  const { color, setColor, colorTheme } = useContext(ColorContext); 

  const [isHolding, setIsHolding] = useState(false);

  const [count, setCount] = useState(0);
  
  const isInitialMount = useRef(true);
  
  useEffect(() => {
    console.log('isHolding', isHolding)
  }, [isHolding])

  const OverlayRef = useRef<RiveRef>(null);

  // const [syncBodyParts, setSyncBodyParts] = useState<(() => void) | undefined>(undefined)

  const syncBodyParts = useRef<((monster: MonsterInfo) => void) | undefined>(undefined)

  useEffect(() => {
    console.log("syncBodyParts", syncBodyParts)
  }, [syncBodyParts])

  return (
    <GestureHandlerRootView>
      <View style={styles.container}>
        <Rive
          style={styles.colorChangeAnimationOverlay}
          artboardName="Body Change"
          resourceName="thumsters_tamogotchi_animations"
          autoplay
          animationName="Idle"
          fit={Fit.Cover}
          ref={OverlayRef}
        />

        {displayBodyParts.map((bodypart: BodyPart) => {
          return (
            <Animated.View
              key={bodypart.id}
              style={[
                styles.renderedBodyPartContainer,
                animatedStyles,
                {
                  pointerEvents: "none", // DO NOT REMOVE YOU WILL BE ANNIHILATED
                  opacity:
                    selectedBodyPart && selectedBodyPart.id === bodypart.id
                      ? 1
                      : 0,
                  transform: [
                    { translateX: selectedBodyPart?.category === "Body"? -200 : 35 },
                    { translateY: selectedBodyPart?.category === "Body"? -200 : 35 },                
                  ]
                },
              ]}
            >
              <RenderedBodyPart bodypart={bodypart}/>
            </Animated.View>
          );
        })}
        <View style={[styles.top, {backgroundColor: colorTheme.theme.backgroundColor,}]}>
          <View style={styles.backButtonContainer}>
            <TouchableOpacity
              style={{ backgroundColor: "transparent", padding: 5
              }}
              onPress={() => {
                // forceUpdate()
                setIsHolding(true);
                setTimeout(() => {
                  setIsHolding(false);
                }, 500)
              }}
            >
              <Text style={[styles.backButton, { color: colorTheme.theme.interactionPrimary
              }]}>{"<"}</Text>
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
              <Monster scaleFactor={.2} setSyncBodyParts={(fn) => {
                console.log(fn)
                syncBodyParts.current = fn
              }}/>
            ) : null}
          </View>
        </View>
        <View style={[styles.bottom, {backgroundColor: colorTheme.theme.customizationBar}]}>
          <FlatList
            style={[styles.categoryBar, {borderColor: colorTheme.theme.customizationBarStroke}]}
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
                  UpdateDisplayBodyParts(item);
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
            // pointerEvents={isHolding ? "none" : "auto"}
            horizontal={true}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ alignItems: "flex-end" }}
            renderItem={({ item }) => {
              if (item.transitionInputName === undefined || item.transitionInputName === "" || item.bodySet === "Nodes") return <></>

              const ListBodyPartInstance = (
                <ListBodyPart
                  bodypart={item}
                  OnRemove={() => removeBodyPart(item)}
                  OnPressIn={(e) => {
                    bodyPartPressed.value = true;
                    setIsHolding(true);
                    const [x, y] = [
                      e.nativeEvent.pageX - 100,
                      e.nativeEvent.pageY - 100,
                    ];
                    
                    // const [x, y] = [
                    //   e.absoluteX - (item.category === "Body" ? 100 : 55),
                    //   e.absoluteY - (item.category === "Body" ? 100 : 0),
                    // ];
                    
                    setSelectedBodyPart(item);
                    setOnPressInfo({ x: x, y: y });
                    bodyPartTranslateX.value = x;
                    bodyPartTranslateY.value = y;
                  }}
                  panGesture={panBodyPart}
                />
              )

              if (isHolding) {
                return (
                  <GestureDetector gesture={panBodyPart}>
                    {ListBodyPartInstance}
                  </GestureDetector>
                )
              } else {
                return ListBodyPartInstance
              }
              // return ListBodyPartInstance
            }}
          />
        </View>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  colorChangeAnimationOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
    elevation: 100,
    pointerEvents: "none",
  },
  renderedBodyPartContainer: {
    transformOrigin: "50%",
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 50,
    elevation: 50,
  },
  renderedBodyPart: {
    height: 50,
    width: 50,
    zIndex: 50,
    elevation: 50,
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
  },
  container: {
    height: "100%", // 109
    position: "relative"
  },
  top: {
    position: "relative",
    flex: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
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


// Rendered Body Part
const RenderedBodyPart = ({ bodypart }: { bodypart: BodyPart }) => {
  const ref = useRef<RiveRef>(null);

  const { color } = useContext(ColorContext);  
  
  if (ref.current && bodypart.colorInputs.includes(color) && bodypart.stateMachineName !== undefined) {
    ref.current.setInputState(bodypart.stateMachineName, color, true);
  }

  return (
    <Rive
      style={{
        width: bodypart.category === "Body" ? 200 : 70,
        height: bodypart.category === "Body" ? 200 : 70,
        pointerEvents: "none" // DO NOT REMOVE, YOU WILL BE ANNIHILATED

      }}
      fit={Fit.Contain}
      ref={ref}
      resourceName="monster"
      artboardName={bodypart.artboardName}
      autoplay={true}
    />
  )
}

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
