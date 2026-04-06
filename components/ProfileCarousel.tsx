import { profileObj } from "@/database/DBHelper";
import * as Contacts from "expo-contacts";
import React, { useEffect, useRef } from "react";
import { Animated, Dimensions, StyleSheet, View } from "react-native";
import Avatar from "./Avatar";

const { width } = Dimensions.get("window");

const ITEM_SIZE = 150;
const SPACING = 0;
const FULL_ITEM_SIZE = ITEM_SIZE + SPACING * 2;

const SIDE_SPACING = (width - ITEM_SIZE) / 2;

export default function ProfileCarousel({ profiles, onProfileFocus, setProfileIndex }: { profiles: profileObj[]; onProfileFocus?: (profile: Contacts.ExistingContact, index: number) => void; setProfileIndex: React.Dispatch<React.SetStateAction<number>> }) {
  const scrollX = useRef(new Animated.Value(0)).current;

  // Track previously focused index to prevent duplicate calls
  const currentIndex = useRef(0);

  //const profileContacts = [contact, contact, contact, contact];
  ////////////////////////////////////////////////////////////////////////////////////////////////

  ///// Empty function that is called when a profile changes /////
  ///// provides the data of the selectd pofile              /////
  const _onProfileFocus = (
    profile: Contacts.ExistingContact,
    index: number
  ) => {
    onProfileFocus?.(profile, index);
    setProfileIndex(index);
    console.log("Focused profile:", profile.name, "at index:", index);
    // TODO: Add logic here
  };
  /////////////////////////////////////////////////////////////////

  // Listen to scrollX changes for live focus detection
  useEffect(() => {
    const listener = scrollX.addListener(({ value }) => {
      const index = Math.round(value / FULL_ITEM_SIZE);

      if (index !== currentIndex.current) {
        currentIndex.current = index;

        const focusedProfile = profiles[index];
        if (focusedProfile) {
          _onProfileFocus(focusedProfile.contact, index);
        }
      }
    });

    return () => {
      scrollX.removeListener(listener);
    };
  }, [scrollX, profiles]);

  return (
    <View style={styles.carousel}>
      <Animated.FlatList
        data={profiles}
        keyExtractor={(_, i) => i.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={FULL_ITEM_SIZE}
        decelerationRate="fast"
        bounces={false}
        contentContainerStyle={{
          paddingHorizontal: SIDE_SPACING,
        }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        renderItem={({ item, index }) => {
          const inputRange = [
            (index - 1) * FULL_ITEM_SIZE,
            index * FULL_ITEM_SIZE,
            (index + 1) * FULL_ITEM_SIZE,
          ];

          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.85, 1, 0.85],
            extrapolate: "clamp",
          });

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.5, 1, 0.5],
            extrapolate: "clamp",
          });

          return (
            <Animated.View
              style={[
                styles.itemContainer,
                {
                  transform: [{ scale }],
                  opacity,
                },
              ]}
            >
              <Avatar
                source={item.contact.image?.uri}
                size={ITEM_SIZE}
                name={item.contact.name}
              />
            </Animated.View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  carousel: {
    height: ITEM_SIZE,
  },

  itemContainer: {
    width: FULL_ITEM_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
});