import { AppText, Screen } from "@/components/shared/default";
import { useTheme } from "@/theme/ThemeProvider";
import { StyleSheet } from "react-native";

export default function StatisticsScreen() {
  const { theme } = useTheme();

  return (
    <Screen
      section="Statistics"
      style={[
        styles.container,
        { gap: theme.spacing(2), padding: theme.spacing(6) },
      ]}
    >
      <AppText variant="h2">Statistics</AppText>
      <AppText color="muted">Statistics Screen</AppText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
});
