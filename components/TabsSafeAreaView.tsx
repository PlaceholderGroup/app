import { SafeAreaView, SafeAreaViewProps } from "react-native-safe-area-context";

export default function TabsSafeAreaView(props: SafeAreaViewProps) {
    return (
        <SafeAreaView edges={["top", "left", "right"]} {...props} style={{ flex: 1 }} />
    );
}