import { StyleSheet } from "react-native";

import { AppText } from "../../components/shared/AppText";
import { Screen } from "../../components/shared/Screen";
import { useTheme } from "../../theme/ThemeProvider";

export default function SavedScreen() {
  const { theme } = useTheme();

  return (
    <Screen
      style={[
        styles.container,
        { gap: theme.spacing(2), padding: theme.spacing(6) },
      ]}
    >
      <AppText variant="h2">Saved</AppText>
      <AppText color="muted">Saved Screen</AppText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
});
