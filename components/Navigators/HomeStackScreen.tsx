import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Bedroom from "../Rooms/Bedroom";
import LockerRoom from "../Rooms/LockerRoom";

export const HomeStack = createStackNavigator();

function HomeStackScreen() {
  return (
    <NavigationContainer independent={true}>
      <HomeStack.Navigator initialRouteName="LockerRoom">
        <HomeStack.Screen name="Home" component={Bedroom} options={{
          headerShown: false
        }}/>
        <HomeStack.Screen name="LockerRoom" component={LockerRoom} 
        options={{
          headerShown: false
        }}/>
      </HomeStack.Navigator>
    </NavigationContainer>
  );
}

export default HomeStackScreen;