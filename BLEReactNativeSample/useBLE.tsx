import { useState } from "react";
import { Permission, PermissionsAndroid, Platform } from "react-native";
import { BleManager } from 'react-native-ble-plx';

import DeviceInfo from 'react-native-device-info';

type PermissionCallback = (result: boolean) => void;

const bleManager = new BleManager();

interface BluetoothLowEnergyApi {
    requestPermissions(callback: PermissionCallback): Promise<void>;
    scanForDevices(): void;
    allDevices: Device[];
}

export default function useBLE(): BluetoothLowEnergyApi {
    const [allDevices, setAllDevices] = useState<Device[]>([]);

    const requestPermissions = async (callback: PermissionCallback) => {
        if (Platform.OS === 'android') {
            const grantesStatus = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: 'Location Permission',
                    message: 'Bluetooth Low Energy Needs Location Permission',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'ok',
                    buttonNeutral: 'Maybe Later',
                }
            );
            callback(grantesStatus === PermissionsAndroid.RESULTS.GRANTED);
        } else {
            callback(true);
        }
    };

    const isDuplicateDevice = (devices: Device[], nextDevice: Device) =>
        devices.findIndex(device => nextDevice.id === device.id) > -1;

    const scanForDevices = () => {
        bleManager.startDeviceScan(null, null, (error, device) => {
            if (error) {
                console.log(error);
            }
            if (device && device.name?.includes('CorSense')) {
                setAllDevices(prevState => {
                    if (!isDuplicateDevice(prevState, device)) {
                        return [...prevState, device];
                    }
                    return prevState;
                });
            }
        });
    };

    return {
        requestPermissions,
        scanForDevices,
        allDevices,
    };
}
