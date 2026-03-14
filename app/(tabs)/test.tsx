
import Button from "@/components/Button";
import { StyleSheet, View } from "react-native";
import TabsSafeAreaView from "../../components/TabsSafeAreaView";

export default function TestScreen() {
    return (
        <TabsSafeAreaView>
            <View style={styles.body}>
                <Button></Button>
            </View>
        </TabsSafeAreaView>
    )
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
  },
});
