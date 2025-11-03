import { useState, useRef } from 'react';
import distributeSheetCharges from '../../utils/distributeSheetCharges.js';
import distributePrismCharges from '../../utils/distributePrismCharges.js';
import distributeWireCharges from '../../utils/distributeWireCharges.js';

export default function useSceneObjects() {
    const [objects, setObjects] = useState([
        { id: 1, type: 'sphere', position: [0, 0, 0], charge: 1, charges: []},
    ]);
    const idRef = useRef(2);
    function addObject(type, isConductor, options = {}) {
        const {
            position = [0, 0, 0],
            charge = 1,
            chargeDensity = 0,
            charges = [],
            dimensions = [1, 1, 1],
            orientation = [0, 0, 0],
        } = options;
        const newObj = {
            id: idRef.current++, 
            isConductor,
            type, 
            position, 
            dimensions, 
            orientation,
            chargeDensity,
            charge,
            charges: [],
        };
        setObjects((prev) => [...prev, newObj]);
    }

    function updateObjectPosition(id, newPosition) {
        setObjects((prev) =>
            prev.map((obj) =>
                obj.id === id ? { ...obj, position: newPosition } : obj
            )
        );
    }
    function removeObject(id) {
        setObjects((prev) => prev.filter((obj) => obj.id !== id));
    }

    function changeObjectCharge(id, newCharge){
        setObjects((prev) => 
            prev.map((obj) => 
                obj.id === id 
                    ? {
                        ...obj, 
                        charge: newCharge, 
                        charges: (obj.charges || []).map(c => ({ 
                          position: c.position ?? c, 
                          charge: newCharge 
                        }))
                      } 
                    : obj
            )
        );
    }

    function setObjectCharges(id, newCharges){
        setObjects((prev) => 
            prev.map((obj) => 
                obj.id === id ? {...obj, charges: newCharges} : obj
            )
        );
    }

    function addChargeToObject(id, chargePosition, chargeValue = 1) {
        setObjects(prev =>
            prev.map(obj =>
            obj.id === id
                ? { ...obj, charges: [...obj.charges, { position: chargePosition, charge: chargeValue }] }
                : obj
            )
        );
    }

    function clearCharges(id) {
        setObjects(prev =>
            prev.map(obj =>
            obj.id === id
                ? { ...obj, charges: [] }
                : obj
            )
        );
    }

    function setNChargesToObject(id, n) {
        setObjects(prev =>
            prev.map(obj => {
                if (obj.id !== id) return obj;
                const totalCharges = Math.abs(n);
                const dims = obj.dimensions || [1, 1, 1];
                let positions = [];
                switch (obj.type) {
                    case 'sphere':
                        break;
                    case 'sheet':
                        positions = distributeSheetCharges(dims[0], dims[1], totalCharges);
                        break;
                    case 'prism':
                        positions = distributePrismCharges(dims[0], dims[1], dims[2], totalCharges);
                        break;
                    case 'wire':
                        positions = distributeWireCharges(dims[1], totalCharges);
                        break;
                    default:
                        positions = [];
                }
                clearCharges(id);
                positions.forEach(pos => addChargeToObject(id, pos, obj.charge));
                return obj;
            }
            )
        );
    }

    return {
        objects,
        addObject,
        updateObjectPosition,
        removeObject,
        changeObjectCharge,
        setObjectCharges,
        addChargeToObject,
        clearCharges,
        setNChargesToObject,
    };
}