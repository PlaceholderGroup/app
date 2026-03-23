import * as Bluetooth from 'munim-bluetooth';

import { PermissionsAndroid, Platform } from 'react-native';

export async function requestBluetoothPermission() {
    if (Platform.OS === 'android' && Platform.Version >= 31) {
        const result = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN
        ]);
        console.log("CONNECT", result);
        // return result === PermissionsAndroid.RESULTS.GRANTED;
    }
    console.log("huh", true);
    return true; // For older versions or other platforms
};

export async function startSharing(name: string) {
    if (await Bluetooth.requestBluetoothPermission()) {
        Bluetooth.startAdvertising({
            serviceUUIDs: ["9209358a-9bd4-4897-bfe4-0b53070ea9b7"],
            localName: name,
        });

        Bluetooth.setServices([{
            uuid: "9209358a-9bd4-4897-bfe4-0b53070ea9b7",
            characteristics: [{
                uuid: "80313cb9-dd2f-45f1-b7d5-896938595556",
                properties: ["read", "notify"],
                value: "Hello, world!",
            }],
        }]);
        console.log("Advertising!");

    }
};

export async function stopSharing() {
    if (await Bluetooth.requestBluetoothPermission()) {
        Bluetooth.stopAdvertising();
        console.log("No longer advertising!")
    }
}

export async function startScanning() {
    if (await Bluetooth.requestBluetoothPermission()) {
        console.log("Adding listener!");
        Bluetooth.addDeviceFoundListener(async (device: Bluetooth.BLEDevice) => {
            console.log(device);
            Bluetooth.stopScan();
            await Bluetooth.connect(device.id);
            console.log("Connected", device);
            Bluetooth.discoverServices(device.id)
                .then((services) => {
                    console.log(services);
                })
        });

        Bluetooth.startScan({ serviceUUIDs: ["9209358a-9bd4-4897-bfe4-0b53070ea9b7"] });
        console.log("Starting scanning!");

    }
}

export async function stopScanning() {
    if (await Bluetooth.requestBluetoothPermission()) {
        Bluetooth.stopScan();
        console.log("Stopped scanning!");
    }
}

