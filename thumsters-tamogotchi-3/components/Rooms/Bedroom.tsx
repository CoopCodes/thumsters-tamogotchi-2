import React, { useContext, useState } from 'react';
import { View, Image, Text, ImageSourcePropType, StyleSheet,  } from 'react-native';
import { MonsterContext } from '../../Contexts/MonsterContext';
import { theme } from '../../global';
import { bodyParts, Body, bodyImage } from '../../global';
import Monster from '../Monster';

interface Props {
  
}

const Bedroom = ({  }: Props) => {
    const { monster, monsterDispatch } = useContext(MonsterContext);
    // Create a sample body to test
    const monsterBodyParts = Object.values(bodyParts[1]);
    let newBody: Body = new Body(
        bodyParts[1],
        bodyImage
    );

    return (
        <View>
            { 
                monster
                ? <Monster monsterBody={monster} mood={""}/>
                : null
            }
        </View>
    )
}

export default Bedroom