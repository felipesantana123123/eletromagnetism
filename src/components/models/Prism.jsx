import ModelBase from './ModelBase.jsx'
import distributePrismCharges from '../../utils/distributePrismCharges.js'

export default function Prism(props) {
  const { dimensions = [1, 1, 1], isSelected } = props
  const color = isSelected ? 'lightgreen' : 'green'
  return (
    <ModelBase {...props} color={color} autoPlaceCharge={() => {
        const { id, addChargeToObject, clearCharges, charge, charges = [] } = props
        const width = dimensions[0] || 1
        const height = dimensions[1] || 1
        const depth = dimensions[2] || 1
        const total = charges.length + 1
        const newCharges = distributePrismCharges(width, height, depth, total)
        clearCharges?.(id)
        newCharges.forEach(pos => addChargeToObject?.(id, pos, charge))
    }}>
      <boxGeometry args={[dimensions[0], dimensions[1], dimensions[2]]} />
    </ModelBase>
  )
}