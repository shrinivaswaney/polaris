import { Avatar } from "@/components/shared/Avatar";
import { StyleSheet } from "react-native";
import { AppText } from "../../components/shared/AppText";
import { Screen } from "../../components/shared/Screen";
import { useTheme } from "../../theme/ThemeProvider";

export default function ExploreScreen() {
  const { theme } = useTheme();

  return (
    <Screen
      section="Explore"
      headerRight={<Avatar />}
      style={[
        styles.container,
        { gap: theme.spacing(2), padding: theme.spacing(6) },
      ]}
    >
      <AppText variant="h2">Explore</AppText>
      <AppText color="muted">Explore Screen</AppText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
});
