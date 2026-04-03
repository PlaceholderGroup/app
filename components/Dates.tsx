import * as Contacts from "expo-contacts";
import { StyleSheet, Text, View } from "react-native";

import BirthdayIcon from "./ContactDetailIcons/BirthdayIcon";
import DateIcon from "./ContactDetailIcons/DateIcon";
import ThreeDotsIcon from "./ContactDetailIcons/ThreeDotsIcon";

function formatDate(date: Contacts.Date) {
  if (!date) return "";
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const month = date.month ? months[date.month - 1] : "";
  const day = date.day ?? "";
  const year = date.year ?? "";
  if (year) {
    return `${month} ${day}, ${year}`;
  }
  return `${month} ${day}`;
}

export default function Dates({ birthday, dates }: { birthday?: Contacts.Date, dates?: Contacts.Date[] }) {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>Date</Text>
            <View style={styles.dateContainer}>
                {birthday && (
                    <View key={birthday.id} style={styles.dateItem}>
                        <View style={styles.dateIcon}>
                            <BirthdayIcon/>
                        </View>

                        <View style={styles.dateDetails}>
                            <Text key={birthday.id} style={styles.dateBox}>{formatDate(birthday)}</Text>
                            <Text style={styles.dateType}>Birthday</Text>
                        </View>

                        <View style={styles.dateLabels}>
                            <View style={styles.dateProfileLogos} />
                            <ThreeDotsIcon />
                        </View>
                    </View>
                )}

                {dates?.map((date, index) => (
                    // TODO: some error with duplicate key??
                    <View key={date.id+index.toString()} style={styles.dateItem}>
                        <View style={styles.dateIcon}>
                            <DateIcon/>
                        </View>

                        <View style={styles.dateDetails}>
                            <Text key={date.id+index.toString()} style={styles.dateBox}>{formatDate(date)}</Text>
                            <Text style={styles.dateType}>{date.label}</Text>
                        </View>

                        <View style={styles.dateLabels}>
                            <View style={styles.dateProfileLogos}>
                                {/* TODO: profile icons this date is linked to */}
                            </View>
                            <ThreeDotsIcon/>
                        </View>
                    </View>
                ))
            }
            </View>
        </View>
    );
}

// NOTE: These styles are by no means final.

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    label: {
        fontWeight: 500,
        fontSize: 20,
        padding: 10,
    },
    dateContainer: {
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "lightgray",
        backgroundColor: "white",
        overflow: "hidden",
        padding: 10,
        flexDirection: "column",
        alignItems: "flex-start",
        paddingVertical: 25,
        paddingHorizontal: 20,
        gap: 20,
        alignSelf: "stretch",
    },
    dateItem: {
        display: "flex",
        alignItems: "flex-start",
        flexDirection: "row",
        gap: 20,
        alignSelf: "stretch",
    },
    dateIcon: {
        width: 24,
        height: 24,
        aspectRatio: 1/1,
    },
    dateDetails: {
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 5,
        flex: 1,
    },
    dateLabels: {
        gap: 10,
        alignItems: "center",
        flexDirection: "row",
    },
    dateBox: {
        alignSelf: "stretch",
        color: "#000",
        fontSize: 16,
        fontStyle: "normal",
        fontWeight: "500",
        lineHeight: 16 * 1.15,
        textTransform: "capitalize",
    },
    dateType: {
        alignSelf: "stretch",
        color: "#000",
        fontSize: 14,
        fontStyle: "normal",
        fontWeight: "400",
        lineHeight: 16 * 1.15,
        textTransform: "capitalize",
    },
    dateProfileLogos: {
        gap: -8,
        alignItems: "flex-start",
    }
})