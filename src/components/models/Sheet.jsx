import * as THREE from 'three'
import ModelBase from './ModelBase.jsx'
import distributeSheetCharges from '../../utils/distributeSheetCharges.js'

export default function Sheet(props) {
  const { dimensions = [1, 1], isSelected, isInfinite } = props
  const color = isSelected ? 'lightblue' : 'skyblue'
  const height = isInfinite ? 10 : dimensions[1] || 1
  const width = isInfinite ? 10 : dimensions[0] || 1
  return (
    <ModelBase {...props} color={color} autoPlaceCharge={() => {
        const { id, addChargeToObject, clearCharges, charge, charges = [] } = props
        const width = dimensions[0] || 1
        const height = dimensions[1] || 1
        const total = charges.length + 1
        const newCharges = distributeSheetCharges(width, height, total)
        clearCharges?.(id)
        newCharges.forEach(pos => addChargeToObject?.(id, pos, charge))
    }}>
      <planeGeometry args={[width, height]} />
    </ModelBase>
  )
}