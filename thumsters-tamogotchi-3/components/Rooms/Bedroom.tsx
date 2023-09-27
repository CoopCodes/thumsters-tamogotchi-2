import React, { useContext, useState } from 'react';
import { View, Image, Text, ImageSourcePropType, StyleSheet,  } from 'react-native';
import { MonsterContext, monsterAction } from '../../Contexts/MonsterContext';
import { theme } from '../../global';
import { bodyParts, Body, bodyImage } from '../../global';
import Monster from '../Monster';
import body from '../../assets/resources/Monsters/1/Body.png'

interface Props {
  
}

const Bedroom = ({  }: Props) => {
    const { monster, monsterDispatch } = useContext(MonsterContext);
    if (monsterDispatch) {
        const action: monsterAction = {
            bodyParts: monster?.nodes,
            bodyImage: body,
            body: monster
        }
        monsterDispatch(action);
    }

    // console.log(monster)

    // Create a sample body to test
    const monsterBodyParts = Object.values(bodyParts[1]); // Gets all the body parts of monster '1'
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