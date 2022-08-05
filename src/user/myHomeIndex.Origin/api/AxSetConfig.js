import { bridgeReady } from './bridgeReady';

const AxRequest = async function (axConfig) {
    try {
        const { Ax } = await bridgeReady();
        return await Ax.request(axConfig);
    } catch (e) {
        throw e;
    }
};
export default AxRequest;
