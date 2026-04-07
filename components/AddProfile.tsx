import Button from "@/components/Button";
import DBHelper from "@/database/DBHelper";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as ImagePicker from "expo-image-picker";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { Image, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

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
    const [contact, setContact] = useState<any>(null);
    const [selectedFields, setSelectedFields] = useState<{
        phones: any[];
        emails: any[];
        addresses: any[];
        dates: any[];
        socials: any[];
    }>({
        phones: [],
        emails: [],
        addresses: [],
        dates: [],
        socials: [],
    });

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

    function toggleSelection(type: keyof typeof selectedFields, id: any) {
        setSelectedFields(prev => {
            const exists = prev[type].includes(id);
            return {
                ...prev,
                [type]: exists
                    ? prev[type].filter(i => i !== id)
                    : [...prev[type], id],
            };
        });
    }

    async function getUserContact() {
        const id = await SecureStore.getItemAsync("userId");
        if (!id) return null;
        return await DBHelper.getContactObj(id);
    }

    useEffect(() => {
        if (step === 2) {
            (async () => {
                const data = await getUserContact();
                setContact(data);
            })();
        }
    }, [step]);

    const CheckboxRow = ({ text, label, checked, onPress }: any) => (
        <Pressable onPress={onPress} style={{ flexDirection: "row", alignItems: "center", marginVertical: 3 }}>
            <MaterialIcons name={checked ? "check-box" : "check-box-outline-blank"} size={30} color={checked ? "purple" : "#555"} />
            <View style={{ flexDirection: "column", alignItems: "flex-start", marginVertical: 3, flex: 1 }}>
                <Text style={{ flexShrink: 1, paddingLeft: 10 }}>{text}</Text>
                <Text style={{ flexShrink: 1, paddingLeft: 10, color: "#555" }}>{label}</Text>
            </View>
        </Pressable>
    );

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
                            <Button style={styles.footerButton} icon="arrow-forward" type="tertiary" onPress={() => setStep(2)} disabled={!name || !profileIcon || !profileImage} />
                        </View>
                    </View>
                    )}

                    {/* P2 */}
                    {step === 2 && contact && (
                        <View style={{ maxHeight: "91%" }}>
                            <ScrollView showsVerticalScrollIndicator={false} bounces={true} style={{ flexGrow: 1 }}>

                                {/* numbers */}
                                {contact.phoneNumbers?.length > 0 && (
                                    <>
                                        <Text style={styles.label}>Phone Numbers</Text>
                                        {contact.phoneNumbers.map((p: any) => (
                                            <CheckboxRow key={p.id} label={`${p.label}`} text={`${p.number}`}
                                                checked={selectedFields.phones.includes(p.id)} onPress={() => toggleSelection("phones", p.id)} />
                                        ))}
                                    </>
                                )}

                                {/* email */}
                                {contact.emails?.length > 0 && (
                                    <>
                                        <Text style={styles.label}>Emails</Text>
                                        {contact.emails.map((e: any) => (
                                            <CheckboxRow key={e.id} label={`${e.label}`} text={`${e.email}`}
                                                checked={selectedFields.emails.includes(e.id)} onPress={() => toggleSelection("emails", e.id)} />
                                        ))}
                                    </>
                                )}

                                {/* addr */}
                                {contact.addresses?.length > 0 && (
                                    <>
                                        <Text style={styles.label}>Addresses</Text>
                                        {contact.addresses.map((a: any) => (
                                            <CheckboxRow key={a.id} label={`${a.label}`} text={`${a.formattedAddress}`}
                                                checked={selectedFields.addresses.includes(a.id)} onPress={() => toggleSelection("addresses", a.id)} />
                                        ))}
                                    </>
                                )}

                                {/* date */}
                                {contact.dates?.length > 0 && (
                                    <>
                                        <Text style={styles.label}>Dates</Text>
                                        {contact.dates.map((d: any, i: number) => (
                                            <CheckboxRow key={i} label={`${d.label}`} text={`${d.month}/${d.day}/${d.year}`}
                                                checked={selectedFields.dates.includes(i)} onPress={() => toggleSelection("dates", i)} />
                                        ))}
                                    </>
                                )}

                                {/* social profs */}
                                {contact.socialProfiles?.length > 0 && (
                                    <>
                                        <Text style={styles.label}>Social Profiles</Text>
                                        {contact.socialProfiles.map((s: any, i: number) => (
                                            <CheckboxRow key={i} label={`${s.label}`} text={`${s.username}`}
                                                checked={selectedFields.socials.includes(i)} onPress={() => toggleSelection("socials", i)} />
                                        ))}
                                    </>
                                )}
                            </ScrollView>
                            {/* bottom */}
                            <View style={styles.footer}>
                                <Button icon="arrow-back" type="tertiary" onPress={() => setStep(1)} />
                                <View style={{ flex: 1 }} />
                                <Button
                                    icon="check"
                                    type="tertiary"
                                    onPress={async () => {
                                        if (!contact) return;

                                        try {
                                            const profile = await DBHelper.createProfileObj(
                                                contact.id,
                                                name,
                                                profileIcon!,
                                                profileImage!,
                                                [
                                                    ...selectedFields.phones.map(id => {
                                                        const phone = contact.phoneNumbers.find((p: any) => p.id === id);
                                                        return { field_name: phone.label, field_id: phone.id };
                                                    }),
                                                    ...selectedFields.emails.map(id => {
                                                        const email = contact.emails.find((e: any) => e.id === id);
                                                        return { field_name: email.label, field_id: email.id };
                                                    }),
                                                    ...selectedFields.addresses.map(id => {
                                                        const addr = contact.addresses.find((a: any) => a.id === id);
                                                        return { field_name: addr.label, field_id: addr.id };
                                                    }),
                                                    ...selectedFields.dates.map(idx => {
                                                        const date = contact.dates[idx];
                                                        return { field_name: date.label, field_id: idx };
                                                    }),
                                                    ...selectedFields.socials.map(idx => {
                                                        const social = contact.socialProfiles[idx];
                                                        return { field_name: social.label, field_id: idx };
                                                    }),
                                                ]
                                            );
                                            console.log("Profile created:", profile);
                                            setStep(1);
                                            onClose();
                                        } catch (error) {
                                            console.error("Error creating profile:", error);
                                        }
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
        maxHeight: "70%",
        overflow: "hidden",
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
        fontWeight: "bold",
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
        marginTop: 10,
    },
    footerButton: {
        padding: 0,
    },
    scrollContainer: {
        maxHeight: "75%",
    },
});