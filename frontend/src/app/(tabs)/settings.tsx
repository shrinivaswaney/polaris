import { Screen } from "@/components/ui/Screen";
import { useTheme } from "@/theme/ThemeProvider";
import { StyleSheet } from "react-native";

export default function SettingsScreen() {
  const { theme } = useTheme();
  const version = process.env.EXPO_PUBLIC_APP_VERSION;
  return <Screen section="Settings" style={styles.screenContainer}></Screen>;
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
