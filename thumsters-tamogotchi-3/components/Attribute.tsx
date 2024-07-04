import React, { useState } from 'react';
import { View, Image, Text, StyleSheet,  } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { theme } from '../global';
import { SvgProps } from 'react-native-svg';

interface Props {
  attrName: string;
  Image: React.FC<SvgProps>;
  progress: number;
}

const Attribute = ({ attrName, Image, progress }: Props) => {
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
                        <Image style={(attrName === "energy")? energyStyles.attrImage : styles.attrImage}/>
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