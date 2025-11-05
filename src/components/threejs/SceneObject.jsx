import Field from './Field.jsx'
import Wire from '../models/Wire.jsx'
import Prism from '../models/Prism.jsx'
import Sheet from '../models/Sheet.jsx'
import Charge from '../models/Charge.jsx'
import Grid from '../models/Grid.jsx'
import Sphere from '../models/Sphere.jsx'

const COMPONENT_MAP = {
    field: Field,
    wire: Wire,
    prism: Prism,
    sheet: Sheet,
    charge: Charge,
    grid: Grid,
    sphere: Sphere
};

export default function SceneObject({ object, addChargeToObject, ...props }) {
    const Component = COMPONENT_MAP[object.type];
    if (!Component) {
        return null;
    }
    return <Component {...props} {...object} addChargeToObject={addChargeToObject}/>;
}