import { AppText } from "@/components/shared/AppText";
import { Screen } from "@/components/shared/Screen";
import { useTheme } from "@/theme/ThemeProvider";
import { StyleSheet } from "react-native";

export default function ProfileScreen() {
  const { theme } = useTheme();

  return (
    <Screen
      section="Profile"
      style={[
        styles.container,
        { gap: theme.spacing(2), padding: theme.spacing(6) },
      ]}
    >
      <AppText variant="h2">Profile</AppText>
      <AppText color="muted">Profile Screen</AppText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
});
