import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Bedroom from "../Rooms/Bedroom";
import LockerRoom from "../Rooms/LockerRoom";
import { IMonsterProp } from "../../global";

export const HomeStack = createStackNavigator();

interface Props {
  monsterProp: IMonsterProp;
}

function HomeStackScreen({ monsterProp }: Props) {
  const navigation = useNavigation();
  return (
    <NavigationContainer independent={true}>
      <HomeStack.Navigator initialRouteName="LockerRoom">
        <HomeStack.Screen name="Home" component={() => <Bedroom navigation={navigation} monsterProp={monsterProp} />} options={{
          headerShown: false
        }}/>
        <HomeStack.Screen name="LockerRoom" component={() => <LockerRoom navigation={navigation} monsterProp={monsterProp} />} 
        options={{
          headerShown: false
        }}/>
      </HomeStack.Navigator>
    </NavigationContainer>
  );
}

export default HomeStackScreen;


// function HomeStackScreen({ monsterProp }: Props) {
//   const navigation = useNavigation();
//   return (
//     <NavigationContainer independent={true}>
//       <HomeStack.Navigator initialRouteName="LockerRoom">
//         <HomeStack.Screen name="Home" component={Bedroom} options={{
//           headerShown: false
//         }} initialParams={{navigation: navigation, monsterProp: monsterProp}}/>
//         <HomeStack.Screen name="LockerRoom" component={LockerRoom} 
//         options={{
//           headerShown: false
//         }} initialParams={{navigation: navigation, monsterProp: monsterProp}}/>
//       </HomeStack.Navigator>
//     </NavigationContainer>
//   );
// }