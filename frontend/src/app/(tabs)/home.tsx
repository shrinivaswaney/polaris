import { AppText, Screen } from "@/components/default";
import { useTheme } from "@/theme/default";
import { StyleSheet } from "react-native";

export default function HomeScreen() {
  const { theme } = useTheme();
  return (
    <Screen
      section="Home"
      style={[
        styles.container,
        { gap: theme.spacing(2), padding: theme.spacing(6) },
      ]}
    >
      <AppText variant="h2">Home</AppText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
});
