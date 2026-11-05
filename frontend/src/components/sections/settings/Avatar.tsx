// @/components/shared/Avatar.tsx
import icons from "@/assets/icons";
import { useTheme } from "@/theme/ThemeProvider";
import { Image } from "expo-image";
import type { Icon as PhosphorIconType } from "phosphor-react-native";
import { Alert, Pressable, StyleSheet, View } from "react-native";

interface AvatarProps {
  source?: string | number | object;
  onUpdateImage?: (newSource: string | null) => void;
  icon?: PhosphorIconType;
  fill?: boolean;
}

export function Avatar({
  source,
  onUpdateImage,
  icon: CustomIcon,
  fill,
}: AvatarProps) {
  const { theme } = useTheme();

  const isFallback = !source || source === icons.unauth;
  const imageSource = source ? source : icons.unauth;

  const handleEditAvatar = () => {
    Alert.alert(
      "Profile Photo",
      "Manage your avatar image",
      [
        {
          text: "Take New Photo",
          onPress: () => {
            console.log("Trigger camera workflow");
          },
        },
        {
          text: "Choose from Library",
          onPress: () => {
            console.log("Trigger library workflow");
          },
        },
        ...(!isFallback
          ? [
              {
                text: "Remove Image",
                style: "destructive" as const,
                onPress: () => {
                  if (onUpdateImage) onUpdateImage(null);
                },
              },
            ]
          : []),
        {
          text: "Cancel",
          style: "cancel" as const,
        },
      ],
      { cancelable: true },
    );
  };

  // If a custom phosphor icon is supplied, render its layout container correctly
  if (CustomIcon) {
    return (
      <View style={styles.iconContainer}>
        <CustomIcon
          color={theme.colors.text}
          size={32}
          weight={fill ? "fill" : "bold"}
        />
      </View>
    );
  }

  return (
    <Pressable
      accessibilityLabel="Edit Profile Picture"
      accessibilityRole="button"
      hitSlop={8}
      onPress={handleEditAvatar}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      <Image
        accessibilityIgnoresInvertColors
        contentFit="cover"
        source={imageSource}
        style={styles.image}
        tintColor={isFallback ? theme.colors.text : undefined}
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
    overflow: "hidden",
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    height: 40,
    width: 40,
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  pressed: {
    opacity: 0.7,
  },
  image: {
    height: "100%",
    width: "100%",
  },
});
