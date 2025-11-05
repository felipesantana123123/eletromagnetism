// charge - 0
// infinite wire - 1
// infinite sheet - 2

export default function parseObjectsToBuffer(objects) {
    const buffer = [];
    for (const obj of objects){
        if(obj.type === 'charge'){
            buffer.push(...obj.position, obj.charge, 0);
        }
        else if(obj.isInfinite){
            switch(obj.type){
                case 'wire':
                    buffer.push(...obj.position, obj.charge, 1);
                    break;
                case 'sheet':
                    buffer.push(...obj.position, obj.charge, 2);
                    break;
            }
        }
        else{
            for (const c of obj.charges){
                buffer.push(
                    obj.position[0] + (c.position?.[0] || 0),
                    obj.position[1] + (c.position?.[1] || 0),
                    obj.position[2] + (c.position?.[2] || 0),
                    c.charge,
                    0
                );
            }
        }
    }
    return new Float32Array(buffer);
}