export default function parseSamplePointsToBuffer(samplePoints) {
    const buffer = [];
    for (const point of samplePoints){
        buffer.push(...point);
    }
    return new Float32Array(buffer);
}