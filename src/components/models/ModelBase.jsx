import { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { TransformControls } from '@react-three/drei'

export default function ModelBase({
  id,
  position,
  children,           // geometry nodes (e.g. <boxGeometry .../>)
  color = 'white',
  isSelected,
  onSelect,
  isGaussianSurface = false,
  orbitRef,
  onUpdatePosition,
  addChargeToObject,
  clearCharges,
  charges = [],
  isConductor = false,
  charge = 1,
  autoPlaceCharge,
  autoPlaceNCharges,
}) {
  const meshRef = useRef()
  const transformRef = useRef()

  const handleClick = (event) => {
    if (!isSelected) {
      onSelect?.(id)
      return
    }
    if (isGaussianSurface) return
    event.stopPropagation()
    if (isConductor){
        autoPlaceCharge();
        return;
    }
    const worldPoint = event.point?.clone ? event.point.clone() : new THREE.Vector3(event.point.x, event.point.y, event.point.z)
    const localPoint = meshRef.current.worldToLocal(worldPoint)
    addChargeToObject?.(id, [localPoint.x, localPoint.y, localPoint.z], charge)
  }

  return (
    <>
      <mesh ref={meshRef} position={position} onClick={handleClick}>
        {children}
        <meshStandardMaterial side={THREE.DoubleSide} color={color} wireframe={isConductor} opacity={isGaussianSurface ? 0.3 : 1} transparent={isGaussianSurface} />
        {charges?.map((c, idx) => (
          <mesh key={idx} position={c.position}>
            <sphereGeometry args={[0.05, 16, 16]} />
            <meshStandardMaterial color="red" />
          </mesh>
        ))}
      </mesh>

      {isSelected && (
        <TransformControls
          object={meshRef.current}
          mode="translate"
          ref={transformRef}
          onMouseDown={() => { if (orbitRef?.current) orbitRef.current.enabled = false }}
          onMouseUp={() => { if (orbitRef?.current) orbitRef.current.enabled = true }}
          onObjectChange={() => {
            const p = meshRef.current.position
            onUpdatePosition?.(id, [p.x, p.y, p.z])
          }}
        />
      )}
    </>
  )
}