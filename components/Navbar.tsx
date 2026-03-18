import Button from "@/components/Button";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


export default function Navbar() {
    return (
        <SafeAreaView edges={["top", "left", "right"]} style={styles.conatiner}>
            <Button icon="arrow-back-ios" type="tertiary" />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    conatiner: {
        display: "flex",
        flexDirection: "row",
        backgroundColor: "#FF00001D",
        position: "sticky",
        width: "100%",
    }
})