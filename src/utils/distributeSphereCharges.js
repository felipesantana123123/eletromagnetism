import * as THREE from 'three'

export default function distributeSphereCharges(radius = 0.5, totalCharges = 1, opts = {}) {
  const iterations = opts.iterations ?? 400
  const step = opts.step ?? 0.01
  const damping = opts.damping ?? 0.98
  const eps = 1e-6

  if (totalCharges <= 0) return []
  if (totalCharges === 1) return [[0, 0, 0]]

  const points = []
  const offset = 2 / totalCharges
  const increment = Math.PI * (3 - Math.sqrt(5))
  for (let i = 0; i < totalCharges; i++) {
    const y = ((i * offset) - 1) + (offset / 2)
    const r = Math.sqrt(Math.max(0, 1 - y * y))
    const phi = i * increment
    const x = Math.cos(phi) * r
    const z = Math.sin(phi) * r
    points.push(new THREE.Vector3(x * radius, y * radius, z * radius))
  }

  const velocities = points.map(() => new THREE.Vector3())

  for (let it = 0; it < iterations; it++) {
    const forces = points.map(() => new THREE.Vector3())
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const dir = new THREE.Vector3().subVectors(points[i], points[j])
        const distSq = Math.max(dir.lengthSq(), eps)
        const fMag = 1 / distSq
        dir.normalize().multiplyScalar(fMag)
        forces[i].add(dir)
        forces[j].sub(dir)
      }
    }

    for (let i = 0; i < points.length; i++) {
      const p = points[i]
      const f = forces[i]
      const radial = p.clone().normalize()
      const f_t = f.clone().sub(radial.clone().multiplyScalar(f.dot(radial)))
      velocities[i].addScaledVector(f_t, step)
      velocities[i].multiplyScalar(damping)

      p.add(velocities[i])

      if (p.lengthSq() > eps) p.setLength(radius)
      else p.set(radius, 0, 0)
    }
  }

  return points.map(p => [p.x, p.y, p.z])
}