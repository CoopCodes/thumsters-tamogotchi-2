import React from 'react';
import { useState, useEffect } from 'react';
import { styled, keyframes, css } from 'styled-components/native';
import { MonsterClass, onFoodClickEvent, FoodClass } from '../global';

interface MonsterObj {
    focusMonster: MonsterClass,
    monstersState: MonsterClass[],
    setMonstersState: React.Dispatch<React.SetStateAction<MonsterClass[]>>
}

interface Props { 
    foodItem: FoodClass;
    monster: MonsterObj;
    enabledState: boolean;
    setEnabledState: (bool: boolean) => void;
    OnClickEvent?: onFoodClickEvent;
}

// Styled Components:

const Button = styled.View<{enabled: boolean}>`
    position: relative;
    height: 9em;
    width: 9em;
    filter: ${(props) => props.enabled? 'saturate(100%)' : 'saturate(0%)'};
`

const Icon = styled.Image`
    width: 60%;
    height: 60%;
    z-index: 1;
`

const FoodPerkContainer = styled.View`
    width: 80%;
    height: 20px;
    border-radius: 30px;
    overflow: hidden;
    background-color: ${(props) => props.colorTheme.default.interactionShadow};
    `

const FoodPerk = styled.View<{perk: number}>`
    width: ${(props) => ((props.perk / 30) * 100)}%; // Making the bar as wide as proportional to 30
    background-color: #F3AD61;
    background-color: ${(props) => props.colorTheme.default.hunger};
    height: 100%;
    border-radius: 0 20px 20px 0;
`

const onClickAnimation = keyframes<{setClickedState: React.Dispatch<React.SetStateAction<boolean>>}>`
    0% { transform: translate(20px, -20px); opacity: 0; z-index: 1; }
    50% { transform: translate(60px, -50px); opacity: 1; z-index: 1; }
    100% {
        transform: translate(20px, -20px); opacity: 0; z-index: -1;
    }
`

const FoodPerkText = styled.Text<{clicked: boolean}>`
    position: absolute;
    z-index: 2;
    font-family: 'Poppins', sans-serif;
    color: white;
    opacity: 0;
    z-index: -1;
    transition: all 0.5s ease-in-out;
    ${(props) => (props.clicked)? css`animation: ${onClickAnimation} .7s ease-in-out;` : ''}
`


const Container = styled.View`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    scale: 0.9;
`

const Food = ({ monster, OnClickEvent, enabledState, setEnabledState, foodItem }: Props) => {
    const [clicked, setClickedState] = useState(false);
    const attribute = 'hunger';


    // Passing in an object with all the monster information, so when clicked, it can update the focus monster, and then update the main UseState Monsters, using setMonsterState, similar to when decreasing the monsters hunger every x seconds.
    function Click() {
        if (enabledState) {
            setClickedState(true);
            if (OnClickEvent) {
                OnClickEvent(foodItem.perk); 
                if (attribute === undefined)
                return
            }
        }
    }

    return (
        <Container>
            <Button onClick={() => Click()} enabled={enabledState}>
                <Container>
                    <Icon src={foodItem.iconPath}/>
                    <FoodPerkContainer>
                        <FoodPerk perk={foodItem.perk}/>
                    </FoodPerkContainer>
                    <FoodPerkText clicked={clicked} onAnimationEnd={() => {
                        setClickedState(false)
                    }}>+{foodItem.perk}</FoodPerkText>
                </Container>
            </Button>
        </Container>
    );
};

export default Food;