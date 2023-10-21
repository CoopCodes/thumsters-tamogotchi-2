import React, { useContext, useEffect, useState } from 'react';
import { View, Image, Text, ImageSourcePropType, StyleSheet, Platform, ScrollView, Button,  } from 'react-native';
import { MonsterContext, monsterAction } from '../../Contexts/MonsterContext';
import { BodyPart, categories, theme } from '../../global';
import { bodysInfo, Body, bodyImage } from '../../global';
import Monster from '../Monster';
import BedroomImage from '../../assets/resources/images/Bedroom.png'
import ListBodyPart from '../ListBodyPart';

interface Props {

}

const LockerRoom = ({  }: Props) => {
    // Monster Initialization
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

    const [displayBodyParts, setDisplayBodyParts] = useState<BodyPart[]>([]);


    type Categories = typeof categories[number]
    
    // Function when conditions are pressed
    const CategoryClick = (category: Categories) => {
        // Clearing the current array
        setDisplayBodyParts([]);
        // Getting all bodyparts, given the category, 
        // and updating the displayBodyParts array.
        displayBodyParts.filter((bodyPartToTest: BodyPart) => 
            bodyPartToTest.category === category)
            .map((bodyPart: BodyPart) => {
                setDisplayBodyParts([...displayBodyParts, bodyPart])	
        });
    }

    CategoryClick('Bodys'); // Calling function to actually show the bodyparts

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
            <View> // List of bodyparts
                <View> // Category buttons
                    {
                        categories.map((category: 'Bodys' | 'Heads' | 'Eyes' | 'Mouths' | 'Faces' | 'Arms' | 'Legs') => {
                            return (<Button title={category} onPress={() => CategoryClick(category)}/>)

                        })
                    }
                </View>
                <ScrollView> // List BodyParts
                    {
                        displayBodyParts.map((bodyPart) => {
                            return (
                                <ListBodyPart bodypart={bodyPart}/>
                            )
                        })
                    }                
                </ScrollView>
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

export default LockerRoom