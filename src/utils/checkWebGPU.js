async function checkWebGPU() {
    if (!navigator.gpu) return false;
    try {
        const adapter = await navigator.gpu.requestAdapter();
        if (!adapter) return false;
        const device = await adapter.requestDevice();
        return !!device;
    } catch (e) {
        return false;
    }
}

export default checkWebGPU;