import  { useRef } from 'react'
import { TransformControls } from '@react-three/drei'

export default function Charge({id, position, isSelected, onSelect, orbitRef, onUpdatePosition}) {
  const meshRef = useRef()
  const transformRef = useRef()
  return (
    <>
      <mesh 
        ref={meshRef} 
        position={position} 
        onClick={() => onSelect(id)}
      >
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshStandardMaterial color={isSelected ? 'blue' : 'white'} />
      </mesh>
      {isSelected && (
        <TransformControls
          object={meshRef.current}
          mode="translate"
          ref={transformRef}
          onMouseDown={() => {
            if (orbitRef.current) orbitRef.current.enabled = false
          }}
          onMouseUp={() => {
            if (orbitRef.current) orbitRef.current.enabled = true
          }}
          onObjectChange={() => {
            const newPos = meshRef.current.position;
            onUpdatePosition(id, [newPos.x, newPos.y, newPos.z]);
          }}
        />
      )}
    </>
  )
}