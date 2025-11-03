import * as THREE from 'three';

//gets an array of charges {position: Vector3, charge: number} and a target position Vector3
export default function calculateField(objects, targetPos){
  const multiplier = 5;
  let resultField = new THREE.Vector3(0,0,0);
  for (const obj of objects){
    const position = new THREE.Vector3(...obj.position);
    const charge = obj.charge;
    if (obj.type === 'sphere'){
      const rVec = new THREE.Vector3().subVectors(targetPos, position);
      const rSq = rVec.lengthSq();
      if (rSq < 1e-6) continue;
      const fieldMagnitude = multiplier * charge / rSq;
      resultField.addScaledVector(rVec.normalize(), fieldMagnitude);
    }
    else{
      for (const c of obj.charges){
        const chargePos = new THREE.Vector3(
          position.x + (c.position?.[0] || 0),
          position.y + (c.position?.[1] || 0),
          position.z + (c.position?.[2] || 0),
        );
        const rVec = new THREE.Vector3().subVectors(targetPos, chargePos);
        const rSq = rVec.lengthSq();
        if (rSq < 1e-6) continue;
        const fieldMagnitude = multiplier * c.charge / rSq;
        resultField.addScaledVector(rVec.normalize(), fieldMagnitude);
      }
    }
  }
  return resultField;
}