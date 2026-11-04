import { StyleSheet } from "react-native";

import { AppText } from "../../components/shared/AppText";
import { Screen } from "../../components/shared/Screen";
import { useTheme } from "../../theme/ThemeProvider";

export default function SearchScreen() {
  const { theme } = useTheme();

  return (
    <Screen
      section="Search"
      style={[
        styles.container,
        { gap: theme.spacing(2), padding: theme.spacing(6) },
      ]}
    >
      <AppText variant="h2">Search</AppText>
      <AppText color="muted">Search Screen</AppText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
});
