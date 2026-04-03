
import Button from "@/components/Button";
import TabsSafeAreaView from "@/components/TabsSafeAreaView";
import { disconnect, requestBluetoothPermission, startScanning, startSharing, stopScanning, stopSharing } from "@/utils/sharing";
import { StyleSheet, View } from "react-native";

export default function TestScreen() {
    return (
        <TabsSafeAreaView>
            <View style={styles.body}>
                <Button title="Request Bluetooth permissions" icon="bluetooth" onPress={requestBluetoothPermission} />
                <Button title="Start advertising" icon="play-arrow" onPress={() => startSharing("Kevin")} />
                <Button title="Stop advertising" icon="stop" onPress={stopSharing} />
                <Button title="Start scanning" icon="play-arrow" onPress={() => startScanning()} />
                <Button title="Stop scanning" icon="stop" onPress={stopScanning} />
                <Button title="Disconnect" icon="bluetooth-disabled" onPress={disconnect} />
            </View>
        </TabsSafeAreaView>
    )
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
        gap: 10,
        padding: 10,
    },
});
