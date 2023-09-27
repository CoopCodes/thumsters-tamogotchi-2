import React, { useState, useRef, useEffect, Ref, RefObject } from 'react';
import { View, Image, Text, ImageSourcePropType, StyleSheet, findNodeHandle } from 'react-native';
import { theme, Body, bodyPartInfo, bodyParts } from '../global';
import arm from "../assets/resources/Monsters/1/Arm.png";

interface Props {
    monsterBody: Body,
	mood: string,
}

const Monster = ({ monsterBody, mood }: Props) => {
    const leftArmRef = useRef();
    const rightArmRef = useRef();
    const leftLegRef = useRef();
    const rightLegRef = useRef();
    const eyesRef = useRef();
    const mouthRef = useRef();
    
    useEffect(() => {
        monsterBody.nodes.leftarm.ref = leftArmRef;
        monsterBody.nodes.rightarm.ref = rightArmRef;
        monsterBody.nodes.rightleg.ref = rightLegRef;
        monsterBody.nodes.leftleg.ref = leftLegRef;
        monsterBody.nodes.eyes.ref = eyesRef;
        monsterBody.nodes.mouth.ref = mouthRef;
                
        Object.values(monsterBody.nodes).map((bodypart: bodyPartInfo) => {
            if (bodypart.ref !== null && bodypart.bodyPart.node && typeof(bodypart.ref) === 'object' && bodypart.ref.current && bodypart.ref.current.style) {
                // Transform according to image node
                bodypart.ref.current.style.transform = [{ translateX: bodypart.bodyPart.node[0] }, { translateY: bodypart.bodyPart.node[1] }]
                
                // Set proper size
                Image.getSize(bodypart.bodyPart.imagePath, ((width, height) => {
                    if (bodypart.ref !== null && typeof(bodypart.ref) === 'object' && bodypart.ref.current){
                        bodypart.ref.current.style.width = width;
                        bodypart.ref.current.style.height = height;
                    }
                }))
                
                // Apply z-indexing
                bodypart.ref.current.style.
            }
        })
    }, [])

    return (
        <View style={styles.room}>
            <View style={styles.body}>
                <Image ref={monsterBody.nodes.leftarm.ref} style={styles.bodyPart} source={monsterBody.nodes.leftarm.bodyPart.image}/>
                <Image ref={monsterBody.nodes.rightarm.ref} style={styles.bodyPart} source={monsterBody.nodes.rightarm.bodyPart.image}/>
                <Image ref={monsterBody.nodes.leftleg.ref} style={styles.bodyPart} source={monsterBody.nodes.leftleg.bodyPart.image} />
                <Image ref={monsterBody.nodes.rightleg.ref} style={styles.bodyPart} source={monsterBody.nodes.rightleg.bodyPart.image}/>
                <Image ref={monsterBody.nodes.eyes.ref} style={styles.bodyPart} source={monsterBody.nodes.eyes.bodyPart.image}/>
                <Image ref={monsterBody.nodes.mouth.ref} style={styles.bodyPart} source={monsterBody.nodes.mouth.bodyPart.image}/>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    bodyPart: {
        transform: [{ scale: 0.2 }],
        backgroundColor: 'transparent',
        position: 'absolute',
    },
    room: {
        height: '100%',
        width: '100%',
    },
    body: {
        flex: 1,
    }
})

export default Monster