import React, { useContext, useEffect, useState } from 'react';
import { View, Image, Text, ImageSourcePropType, StyleSheet, Platform,  } from 'react-native';
import { MonsterContext, monsterAction } from '../../Contexts/MonsterContext';
import { theme } from '../../global';
import { bodysInfo, Body, bodyImage } from '../../global';
import Monster from '../Monster';
import BedroomImage from '../../assets/resources/images/Bedroom.png'

interface Props {
  
}

const Bedroom = ({  }: Props) => {
    const { monster, monsterDispatch } = useContext(MonsterContext);
    useEffect(() => {
        if (monsterDispatch) {
            const action: monsterAction = {
                bodyParts: monster?.bodypartnodes,
                bodyImage: bodyImage,
                body: monster
            }
            monsterDispatch(action);
        }
    }, [])

    // console.log(monster)

    // Create a sample body to test
    // const monsterBodyParts = Object.values(bodyParts[1]); // Gets all the body parts of monster '1'
    // let newBody: Body = new Body(
    //     bodyParts[1],
    //     bodyImage
    // ); 

    return (
        <View>
            <Image style={styles.bedroom} source={BedroomImage}></Image>
            <View style={styles.monster}>
                { 
                    monster
                    ? <Monster monsterBody={monster} mood={""}/>
                    : null
                }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    monster: {
        height: '100%',
        width: '100%',
        transform: [{ scale: 0.7 }, { translateY: 100 }],
    },
    bedroom: {
        position: 'absolute',
        top: -150,
        height: '100%',
        width: '100%',
        zIndex: -1,
    }
});

export default Bedroom