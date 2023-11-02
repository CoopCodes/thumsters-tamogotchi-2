import React, { Ref } from "react";
import { useState, useEffect } from "react";
import { View, Image, StyleSheet } from "react-native";
import { SvgUri } from "react-native-svg";
import { Svg } from "../customHooks/useDynamicSVGImport";

interface Props {
  svgPath: string;
  width?: number | undefined;
  height?: number | undefined;
  ref: Ref<any>;
}

const BodyPartSVG = ({ svgPath, width, height, ref }: Props) => {
  return (
    <View ref={ref}>
      {/* <SvgUri uri={svgPath} width={(width)? width: ""} height={(height)? height: ""}/> */}
      {/* <Svg
        path={svgPath}
        fill="gray"
      /> */}
      <Image source={{uri: require('../assets/favicon.png')}}/>
      {/* <Image source={{uri: 'file:///../assets/resources/Monsters/1/Arm.png'}}/> */}
      {/* <Image source={{uri:'https://engineering.fb.com/wp-content/uploads/2016/04/yearinreview.jpg'}}/> */}
    </View>
  );
};

const styles = StyleSheet.create({});

export default BodyPartSVG;
