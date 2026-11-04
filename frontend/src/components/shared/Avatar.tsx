import icons from "@/assets/icons/icons";
import { useTheme } from "@/theme/ThemeProvider";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Pressable, StyleSheet } from "react-native";

export function Avatar() {
  const { theme } = useTheme();

  return (
    <Pressable
      accessibilityLabel="Open profile"
      accessibilityRole="button"
      hitSlop={8}
      onPress={() => router.push("/profile")}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      <Image
        accessibilityIgnoresInvertColors
        contentFit="contain"
        source={icons.user}
        style={styles.image}
        tintColor={theme.colors.text}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    borderRadius: 20,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  pressed: {
    opacity: 0.7,
  },
  image: {
    height: 24,
    width: 24,
  },
});
