import React, { useState, useRef, useEffect, Ref, RefObject } from 'react';
import { View, Image, Text, ImageSourcePropType, StyleSheet, findNodeHandle } from 'react-native';
import { theme, Body, bodyPartInfo, bodysInfo } from '../global';
import BodyPartSVG from './BodyPartSVG';
import { SvgUri } from 'react-native-svg';

interface Props {
    monsterBody: Body,
	mood: string,
}

const Monster = ({ monsterBody, mood }: Props) => {
    const scaleFactor: number = 0.3;

    const leftArmRef = useRef();
    const rightArmRef = useRef();
    const leftLegRef = useRef();
    const rightLegRef = useRef();
    const eyesRef = useRef();
    const mouthRef = useRef();
    
    monsterBody.bodypartnodes.leftarm.ref = leftArmRef;
    monsterBody.bodypartnodes.rightarm.ref = rightArmRef;
    monsterBody.bodypartnodes.leftleg.ref = leftLegRef;
    monsterBody.bodypartnodes.rightleg.ref = rightLegRef;
    monsterBody.bodypartnodes.eyes.ref = eyesRef;
    monsterBody.bodypartnodes.mouth.ref = mouthRef;

    const refs = [leftArmRef, rightArmRef, leftLegRef, rightLegRef, eyesRef, mouthRef];

    function checkBodyPart(part: string): boolean {
        return part === "leftarm" || part === "rightarm" || part === "leftleg" || part === "rightleg" || part === "eyes" || part === "head" || part === "mouth";
    }
    
    useEffect(() => {
        Object.values(monsterBody.bodypartnodes).map((bodypart: bodyPartInfo, i: number) => {
            if (bodypart !== undefined && bodypart.ref !== undefined && bodypart.ref !== null && bodypart.bodyPart.node !== undefined && typeof(bodypart.ref) === 'object' && bodypart.ref.current !== undefined) {
                // if (checkBodyPart(potentialTitle)) {
                // }
                // Returning an array of the all the bodypart titles, as to match it with the current bodypart, and then finds the corresponding node that it should attach to on the body.
                const partTitle = Object.keys(bodysInfo[1].bodyparts)[i] as "leftarm" | "rightarm" | "leftleg" | "rightleg" | "eyes" | "head" | "mouth";    
                
                const node = bodysInfo[1].body[partTitle];
                const bodyNodeCoord: Array<number> = (node !== undefined)? node : [0, 0];
            
                bodypart.ref.current.setNativeProps({
                    style: {
                        transform: [ 
                            { translateX: ((bodyNodeCoord[0] - 35) - (bodypart.bodyPart.node[0] * 1)) }, 
                            { translateY: ((bodyNodeCoord[1] * 1) - (bodypart.bodyPart.node[1] * 1)) },
                            { scaleX: (bodypart.bodyPart.reflected)? -1 : 1 },
                            { scale: (bodypart.bodyPart.node[2] !== undefined)? bodypart.bodyPart.node[2] : 1 }
                        ],
                        width: bodypart.bodyPart.width,
                        height: bodypart.bodyPart.height,
                        zIndex: bodypart.bodyPart.zIndex,
                    }
                });
                };
            })
    }, [monsterBody])

    return (
        <View style={styles.room}>
            <View style={styles.body}>
                {/* {
                    monsterBody.bodyImage?
                        <SvgUri style={[styles.bodyImage, { 
                            width: monsterBody.width, height: monsterBody.height,
                            transform: [
                                { translateX: monsterBody.transforms.x },
                                { translateY: monsterBody.transforms.y },
                                { scale: monsterBody.transforms.scale }
                            ]
                        }]} uri={monsterBody.bodyImage}/> :
                        null
                } */}
                {
                    Object.values(monsterBody.bodypartnodes).filter((bodypart) => bodypart !== undefined).map((bodypart: bodyPartInfo, i: number) => {
                        return (
                            <BodyPartSVG svgPath={bodypart.bodyPart.image} ref={refs[i]}/>
                            // <Image source></Image>
                        );
                    })
                }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    bodyPart: {
        backgroundColor: 'transparent',
        position: 'absolute',
        top: '-50%',
        left: '-50%',
    },
    room: {
        height: '100%',
        width: '100%',
    },
    body: {
        transform: [{ scale: 0.3 }],
        marginTop: -30,
        flex: 1,
    },
    bodyImage: {
        left: '-50%',
        top: '-50%',
        height: '100%',
        width: '100%',
    }
})

export default Monster