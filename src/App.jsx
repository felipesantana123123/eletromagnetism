import { useRef, useState, useMemo } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import * as THREE from 'three'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { TransformControls } from '@react-three/drei'
import useSceneObjects from './components/ui/useSceneObjects'
import SceneObject from './components/threejs/SceneObject'
import Grid from './components/models/Grid.jsx'
import FieldArrows from './components/threejs/FieldArrows.jsx'
import checkWebGPU from './utils/gpu/checkWebGPU.js'
import parseObjectsToBuffer from './utils/gpu/parseObjectsToBuffer.js'

function App() {

  const [selectedObj, setSelectedObj] = useState(null)
  const [showField, setShowField] = useState(false)
  const [showOnlyGaussianField, setShowOnlyGaussianField] = useState(false)
  const [isConductor, setIsConductor] = useState(false)
  const [creatingGaussianSurface, setCreatingGaussianSurface] = useState(false)
  const [showOnlyPlane, setShowOnlyPlane] = useState(false)
  const orbitRef = useRef()
  const {objects, setInfinite, addObject, updateObjectPosition, removeObject, changeObjectCharge, addChargeToObject, clearCharges, setNChargesToObject} = useSceneObjects()
  const [currCharge, setCurrCharge] = useState(1)
  const [numOfCharges, setNumOfCharges] = useState(0)
  let webGPUavailable = useMemo(() => checkWebGPU(), [])
  
  // dimension inputs (generic: x, y, z). Use appropriately for each model.
  const [dimX, setDimX] = useState(1)
  const [dimY, setDimY] = useState(1)
  const [dimZ, setDimZ] = useState(1)

  const updateSelected = (id) => {
    setSelectedObj((prev) => (prev === id ? null : id))
    setCurrCharge(objects.find((obj) => obj.id === id)?.charge || 1)
    setNumOfCharges(objects.find((obj) => obj.id === id)?.charges.length || 0)
  }

  return (
    <>
      <div id="canvas-container" style={{ width: '100%', height: '100vh', boxSizing: 'border-box', overflow: 'hidden' }}>
        <label style={{ marginLeft: 8 }}>
          <input type="checkbox" checked={isConductor} onChange={(e) => setIsConductor(e.target.checked)} />
          {' '}Conductor
        </label>
        <label style={{ marginLeft: 8 }}>
          <input type="checkbox" checked={showOnlyPlane} onChange={(e) => setShowOnlyPlane(e.target.checked)} />
          {' '}Show only xz plane
        </label>
        <label style={{ marginLeft: 8 }}>
          <input type="checkbox" checked={showOnlyGaussianField} onChange={(e) => setShowOnlyGaussianField(e.target.checked)} />
          {' '}Show only Gaussian Surfaces Fields
        </label>
        <label style={{ marginLeft: 8 }}>
          <input type="checkbox" checked={creatingGaussianSurface} onChange={(e) => setCreatingGaussianSurface(e.target.checked)} />
          {' '}Create as Gaussian Surface
        </label>
        <form onSubmit={(e) => e.preventDefault()} style={{ display: 'inline-block', marginLeft: 8 }}>
          <label style={{ marginRight: 8 }}>
            Charge:
            <input
              name="value"
              type="number"
              step="any"
              value={currCharge}
              onChange={(e) => setCurrCharge(Number(e.target.value))}
              style={{ width: 80, marginLeft: 6 }}
            />
          </label>
          <label style={{ marginRight: 8 }}>
            Number of charges:
            <input
              name="value"
              type="number"
              step="any"
              value={numOfCharges}
              onChange={(e) => setNumOfCharges(Number(e.target.value))}
              style={{ width: 80, marginLeft: 6 }}
            />
          </label>
          <label style={{ marginRight: 8 }}>
            dimX:
            <input type="number" step="any" value={dimX} onChange={(e) => setDimX(Number(e.target.value))} style={{ width: 64, marginLeft: 6 }} />
          </label>
          <label style={{ marginRight: 8 }}>
            dimY:
            <input type="number" step="any" value={dimY} onChange={(e) => setDimY(Number(e.target.value))} style={{ width: 64, marginLeft: 6 }} />
          </label>
          <label>
            dimZ:
            <input type="number" step="any" value={dimZ} onChange={(e) => setDimZ(Number(e.target.value))} style={{ width: 64, marginLeft: 6 }} />
          </label>
        </form>
        <button onClick={() => addObject('charge', false, false, {charge:currCharge})}>Add Charge</button>
        <button onClick={() => {setShowField(!showField)}}>Toggle Field</button>  
        <button onClick={() => addObject('sphere', isConductor, creatingGaussianSurface, { charge: currCharge, dimensions: [dimX, dimY, dimZ] })}>Add Sphere</button>
        <button onClick={() => addObject('wire', isConductor, creatingGaussianSurface, { charge: currCharge, dimensions: [dimX, dimY, dimZ] })}>Add Wire</button>
        <button onClick={() => addObject('prism', isConductor, creatingGaussianSurface, { charge: currCharge, dimensions: [dimX, dimY, dimZ] })}>Add Prism</button>
        <button onClick={() => addObject('sheet', isConductor, creatingGaussianSurface, { charge: currCharge, dimensions: [dimX, dimY] })}>Add Sheet</button>
        <button onClick={() => removeObject(selectedObj)} disabled={selectedObj === null}>Remove Selected</button>

        <button onClick={() => changeObjectCharge(selectedObj, currCharge)} disabled={selectedObj === null}>Change Selected Charge</button>
        <button onClick={() => {clearCharges(selectedObj); setNumOfCharges(0)}} disabled={selectedObj === null}>Clear Selected Charges</button>
        <button onClick={() => {setNChargesToObject(selectedObj, numOfCharges)}} disabled={selectedObj === null}>Set {numOfCharges} Charges on Selected</button>
        <button onClick={() => {setInfinite(selectedObj)}} disabled={selectedObj === null}>Set Selected as Infinite</button>

        <Canvas onPointerMissed={() => setSelectedObj(null)} camera={{ position: [0, 0, 10], fov: 60 }}>
          <color attach="background" args={['black']} />
          <Grid/>
          <ambientLight intensity={0.5} />
          <directionalLight color="white" position={[0, 0, 5]} />
          <OrbitControls ref={orbitRef}/>

          {objects.map((obj) => (
            <SceneObject 
              key={obj.id} 
              object={obj} 
              isSelected={selectedObj === obj.id} 
              onSelect={updateSelected} 
              orbitRef={orbitRef}
              onUpdatePosition={updateObjectPosition}
              onRemove={removeObject}
              onChangeCharge={changeObjectCharge}
              addChargeToObject={(id, position, charge) => {addChargeToObject(id, position, charge); setNumOfCharges(obj?.charges.length + 1 || 0);}}
              clearCharges={clearCharges}
            />
          ))}

          {showField && (
            <FieldArrows objects={objects} showOnlyPlane={showOnlyPlane} showOnlyGaussianField={showOnlyGaussianField}/>
          )}
        </Canvas>
      </div>
    </>
  )
}

export default App
