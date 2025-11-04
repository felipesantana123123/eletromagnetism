function parseObjectsToBuffer(objects) {
    const buffer = [];
    for (const obj of objects){
        if(obj.type === 'charge'){
            buffer.push(...obj.position, obj.charge);
        }
        else{
            for (const c of obj.charges){
                buffer.push(
                    obj.position[0] + (c.position?.[0] || 0),
                    obj.position[1] + (c.position?.[1] || 0),
                    obj.position[2] + (c.position?.[2] || 0),
                    c.charge
                );
            }
        }
    }
    return new Float32Array(buffer);
}

export default parseObjectsToBuffer;