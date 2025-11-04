import ModelBase from './ModelBase.jsx'
import distributeSphereCharges from '../../utils/distributeSphereCharges.js'

export default function Sphere(props) {
  const { dimensions = [1, 1, 1], isSelected } = props
  const color = isSelected ? 'lightgreen' : 'green'
  return (
    <ModelBase {...props} color={color} autoPlaceCharge={() => {
        const { id, addChargeToObject, clearCharges, charge, charges = [] } = props
        const radius = (dimensions[0] || 1)
        const total = charges.length + 1
        const newCharges = distributeSphereCharges(radius, total)
        clearCharges?.(id)
        newCharges.forEach(pos => addChargeToObject?.(id, pos, charge))
    }}>
        <sphereGeometry args={[dimensions[0], 32, 32]} />
    </ModelBase>
  )
}