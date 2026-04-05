import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { StyleSheet, TextInput, TextInputProps, View } from "react-native";



export default function SearchBar({ ...rest }: TextInputProps) {
    return (
        <View style={[
            styles.container,
        ]}>
            <MaterialIcons name="search" size={24} style={styles.icon} />
            <TextInput
                clearButtonMode="while-editing"
                style={styles.textBox}
                {...rest}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "row",
        paddingLeft: 20,
        backgroundColor: "rgba(255, 255, 255, 1)",
        borderColor: "#CCCCCC",
        borderWidth: 1,
        borderRadius: 30,
        alignItems: "center",
        gap: 10,
        flex: 1,
    },
    textBox: {
        flex: 1,
        height: 60,
        margin: 0,
        padding: 0,
        color: "#626262",
        fontFamily: "Lexend_400Regular",
        fontWeight: 400,
        fontSize: 16,
    },
    icon: {
        color: "#626262",
    }
});