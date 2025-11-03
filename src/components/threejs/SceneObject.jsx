import FieldArrows from './FieldArrows.jsx'
import Wire from '../models/Wire.jsx'
import Prism from '../models/Prism.jsx'
import Sheet from '../models/Sheet.jsx'
import Sphere from '../models/Sphere.jsx'
import Grid from '../models/Grid.jsx'

const COMPONENT_MAP = {
    fieldArrows: FieldArrows,
    wire: Wire,
    prism: Prism,
    sheet: Sheet,
    sphere: Sphere,
    grid: Grid,
};

export default function SceneObject({ object, addChargeToObject, ...props }) {
    const Component = COMPONENT_MAP[object.type];
    if (!Component) {
        return null;
    }
    return <Component {...props} {...object} addChargeToObject={addChargeToObject}/>;
}