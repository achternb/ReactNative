type PermissionCallback = (result: boolean) => void;

interface BluetoothLowEnergyApi {
    requestPermissions(callback: PermissionCallback): Promise<void>;
}

export default function useBLE(): BluetoothLowEnergyApi {
    const requestPermissions = async (callback: PermissionCallback) => {

        callback(true);

    };

    return {
        requestPermissions,
    }
};