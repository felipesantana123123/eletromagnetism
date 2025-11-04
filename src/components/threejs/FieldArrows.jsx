import * as THREE from 'three';
import calculateField from '../../utils/calculateField.js';
import Arrow from '../models/Arrow.jsx';
import getFieldVectors from '../../utils/getFieldVectors.js';

export default function FieldArrows({ objects, showOnlyPlane = false, showOnlyGaussianField = false }) {
    const vectors = getFieldVectors(objects, 5, 1, showOnlyPlane, showOnlyGaussianField);
    let MAX_L = 0;
    for (const {field} of vectors){
        const mag = field.length();
        if (mag > MAX_L) MAX_L = mag;
    }

    return (
        <>
        {vectors.map(({position, field}, index) => {
            const mag = field.length();
            const logMag = Math.log1p(mag);
            const logMax= Math.log1p(MAX_L);
            const normalizedMag = Math.min(Math.max(logMag / logMax, 0), 1);
            const hue = (1 - normalizedMag) * 0.66;
            const color = new THREE.Color().setHSL(hue, 1, 0.5).getHex();
            return (<Arrow
                key={index}
                position={position}
                direction={field}
                length={Math.min(Math.log1p(mag), 1)}
                color={color}
            />)
        })}
        </>
    );
}