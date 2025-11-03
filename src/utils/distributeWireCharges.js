
export default function distributeWireCharges(length, total) {
    const newCharges = []

    if (total === 1) {
        newCharges.push([0, 0, 0])
    } else {
        for (let i = 0; i < total; i++) {
        const y = -length / 2 + (i * (length / (total - 1)))
        newCharges.push([0, y, 0])
        }
    }
    return newCharges
}