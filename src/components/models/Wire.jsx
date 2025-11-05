import ModelBase from './ModelBase.jsx'
import distributeWireCharges from '../../utils/distributeWireCharges.js'

export default function Wire(props) {
  const { dimensions = [0.2, 1, 0.2], isSelected, isInfinite} = props
  const color = isSelected ? 'orange' : 'darkorange'
  const height = isInfinite ? 10 : dimensions[1] || 1
  return (
    <ModelBase
      {...props}
      color={color}
      autoPlaceCharge={() => {
        const { id, addChargeToObject, clearCharges, charge, charges = [] } = props
        const length = dimensions[1] || 1
        const total = charges.length + 1
        const newCharges = distributeWireCharges(length, total)
        clearCharges?.(id)
        newCharges.forEach(pos => addChargeToObject?.(id, pos, charge))
      }}
    >
      <cylinderGeometry args={[dimensions[0], dimensions[0], height, 8]} />
    </ModelBase>
  )
}