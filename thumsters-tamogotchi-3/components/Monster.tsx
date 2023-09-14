import React, { useState, useRef, useEffect } from 'react';
import { View, Image, Text, ImageSourcePropType, StyleSheet,  } from 'react-native';
import { theme, Body } from '../global';

interface Props {
    monsterBody: Body,
	mood: string,
}

const Monster = ({ monsterBody, mood }: Props) => {
    const leftArmRef = useRef(null);
    const rightArmRef = useRef(null);
    const leftLegRef = useRef(null);
    const rightLegRef = useRef(null);
    const eyesRef = useRef(null);
    const mouthRef = useRef(null);

    useEffect(() => {
        monsterBody.nodes.leftarm.ref = leftArmRef;
        monsterBody.nodes.rightarm.ref = rightArmRef;
        monsterBody.nodes.rightleg.ref = rightLegRef;
        monsterBody.nodes.leftleg.ref = leftLegRef;
        monsterBody.nodes.eyes.ref = eyesRef;
        monsterBody.nodes.mouth.ref = mouthRef;
    }, [])

    Object.values(monsterBody.nodes).map((bodypart) => {
        bodypart.ref.setNativeProps({
        style: {
            transform: [
                { translateX: bodypart.coords.x },
                { translateY: bodypart.coords.y },
            ],
        },
        });
    })

    return (
        <View>
            <Image ref={leftArmRef} source={monsterBody.nodes.leftarm.bodyPart.image}/>
            <Image ref={rightArmRef} source={monsterBody.nodes.rightarm.bodyPart.image}/>
            <Image ref={leftLegRef} source={monsterBody.nodes.leftleg.bodyPart.image} />
            <Image ref={rightLegRef} source={monsterBody.nodes.rightleg.bodyPart.image}/>
            <Image ref={eyesRef} source={monsterBody.nodes.eyes.bodyPart.image}/>
            <Image ref={mouthRef} source={monsterBody.nodes.mouth.bodyPart.image}/>
        </View>
    )
}

export default Monster