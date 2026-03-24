import QuickShareDevice from "@/components/QuickShareDevice";
import { startScanning, stopScanning } from "@/utils/sharing";
import * as Bluetooth from 'munim-bluetooth';
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

export default function QuickShareDevices() {
    const [devices, setDevices] = useState<Record<string, Bluetooth.BLEDevice>>({});

    function handlePress(device: Bluetooth.BLEDevice) {
        console.log("Connect to:", device.id);
    }

    useEffect(() => {
        startScanning(setDevices);
        return () => { stopScanning(); }
    }, [])

    return (
        <View style={styles.container}>
            {
                Object.values(devices).map((device) =>
                    <QuickShareDevice
                        key={device.id}
                        device={device.name || "Unknown"}
                        connectionType="bluetooth"
                        // TODO: Fix this
                        onPress={() => handlePress(device)}
                    />
                )
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        alignSelf: "stretch",
    },
});