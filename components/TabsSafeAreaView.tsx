import { useHeaderHeight } from "@react-navigation/elements";
import { SafeAreaView, SafeAreaViewProps } from "react-native-safe-area-context";

export default function TabsSafeAreaView(props: SafeAreaViewProps) {

    const headerHeight = useHeaderHeight();

    return (
        <SafeAreaView edges={["left", "right"]} {...props} style={{ flex: 1, marginTop: headerHeight }} />
    );
}