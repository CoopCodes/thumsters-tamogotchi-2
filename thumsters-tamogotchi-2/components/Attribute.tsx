import { useState } from 'react';
import { Image, ImageSourcePropType } from 'react-native';
import { styled } from 'styled-components/native';

interface Props { 
    attrName: string; 
    image: ImageSourcePropType;
    progress: number;
}

// Styled Components:
const AttributeMain = styled.View`
transform: scale(0.7);
display: flex;
width: 420px;
padding: 50px 0;    
border-radius: 8px; 
row-gap: 30px;
flex-direction: column;
align-items: center;
`

const CircularProgress = styled.View<{progress: number, attrName: string}>`
position: relative;
height: 250px;
width: 250px;
border-radius: 50%;
background: conic-gradient(${(props) => props.theme.default[props.attrName]} ${(props) => (props.progress * 3.6)}deg, rgba(250, 250, 250, 0) 0deg);
display: flex;
align-items: center;
justify-content: center;
`

const ProgressImage = styled(Image)`
position: relative;
width: 50%;
height: 50%;
`

const Attribute = ({ attrName, image, progress }: Props) => {
    const [progressState, SetProgressState] = useState(progress);    
    // const imageSource = require(imagePath);

    return (
        <AttributeMain>
            <CircularProgress progress={progress} attrName={attrName}>
                <ProgressImage source={image} alt={attrName} />
            </CircularProgress>
        </AttributeMain>
    );
};

export default Attribute;