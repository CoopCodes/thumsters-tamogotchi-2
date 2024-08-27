import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  Pressable,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { MonsterContext } from "../../Contexts/MonsterContext";
import { IFood, foodCategories, theme } from "../../global";
import Monster, { IPerk } from "../Monster";

import clothesHanger from "../../assets/resources/images/ClothesHanger.svg";
import KitchenBackground from "../../assets/resources/images/Kitchen.svg";
import Coin from "../../assets/resources/images/Coin.svg";

import PrimaryButton from "../Button";
import Sleep from "../../assets/resources/images/sleep.svg";

import { AttributesContext } from "../../Contexts/AttributeContext";
import MoodContext from "../../Contexts/MoodContext";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import ThumbucksContext from "../../Contexts/ThumbucksContext";
import AllFoodsContext from "../../Contexts/AllFoodsContext";

function Kitchen() {
  const { monster, monsterDispatch } = useContext(MonsterContext);
  const { attributes, attributesDispatch } = useContext(AttributesContext);
  const { mood, setMood } = useContext(MoodContext);
  const { thumbucks, setThumbucks } = useContext(ThumbucksContext);
  const { allFoods, setAllFoods } = useContext(AllFoodsContext);

  const [displayFood, setDisplayFood] = useState<IFood[]>([]);

  type Categories = (typeof foodCategories)[number];
  const [activeCategoryIndex, setActiveCategoryIndex] = useState<number>(0);

  // Function when conditions are pressed
  const CategoryClick = (category: Categories) => {
    // Clearing the current array
    let newFoods: IFood[] = [];
    // Getting all bodyparts, given the category,
    // and updating the displayBodyParts array.

    allFoods
      .filter((bodyPartToTest: IFood) => bodyPartToTest.category === category)
      .map((bodyPart: IFood) => {
        newFoods.push(bodyPart);
      });
    setDisplayFood(newFoods);
  };

  useEffect(() => {
    CategoryClick(foodCategories[0]);
  }, []);

  const [selectedFood, setSelectedFood] = useState("");
  
  // Drag and drop gestures
  const [onPressInfo, setOnPressInfo] = useState({ x: 0, y: 0 });
  
  const [isOverHitbox, setIsOverHitbox] = useState(false);
  const [hitBoxPosition, setHitBoxPosition] = useState({ x: 0, y: 0 });
  const [hitBoxDimensions, setHitBoxDimensions] = useState({
    width: 0,
    height: 0,
  });
  const foodPressed = useSharedValue<boolean>(false);

  const foodTranslateY = useSharedValue(0);
  const foodTranslateX = useSharedValue(0);

  const foodDimensions = { width: 52, height: 22 }; // Dimensions of the food
  const panfood = Gesture.Pan()
    .onBegin(() => {
    })
    .onChange((event) => {
      const foodCurrentX = onPressInfo.x + event.translationX;
      const foodCurrentY = onPressInfo.y + event.translationY;

      if (
        foodCurrentX + foodDimensions.width >= hitBoxPosition.x &&
        foodCurrentX <= hitBoxPosition.x + hitBoxDimensions.width &&
        foodCurrentY + foodDimensions.height >= hitBoxPosition.y + 200 &&
        foodCurrentY <= hitBoxPosition.y + hitBoxDimensions.height
      ) {
        runOnJS(setIsOverHitbox)(true);
      } else {
        runOnJS(setIsOverHitbox)(false);
      }

      foodTranslateX.value = onPressInfo.x + event.translationX;
      foodTranslateY.value = onPressInfo.y + event.translationY;
    })
    .onFinalize(() => {
      foodPressed.value = false;
      runOnJS(setSelectedFood)("");
      if (isOverHitbox) {
        runOnJS(eaten)(selectedFood);
      }

      if (setMood) runOnJS(setMood)("");
      if (!isOverHitbox) {
        foodTranslateX.value = withSpring(onPressInfo.x);
        foodTranslateY.value = withSpring(onPressInfo.y);
      }
  });
  
  function eaten(selectedFood: string) {
    
    let newAllFoods = [...allFoods];
    const foodInstance = newAllFoods.filter(
      (food: IFood) => food.name === selectedFood
    )[0];
    if (foodInstance === undefined) return

    const color = calcFoodColor(foodInstance);
    
    setPerk({
      attribute: "hunger",
      amount: foodInstance.perk,
      operation: "+",
      color: parseInt(color.split(",")[0].split("(")[1]) < 47 ? "#ffc800" : color,
    })
    
    foodInstance.numOwned -= 1;

    if (setAllFoods) setAllFoods(newAllFoods);

    if (attributesDispatch) attributesDispatch({ attribute: "hunger", operation: "+", perk: foodInstance.perk });
  }

  const animatedStyles = useAnimatedStyle(() => ({
    top: foodTranslateY.value + 0,
    left: foodTranslateX.value + 25,
    transform: [
      { translateX: foodPressed.value ? 25 : 0 },
      { translateY: foodPressed.value ? 25 : 0 },
      { scale: withTiming(foodPressed.value ? 1.2 : isOverHitbox ? 0 : 1) },
      { rotate: withTiming(foodPressed.value ? "10deg" : "0deg") },
    ],
  }));

  const [perk, setPerk] = useState<IPerk | undefined>();

  const calcFoodColor = (item: IFood) => `hsl(${((Math.abs(item.perk) / Math.max(...allFoods.map((food) => food.perk))) * 127).toString()}, 70%, 49%)`

  return (
    <GestureHandlerRootView>
      <View>
        <View style={styles.container}>
          {allFoods.map((food: IFood) => { // Using displayFood doesn't work for some reason
            const Image = food.image;
            return (
              <Animated.View
                key={food.name}
                style={[
                  styles.renderedFoodContainer,
                  animatedStyles, {
                    opacity: selectedFood === food.name ? 1 : 0,
                  },
                ]}
              >
                <Image height={50} style={styles.renderedFood} />
              </Animated.View>
            );
          })}
          <View style={styles.top}>
            {/* Render all the display foods, but hide them */}
            <View style={styles.thumbucksContainer}>
              <Text style={styles.thumbucksText}>{thumbucks} </Text>
              <Coin height={30} width={30} style={{}} />
            </View>
            <Text style={styles.title}>Kitchen</Text>
            <Animated.View
              style={styles.monster}
              id="hitBox"
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
                <Monster scaleFactor={0.3} monsterBody={monster} perk={perk} />
              ) : null}
            </Animated.View>
            <View style={[styles.background]}>
              <KitchenBackground
                width="100%"
                height="100%"
                preserveAspectRatio="xMinYMax meet"
              />
            </View>
          </View>
          <View style={styles.bottom}>
            <FlatList
              style={styles.categoryBar}
              data={foodCategories}
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
                      marginRight: index + 1 === foodCategories.length ? 20 : 8,
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
              style={styles.foodList}
              data={displayFood}
              horizontal={true}
              contentContainerStyle={{ alignItems: "center", gap: 10 }}
              renderItem={({ item, index }) => {
                const FoodImage = item.image;
                return (
                  <View style={[styles.foodItem]}>
                    <GestureDetector gesture={panfood}>
                      <Pressable
                        style={styles.foodItemImage}
                        onPressIn={(e) => {
                          setPerk(undefined)
                          if (item === undefined || item.numOwned === undefined ||item.numOwned < 1) return

                          foodPressed.value = true;
                          const [x, y] = [
                            e.nativeEvent.pageX - 60,
                            e.nativeEvent.pageY - 50,
                          ];

                          setSelectedFood(item.name);

                          setOnPressInfo({ x: x, y: y });

                          foodTranslateX.value = x;
                          foodTranslateY.value = y;
                          if (setMood) setMood("Open")
                          console.log("AAAAH")
                        }}
                      >
                        <FoodImage />
                      </Pressable>
                    </GestureDetector>
                    <View style={styles.foodItemTagContainer}>
                      <View
                        style={[
                          {
                            borderTopLeftRadius: 10,
                            borderBottomLeftRadius: 10,
                            backgroundColor: "white",
                            borderWidth: 3,
                            borderRightWidth: 0,
                            borderColor: theme.default.interactionShadow,
                            width: item.numOwned >= 10 ? 50 : 35
                          },
                          styles.foodTag,
                        ]}
                      >
                        <Text style={[styles.foodTagText]}>
                          {item.numOwned || 0}
                        </Text>
                      </View>
                      <View
                        style={[
                          {
                            backgroundColor: calcFoodColor(item),
                            // backgroundColor: `hsl(127, 70%, 49%)`,
                          },
                          styles.foodTag,
                        ]}
                      >
                        <Text style={[styles.foodTagText, styles.white]}>
                          +{item.perk}
                        </Text>
                      </View>
                      <View
                        style={[
                          {
                            display: "flex",
                            flexDirection: "row",
                            gap: 5,
                            backgroundColor: "#B79520",
                          },
                          styles.foodTag,
                        ]}
                      >
                        <Text style={[styles.foodTagText, styles.white]}>
                          {item.price}
                        </Text>
                        <Coin style={styles.coin} />
                      </View>
                      <Pressable
                        style={[styles.foodTag, styles.plusFoodTag]}
                        onPress={() => {
                          if (thumbucks >= item.price) {
                            if (setThumbucks)
                              setThumbucks(thumbucks - item.price);
                            let newAllFoods = [...allFoods];
                            // Find the food that matches the current item's name
                            const itemInstance = newAllFoods.filter(
                              (food: IFood) => food.name === item.name
                            )[0];

                            itemInstance.numOwned += 1;

                            if (setAllFoods) setAllFoods(newAllFoods);
                          }
                        }}
                      >
                        <Text style={[styles.foodTagText, styles.white]}>
                          +
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                );
              }}
            />
          </View>
        </View>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  monster: {
    transform: [{ scale: 0.7 }, { translateY: 20 }],
    zIndex: 2,
    marginTop: "auto",
    height: Dimensions.get("window").height * 0.35,
    resizeMode: "contain",
    position: "relative",
    elevation: 100,
  },
  container: {
    position: "relative",
    height: "96%",
  },
  top: {
    position: "relative",
    flex: 2,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  renderedFoodContainer: {
    // transformOrigin: "50% 50%",
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 50,
  },
  renderedFood: {
    height: 50,
    width: 50,
  },
  thumbucksContainer: {
    position: "absolute",
    top: 30,
    left: 0,
    zIndex: 100,

    backgroundColor: "#D8B125",
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,

    borderWidth: 3,
    borderLeftWidth: 0,
    borderRightWidth: 3,
    borderTopWidth: 3,
    borderBottomWidth: 3,
    borderColor: "#B79520",

    elevation: 20,
  },
  thumbucksText: {
    color: "white",
    fontSize: 24,
    fontFamily: "Poppins_900Black",
    verticalAlign: "bottom",
    textAlignVertical: "center",
    transform: [{ translateY: 3 }],
  },
  title: {
    zIndex: 100,
    color: "white",
    fontSize: 30,
    marginTop: Dimensions.get("window").height * 0.03,
    fontFamily: "Poppins_900Black",
  },
  background: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 567,
    transform: [{ scaleX: 1.01 }],
  },
  bottom: {
    flex: 1.3,
    backgroundColor: "#F3F4F6",
    paddingBottom: 50,
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
  foodList: {
    height: 0,
    paddingLeft: 20,
  },
  foodItem: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    alignItems: "flex-start",
    gap: -10,
    marginRight: 30,
  },
  foodItemImage: {
    width: 100,
    height: "70%",
  },
  foodItemTagContainer: {
    flex: 0.5,
    flexDirection: "row",
    alignItems: "stretch",
  },
  foodTag: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: 40,
    paddingHorizontal: 7,
  },
  foodTagText: {
    fontFamily: "Poppins_900Black",
    fontSize: 21,
    height: 30,
    color: theme.default.interactionShadow,
  },
  white: {
    color: "white",
  },
  plusFoodTag: {
    backgroundColor: "#D8B125",
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    paddingHorizontal: 12,
    // borderWidth: 3,
    // borderColor: "#B79520",
  },
  coin: {},
});

export default Kitchen;
