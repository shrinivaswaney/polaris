import { AppText, Screen } from "@/components/shared/default";
import { useTheme } from "@/theme/ThemeProvider";
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
      <AppText color="muted">Settings Screen</AppText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
});
