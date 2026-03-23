import { Buffer } from 'buffer';
import { PermissionsAndroid, Platform } from "react-native";
import { BleManager } from 'react-native-ble-plx';
import Peripheral, { Permission, Property } from 'react-native-multi-ble-peripheral';

export const manager = new BleManager();
let peripheral: Peripheral;

const SERVICE_UUID = "a9e5c53f-169a-43e3-8543-0e86730dde1e";
const CHARACTERISTIC_UUID = "80313cb9-dd2f-45f1-b7d5-896938595556";

export async function requestBluetoothPermission() {
    if (Platform.OS === 'ios') {
        return true
    }
    if (Platform.OS === 'android' && PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION) {
        const apiLevel = parseInt(Platform.Version.toString(), 10)

        if (apiLevel < 31) {
            const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
            return granted === PermissionsAndroid.RESULTS.GRANTED
        }
        if (PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN && PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT) {
            const result = await PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
            ])

            return (
                result['android.permission.BLUETOOTH_CONNECT'] === PermissionsAndroid.RESULTS.GRANTED &&
                result['android.permission.BLUETOOTH_SCAN'] === PermissionsAndroid.RESULTS.GRANTED &&
                result['android.permission.BLUETOOTH_ADVERTISE'] === PermissionsAndroid.RESULTS.GRANTED &&
                result['android.permission.ACCESS_FINE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED
            )
        }
    }

    console.log('Permission have not been granted')

    return false
};

export async function startScanning() {
    console.log("Starting scan!");
    manager.startDeviceScan(null, null, async (error, device) => {
        if (error) {
            console.log(error);
            return
        }

        console.log(device?.name, device?.serviceUUIDs);
        if (device?.serviceUUIDs?.includes(SERVICE_UUID)) {

            console.log(device);
            if (device && device.name !== null && (device.name === "K" || device.name === "Nokia 6.1")) {

                console.log("Connecting to:", device.localName);
                device
                    .connect()
                    .then(device => {
                        return device.discoverAllServicesAndCharacteristics()
                    })
                    .then(device => {
                        manager.stopDeviceScan();

                        // Do work on device with services and characteristics
                        console.log(device);
                        device
                            .readCharacteristicForService(SERVICE_UUID, CHARACTERISTIC_UUID)
                            .then(characteristic => {
                                if (characteristic.value) {
                                    const value = Buffer.from(characteristic.value, "base64");
                                    console.log('Read characteristic value:', value.toString());
                                }
                            })
                            .catch(error => {
                                console.error('Read characteristic error:', error)
                            })
                        return device;
                    })
                    .then(device => {
                        device.cancelConnection();
                    })
                    .catch(error => {
                        // Handle errors
                        console.log(error);
                    })
                console.log("Done reading!")
            }
        }
    })
};

export async function startSharing(name: string) {
    console.log("Starting sharing!");
    // Make sure sharing has properly stopped before starting a new share
    await stopSharing();

    Peripheral.setDeviceName(name);
    peripheral = new Peripheral();

    peripheral.on("ready", async () => {
        console.log("Ready!");
        await peripheral.addService(SERVICE_UUID, true);
        await peripheral.addCharacteristic(
            SERVICE_UUID,
            CHARACTERISTIC_UUID,
            Property.READ | Property.WRITE,
            Permission.READABLE | Permission.WRITEABLE
        );
        await peripheral.updateValue(SERVICE_UUID, CHARACTERISTIC_UUID, Buffer.from("Hello, world!"));
        await peripheral.startAdvertising({
            [SERVICE_UUID]: Buffer.from(""),
        });
        console.log("We're advertising!");
        // TODO: Once the data has been read disconnect/close or whatever its called
    });
};

export async function stopScanning() {
    manager.stopDeviceScan();
    console.log("Stopped scanning!");
};

export async function stopSharing() {
    if (peripheral) {
        await peripheral.stopAdvertising()
            .then(() => peripheral.destroy())
            .catch((error) => {
                console.log(error);
            });
    };
    console.log("Stopped advertising!");
};