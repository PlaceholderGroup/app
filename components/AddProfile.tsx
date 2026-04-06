import Button from "@/components/Button";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Image, Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

type AddProfileProps = {
    visible: boolean;
    onClose: () => void;
};

export default function AddProfile({ visible, onClose }: AddProfileProps) {

    const [name, setName] = useState("");
    const [profileIcon, setProfileIcon] = useState<(typeof icons)[number] | null>(null);
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [step, setStep] = useState(1);
    const icons = [
        "face",
        "work",
        "star",
        "favorite",
        "pets",
        "health-and-safety",
        "sports-bar",
        "school",
        "sports-esports",
        "music-note",
        "flight",
        "directions-car",
        "cake",
        "rocket-launch",
    ] as const;

    const pickProfileImage = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
            alert("Permission required to access photos.");
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            quality: 1,
        });
        if (!result.canceled) {
            setProfileImage(result.assets[0].uri);
        }
    };

    return (
        <Modal
            transparent
            animationType="fade"
            visible={visible}
            onRequestClose={onClose}
        >
            <Pressable style={styles.overlay} onPress={() => { setStep(1); onClose(); }}>
                <Pressable style={styles.modal} onPress={() => { }}>

                    {/* Add profile header - top bar */}
                    <View style={styles.header}>
                        <Text style={styles.title}>Add Profile</Text>
                        <Button icon="close" type="tertiary" onPress={() => { setStep(1); onClose(); }} />
                    </View>

                    {/* P1 */}
                    {step === 1 && (<View>

                        <Text style={styles.label}>Profile Image</Text>
                        <View style={styles.imageContainer}>
                            <Pressable onPress={pickProfileImage} style={styles.imagePicker}>
                                {profileImage ? (
                                    <Image source={{ uri: profileImage }} style={styles.profileImage} />
                                ) : (
                                    <MaterialIcons name="add-a-photo" size={30} color="#666" />
                                )}
                            </Pressable>
                        </View>

                        <Text style={styles.label}>Profile Name</Text>
                        <TextInput placeholder="Enter profile name..." value={name} onChangeText={setName} style={styles.input} />

                        <Text style={styles.label}>Profile Icon</Text>
                        <View style={styles.iconGrid}>
                            {icons.map((icon) => (
                                <Pressable key={icon} style={[styles.iconBox, profileIcon === icon && styles.profileIcon]} onPress={() => setProfileIcon(icon)} >
                                    <MaterialIcons name={icon} size={24} />
                                </Pressable>
                            ))}
                        </View>

                        {/* next- to p2 */}
                        <View style={styles.footer}>
                            <View style={{ flex: 1 }} />
                            <Button style={styles.footerButton} icon="arrow-forward" type="tertiary" onPress={() => setStep(2)} disabled={!name || !profileIcon} />
                        </View>
                    </View>
                    )}

                    {/* P2 */}
                    {step === 2 && ( <View>

                        <Text style={styles.label}>tralalalala</Text>

                        {/* back / submit buttons */}
                        <View style={styles.footer}>
                            <Button style={styles.footerButton} icon="arrow-back" type="tertiary" onPress={() => setStep(1)} />
                            <View style={{ flex: 1 }} />
                            <Button style={styles.footerButton} icon="check" type="tertiary"
                                onPress={() => {
                                    // TODO: submit profile stuff idk lol
                                }}
                            />
                        </View>
                    </View>
                    )}

                </Pressable>
            </Pressable>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center",
        alignItems: "center",
    },
    modal: {
        width: "95%",
        backgroundColor: "white",
        borderRadius: 12,
        padding: 10,
        paddingRight: 20,
        paddingLeft: 20,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        // backgroundColor: "red",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
    },
    label: {
        fontSize: 15,
        marginBottom: 5,
        marginTop: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: "#afafaf",
        borderRadius: 8,
        padding: 10,
    },
    iconGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
        marginTop: 10,
        justifyContent: "center",
    },
    iconBox: {
        width: 40,
        height: 40,
        borderWidth: 2,
        borderColor: "#ccc",
        borderRadius: 50,
        justifyContent: "center",
        alignItems: "center",
    },
    profileIcon: {
        borderColor: "purple",
        borderWidth: 2,
    },
    imageContainer: {
        alignItems: "center",
        marginTop: 10,
    },
    imagePicker: {
        width: 80,
        height: 80,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: "#ccc",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
    },
    profileImage: {
        width: "100%",
        height: "100%",
    },
    footer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 20,
    },
    footerButton: {
        padding: 0,
    },
});