import React, { useState } from 'react';
import { View, Image, Text, ImageSourcePropType, StyleSheet,  } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { theme } from '../global';
import { SvgUri } from 'react-native-svg';

interface Props {
  attrName: string;
  image: string;
  progress: number;
}

const Attribute = ({ attrName, image, progress }: Props) => {
  const [progressState, setProgressState] = useState(progress);

  return (

    <View style={styles.attributeMain}>
        <AnimatedCircularProgress
            size={105}
            width={9}
            fill={progress}
            tintColor={theme.default[attrName]}
            backgroundColor={theme.default.interactionShadow}>
                {
                    () => (
                        <SvgUri style={(attrName === "energy")? energyStyles.attrImage : styles.attrImage} uri={image}/>
                    )
                }
            </AnimatedCircularProgress>
    </View>
  );
};

const styles = StyleSheet.create({
  attributeMain: {
    transform: [{ scale: 0.75 }, { rotate: "-90deg" }],
  },
  attrImage: {
    transform: [{ scale: 0.35 }, { rotate: "90deg" }]
  }
});

const energyStyles = StyleSheet.create({
  attrImage: {
    transform: [{ scale: 0.04 }, { rotate: "90deg" }]
  }
})

export default Attribute;