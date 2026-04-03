import { Buffer } from 'buffer';
import * as Bluetooth from 'munim-bluetooth';

import { PermissionsAndroid, Platform } from 'react-native';

const SERVICE_UUID = "9209358a-9bd4-4897-bfe4-0b53070ea9b7";
const CHARACTERISTIC_UUID = "80313cb9-dd2f-45f1-b7d5-896938595556";

let deviceId = "";

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
    console.log(name);
    if (await Bluetooth.requestBluetoothPermission()) {
        // TODO: For some reason this doesn't properly update the advertised local name.
        // The other BLE peripheral module does, but instead doesn't broadcast the serviceUUIDs 
        Bluetooth.startAdvertising({
            serviceUUIDs: [SERVICE_UUID],
            localName: name,
        });

        Bluetooth.setServices([{
            uuid: SERVICE_UUID,
            characteristics: [{
                uuid: CHARACTERISTIC_UUID,
                properties: ["read", "notify", "write"],
                value: "Hello, world!",
            }],
        }]);

        // Bluetooth.addEventListener("write", (data) => {
        //     console.log(data);
        // });

        console.log("Advertising!");

    }
};

export async function stopSharing() {
    if (await Bluetooth.requestBluetoothPermission()) {
        Bluetooth.stopAdvertising();
        console.log("No longer advertising!")
    }
}

export async function startScanning(setDevices?: React.Dispatch<React.SetStateAction<Record<string, Bluetooth.BLEDevice>>>) {
    if (await Bluetooth.isBluetoothEnabled() && await Bluetooth.requestBluetoothPermission()) {
        console.log("Adding listener!");
        // TODO: Add some kind of expiry here
        Bluetooth.addDeviceFoundListener(async (device: Bluetooth.BLEDevice) => {
            setDevices?.((prev) => ({
                ...prev,
                [device.id]: device
            }));
        });

        Bluetooth.startScan({ serviceUUIDs: [SERVICE_UUID] });
        console.log("Starting scanning!");
    }
}

export async function connectToDevice(deviceId: string) {
    if (await Bluetooth.isBluetoothEnabled() && await Bluetooth.requestBluetoothPermission()) {
        try {
            await Bluetooth.connect(deviceId);
            console.log("Connected to device:", deviceId);
            Bluetooth.discoverServices(deviceId)
                .then((services) => {
                    console.log(services);
                })
                .then(() => {
                    Bluetooth.readCharacteristic(deviceId, SERVICE_UUID, CHARACTERISTIC_UUID)
                        .then((characteristic) => {
                            console.log("Value:", characteristic.value);
                            const value = Buffer.from(characteristic.value, "hex").toString();
                            console.log(value);
                        })
                        .catch((error) => {
                            console.log("Failed to read characteristic:", error);
                        })
                    Bluetooth.writeCharacteristic(
                        deviceId,
                        SERVICE_UUID,
                        CHARACTERISTIC_UUID,
                        Buffer.from("Hello, sender!", "utf8").toString("hex")
                    );
                })
        } catch (error) {
            console.log("Unable to connect to device:", deviceId, error);
        }
    }
}

// export async function startScanning(onDeviceFound: React.Dispatch<React.SetStateAction<Record<string, Bluetooth.BLEDevice>>>) {
//     if (await Bluetooth.requestBluetoothPermission()) {
//         console.log("Adding listener!");
//         Bluetooth.addDeviceFoundListener(async (device: Bluetooth.BLEDevice) => {
//             console.log(device.id);
//             console.log(device);
//             Bluetooth.stopScan();
//             await Bluetooth.connect(device.id);
//             deviceId = device.id;
//             console.log("Connected", device);
//             Bluetooth.discoverServices(device.id)
//                 .then((services) => {
//                     return services.filter((service) => service.uuid === SERVICE_UUID);
//                 })
//                 .then((services) => {
//                     Bluetooth.readCharacteristic(device.id, SERVICE_UUID, CHARACTERISTIC_UUID)
//                         .then((characteristic) => {
//                             console.log("Value:", characteristic.value);
//                             const value = Buffer.from(characteristic.value, "hex").toString();
//                             console.log(value);
//                         })
//                         .catch((error) => {
//                             console.log("Failed to read characteristic:", error)
//                         })
//                 });
//         });

//         Bluetooth.startScan({ serviceUUIDs: [SERVICE_UUID] });
//         console.log("Starting scanning!");

//     }
// }

export async function stopScanning() {
    if (await Bluetooth.requestBluetoothPermission()) {
        Bluetooth.removeListeners(1);
        Bluetooth.stopScan();
        console.log("Stopped scanning!");
    }
}

export async function disconnect() {
    console.log("Disconnecting from:", deviceId);
    Bluetooth.removeListeners(1);
    Bluetooth.disconnect(deviceId);
    console.log("Disconnected:", deviceId);
    deviceId = "";
}

