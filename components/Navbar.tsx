import Button from "@/components/Button";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type NavbarProps = {
    canGoBack: boolean,
    onBack?: () => void,
}

export default function Navbar({ canGoBack, onBack }: NavbarProps) {
    return (
        <SafeAreaView edges={["top", "left", "right"]} style={styles.conatiner}>
            {canGoBack && <Button icon="arrow-back-ios-new" type="tertiary" onPress={onBack} />}
            <View style={styles.spacer} />
            <Button icon="edit" type="tertiary" />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    conatiner: {
        display: "flex",
        flexDirection: "row",
        backgroundColor: "rgba(255, 255, 255, 0.50)",
        borderBottomWidth: 1,
        borderBottomColor: "#CCCCCC",
        paddingHorizontal: 10,
        paddingBottom: 4,
        gap: 20,
    },
    spacer: {
        alignSelf: "stretch",
        flex: 1,
    },
})