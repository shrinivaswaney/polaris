import { AppText, Screen } from "@/components/default";
import { useTheme } from "@/theme/default";
import { StyleSheet } from "react-native";

export default function SettingsScreen() {
  const { theme } = useTheme();
  return (
    <Screen
      section="Settings"
      style={[
        styles.container,
        { gap: theme.spacing(2), padding: theme.spacing(6) },
      ]}
    >
      <AppText variant="h2">Settings</AppText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
});
