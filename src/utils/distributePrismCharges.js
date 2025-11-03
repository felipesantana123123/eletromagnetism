import * as THREE from 'three';

export default function distributePrismCharges(width, height, depth, totalCharges) {
    if (totalCharges <= 0) return [];
    if (totalCharges === 1) return [[0, 0, 0]];

    const positions = Array.from({ length: totalCharges }, () => [
        (Math.random() - 0.5) * width,
        (Math.random() - 0.5) * height,
        (Math.random() - 0.5) * depth
    ]);

    return relaxChargesInBox(positions, width, height, depth);
}

function relaxChargesInBox(initialPositions, width, height, depth, iterations = 1000, step = 0.001, damping = 0.95) {
    const positions = initialPositions.map(p => new THREE.Vector3(...p));
    const velocities = positions.map(() => new THREE.Vector3());
    const n = positions.length;
    const kBoundary = 0.01;

    for (let it = 0; it < iterations; it++) {
        const forces = positions.map(() => new THREE.Vector3());

        for (let i = 0; i < n; i++) {
            for (let j = i + 1; j < n; j++) {
                const dir = new THREE.Vector3().subVectors(positions[i], positions[j]);
                const distSq = Math.max(dir.lengthSq(), 1e-6);
                const fMag = 1 / distSq; 
                const f = dir.normalize().multiplyScalar(fMag);
                forces[i].add(f);
                forces[j].sub(f);
            }
        }

        for (let i = 0; i < n; i++) {
            forces[i].x -= kBoundary * positions[i].x;
            forces[i].y -= kBoundary * positions[i].y;
            forces[i].z -= kBoundary * positions[i].z;

            velocities[i].addScaledVector(forces[i], step);
            velocities[i].multiplyScalar(damping); 
            positions[i].add(velocities[i]);

            positions[i].x = Math.max(-width / 2, Math.min(width / 2, positions[i].x));
            positions[i].y = Math.max(-height / 2, Math.min(height / 2, positions[i].y));
            positions[i].z = Math.max(-depth / 2, Math.min(depth / 2, positions[i].z));
        }
    }

    return positions.map(p => p.toArray());
}