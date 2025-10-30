import { useRef, useState, useMemo } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import * as THREE from 'three'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { TransformControls } from '@react-three/drei'

function Sphere({id, position, isSelected, onSelect, orbitRef, onUpdatePosition}) {
  const meshRef = useRef()
  const transformRef = useRef()
  return (
    <>
      <mesh 
        ref={meshRef} 
        position={position} 
        onClick={() => onSelect(id)}
      >
        <sphereGeometry args={[0.2, 32, 32]} />
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

function calculateField(chargePositions, targetPos){
  const multiplier = 5;
  let resultField = new THREE.Vector3(0,0,0);
  for (let chargePos of chargePositions){
    const rVec = new THREE.Vector3().subVectors(targetPos, chargePos);
    const r = rVec.length();
    if (r < 0.1) continue;
    const fieldMagnitude = multiplier / (r * r);
    const fieldVec = rVec.normalize().multiplyScalar(fieldMagnitude);
    resultField.add(fieldVec);
  }
  return resultField;
}

function Arrow({ position, direction, length, color = 0xffff00 }) {
  const arrowHelper = useMemo(() => {
    return new THREE.ArrowHelper(
      direction.clone().normalize(),
      position.clone(),
      length,
      color
    );
  }, [position, direction, length, color]);

  return <primitive object={arrowHelper} />;
}

function FieldArrows({chargePositions}){
  const arrows = []
  for (let x = -5; x <= 5; x += 1){
    for (let y = -5; y <= 5; y += 1){
      for (let z = -5; z <= 5; z += 1){
        const targPos = new THREE.Vector3(x, y, z);
        const field = calculateField(chargePositions, targPos);
        if (field.length() < 0.01) continue
        arrows.push(
          <Arrow 
            key={`${x}-${y}-${z}`} 
            position={targPos} 
            direction={field} 
            length={Math.log1p(field.length()) * 0.5} 
            color={0xffff00} 
          />
        )
      }
    }
  }
  return <>{arrows}</>
}

function App() {
  const [spheres, setSpheres] = useState([{
    id: 1, position: [0,0,0]
  }])

  const [selectedSphere, setSelectedSphere] = useState(null)
  const [showField, setShowField] = useState(false)
  const orbitRef = useRef()
  const idRef = useRef(2)

  function updateSelectedSphere(id) {
    if (selectedSphere === id) {
      setSelectedSphere(null)
    } else {
      setSelectedSphere(id)
    }
  }

  function addSphere() {
    const newSphere = {
      id: idRef.current,
      position: [0,0,0]
    }
    setSpheres([...spheres, newSphere])
    idRef.current += 1
  }

  return (
    <>
      <div id="canvas-container" style={{ width: '100vw', height: '100vh' }}>
        <button onClick={() => addSphere()}>Add Sphere</button>
        <button onClick={() => {setShowField(!showField)}}>Toggle Field</button>
        <Canvas onPointerMissed={() => setSelectedSphere(null)} camera={{ position: [0, 0, 10], fov: 60 }}>
          <color attach="background" args={['black']} />
          <gridHelper args={[10, 10]} />
          <axesHelper args={[5]} />
          <ambientLight intensity={0.5} />
          <directionalLight color="white" position={[0, 0, 5]} />
          <OrbitControls ref={orbitRef}/>

          {spheres.map((sphere) => (
            <Sphere 
              key={sphere.id} 
              id={sphere.id} 
              position={sphere.position} 
              isSelected={selectedSphere === sphere.id} 
              onSelect={(id) => updateSelectedSphere(id)} 
              onUpdatePosition={(id, newPos) => {
                setSpheres(prev =>
                  prev.map(s => s.id === id ? { ...s, position: newPos } : s))
              }}
              orbitRef={orbitRef}
            />
          ))}
          {showField && (
            <FieldArrows 
              chargePositions={spheres.map(s => new THREE.Vector3(...s.position))} 
            />
          )}
        </Canvas>
      </div>
    </>
  )
}

export default App
