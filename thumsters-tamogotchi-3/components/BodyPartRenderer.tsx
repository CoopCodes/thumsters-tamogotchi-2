import { View } from "react-native";
import arm from "./assets/resources/Monsters/1/Arm.png";
import body from "./assets/resources/Monsters/1/Body.png";
import eyes from "./assets/resources/Monsters/1/Eye.png";
import foot from "./assets/resources/Monsters/1/Foot.png";
import mouth from "./assets/resources/Monsters/1/Mouth.png";
import node from "./assets/resources/Monsters/1/Nodenode.png";  

interface Props {
  bodyPart: ImageSourcePropType,
}

const Attribute = ({ bodyPart }: Props) => {

  return (
    <View>
        <Image source={arm}/>
    </View>
  );
};

export default Attribute;