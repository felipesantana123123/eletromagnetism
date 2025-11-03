import * as THREE from 'three';
import calculateField from './calculateField';

export default function getFieldVectors(objects, gridSize = 5, step = 1, showOnlyPlane = false) {
  const fieldVectors = [];
  const yLevel = showOnlyPlane ? 0 : gridSize;
  step = showOnlyPlane ? step / 1 : step;
  for (let x = -gridSize; x <= gridSize; x += step) {
    for (let y = -yLevel; y <= yLevel; y += step) {
      for (let z = -gridSize; z <= gridSize; z += step) {
        const targetPos = new THREE.Vector3(x, y, z);
        const field = calculateField(objects, targetPos);
        fieldVectors.push({ position: targetPos, field });
      }
    }
  }
  return fieldVectors;
}