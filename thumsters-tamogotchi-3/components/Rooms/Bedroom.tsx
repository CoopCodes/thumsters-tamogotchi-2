import React, { useState } from 'react';
import { View, Image, Text, ImageSourcePropType, StyleSheet,  } from 'react-native';
// import { theme } from '../';
import { bodyParts } from '../../global';

interface Props {
  
}

const Bedroom = ({  }: Props) => {
    return (
        <View>
            <Image source={bodyParts[0].image}></Image>
        </View>
    )
}

export default Bedroom