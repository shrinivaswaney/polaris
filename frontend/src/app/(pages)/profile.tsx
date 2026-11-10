import { AppText } from "@/components/shared/AppText";
import { Screen } from "@/components/ui/Screen";
import { useTheme } from "@/theme/ThemeProvider";
import SettingsCard from "@/components/shared/SettingsCard";
import { userData } from "@/constants/data";
import { WarningIcon } from "phosphor-react-native";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";

export default function ProfileScreen() {
  const { theme } = useTheme();
  return (
    <Screen
      title=" User Profile"
      headerRight={
        <Pressable>
          <AppText>Edit/Save</AppText>
        </Pressable>
      }
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          {
            gap: theme.spacing(12),
            padding: theme.spacing(4),
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* User Initials */}
        <View style={styles.avatarContainer}>
          <AppText variant="h3" style={styles.avatar}>
            {userData.name
              .split(" ")
              .map((i) => i.charAt(0))
              .join("")}
          </AppText>
        </View>
        <AppText variant="label">{userData.email}</AppText>

        <View style={{ gap: theme.spacing(2) }}>
          <AppText variant="wordmark" style={{ fontSize: 12 }}>
            About
          </AppText>
          <SettingsCard
            header="Send Feedback"
            icon={WarningIcon}
            onPress={() => console.log("Send Feedback Modal Open")}
          />
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  container: {
    display: "flex",
    alignItems: "center",
    marginTop: 20,
  },
  avatarContainer: {
    width: 150,
    height: 150,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: 999,
  },
  avatar: {
    color: "#000",
    fontSize: 30,
  },
});
