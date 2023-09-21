import React, { useContext, useState } from 'react';
import { View, Image, Text, ImageSourcePropType, StyleSheet,  } from 'react-native';
import { GlobalContext } from '../../Contexts/GlobalContext';
import { theme } from '../../global';
import { bodyParts } from '../../global';
import Monster from '../Monster';

interface Props {
  
}

const Bedroom = ({  }: Props) => {
    // const { monsterDispatch } = useContext(GlobalContext);

    return (
        <View>
            {/* <Monster/> */}
        </View>
    )
}

export default Bedroom