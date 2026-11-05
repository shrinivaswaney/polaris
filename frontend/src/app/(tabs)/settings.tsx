import icons from "@/assets/icons";
import { AppText, Screen } from "@/components/default";
import { Avatar } from "@/components/sections/settings/Avatar";
import SettingsCard from "@/components/shared/SettingsCard";
import { userData } from "@/constants/data";
import { useTheme } from "@/theme/default";
import { router } from "expo-router";
import {
  BellIcon,
  FileTextIcon,
  GlobeIcon,
  MoneyWavyIcon,
  PaletteIcon,
  ShareNetworkIcon,
  ShieldWarningIcon,
  StarIcon,
  WarningIcon,
} from "phosphor-react-native";
import { ScrollView, StyleSheet, View } from "react-native";

export default function SettingsScreen() {
  const { theme } = useTheme();
  const version = process.env.EXPO_PUBLIC_APP_VERSION;
  return (
    <Screen section="Settings" style={styles.screenContainer}>
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
        {/* User Account */}
        <View style={{ gap: theme.spacing(2) }}>
          <AppText variant="wordmark" style={{ fontSize: 12 }}>
            Account
          </AppText>
          <SettingsCard
            header={userData.name}
            caption={userData.email}
            source={userData.avatarUrl}
            onPress={() => router.push("/(pages)/profile")}
          />
        </View>

        {/* User Preferences */}
        <View style={{ gap: theme.spacing(2) }}>
          <AppText variant="wordmark" style={{ fontSize: 12 }}>
            Preferences
          </AppText>
          <SettingsCard
            header="Language"
            caption={userData.locale}
            icon={GlobeIcon}
            onPress={() => console.log("Language Selector Modal Open")}
          />
          <SettingsCard
            header="Theme"
            caption="Dark"
            icon={PaletteIcon}
            onPress={() => console.log("Theme Selector Modal Open")}
          />
          <SettingsCard
            header="Currency"
            caption={userData.currency}
            icon={MoneyWavyIcon}
            onPress={() => console.log("Currency Selector Modal Open")}
          />
        </View>

        {/* Notifications */}
        <View style={{ gap: theme.spacing(2) }}>
          <AppText variant="wordmark" style={{ fontSize: 12 }}>
            Notifications
          </AppText>
          <SettingsCard
            header="Notifications"
            caption="Configure your reminder preferences"
            icon={BellIcon}
            onPress={() => console.log("Notification Configure Page Open")}
          />
        </View>

        {/* About */}
        <View style={{ gap: theme.spacing(2) }}>
          <AppText variant="wordmark" style={{ fontSize: 12 }}>
            About
          </AppText>
          <SettingsCard
            header="Send Feedback"
            icon={WarningIcon}
            onPress={() => console.log("Send Feedback Modal Open")}
          />
          <SettingsCard
            header="Rate App"
            icon={StarIcon}
            fill
            onPress={() => console.log("Send Feedback Modal Open")}
          />
          <SettingsCard
            header="Share App"
            icon={ShareNetworkIcon}
            onPress={() => console.log("Send Feedback Modal Open")}
          />
          <SettingsCard
            header="Privacy Policy"
            icon={ShieldWarningIcon}
            onPress={() => console.log("Send Feedback Modal Open")}
          />
          <SettingsCard
            header="Terms & Conditions"
            icon={FileTextIcon}
            onPress={() => console.log("Send Feedback Modal Open")}
          />
        </View>
        <View style={{ gap: theme.spacing(2), alignItems:"center" }}>
          <Avatar source={icons.logo} />
          <AppText variant="h3" style={{ fontSize: 14 }}>
            Version {version}
          </AppText>
          <AppText variant="display">Polaris</AppText>
          <View>
            <AppText>© Polaris 2026. All rights reserved.</AppText>
          </View>
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
  profileCard: {},
  preferences: {
    width: "100%",
    borderWidth: 1,
  },
});
