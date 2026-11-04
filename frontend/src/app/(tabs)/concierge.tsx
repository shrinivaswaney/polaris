import { StyleSheet } from "react-native";
import { AppText } from "../../components/shared/AppText";
import { Screen } from "../../components/shared/Screen";
import { useTheme } from "../../theme/ThemeProvider";

export default function ConciergeScreen() {
  const { theme } = useTheme();

  return (
    <Screen
      section="Concierge"
      style={[
        styles.container,
        { gap: theme.spacing(2), padding: theme.spacing(6) },
      ]}
    >
      <AppText variant="h2">Concierge</AppText>
      <AppText color="muted">Concierge Screen</AppText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
});
