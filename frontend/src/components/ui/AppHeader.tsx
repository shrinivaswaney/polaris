import { AppText } from "@/components/default";
import { useTheme } from "@/theme/default";
import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { CaretLeftIcon } from "phosphor-react-native";
import type { ReactNode } from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const imageLogoPath = require("@/assets/images/polaris-mark.png");

export type AppHeaderProps = {
  section?: string;
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  left?: ReactNode;
  right?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

function withAlpha(color: string, opacity: number): string {
  const hex = color.replace("#", "");

  if (hex.length !== 6) {
    return color;
  }

  const alpha = Math.round(opacity * 255)
    .toString(16)
    .padStart(2, "0");

  return `#${hex}${alpha}`;
}

export function AppHeader({
  section,
  title,
  showBack = false,
  onBack,
  left,
  right,
  style,
}: AppHeaderProps) {
  const { theme, mode } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const navigation = theme.components.navigation;
  const blur = Number.parseInt(navigation.blur, 10) || 20;
  const intensity = Math.min(blur * 2.5, 100);
  const webBlur = `blur(${navigation.blur})`;

  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }

    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace("/(tabs)/explore");
  };

  const withBack = showBack || Boolean(title);
  const backButton = withBack ? (
    <Pressable
      accessibilityLabel="Go back"
      accessibilityRole="button"
      hitSlop={12}
      onPress={handleBack}
      style={({ pressed }) => [styles.back, pressed && styles.pressed]}
    >
      <CaretLeftIcon color={theme.colors.text} size={22} weight="thin" />
    </Pressable>
  ) : null;

  const containerStyle: StyleProp<ViewStyle> = [
    styles.root,
    {
      paddingTop: insets.top,
      backgroundColor: withAlpha(
        theme.colors.surfaceContainer,
        navigation.opacity,
      ),
    },
    Platform.OS === "web" &&
      ({
        backdropFilter: webBlur,
        WebkitBackdropFilter: webBlur,
      } as unknown as ViewStyle),
    style,
  ];

  const content = (
    <View
      style={[
        styles.bar,
        {
          paddingHorizontal: theme.spacing(6),
          paddingVertical: theme.spacing(3),
        },
      ]}
    >
      <View style={styles.slot}>
        {left ??
          (title ? (
            <View style={styles.titleGroup}>
              {backButton}
              <AppText variant="quote">{title}</AppText>
            </View>
          ) : withBack ? (
            backButton
          ) : (
            <View style={styles.brand}>
              <Image
                accessibilityIgnoresInvertColors
                contentFit="contain"
                source={imageLogoPath}
                style={styles.logo}
              />
              <AppText variant="wordmark">Polaris</AppText>
            </View>
          ))}
      </View>

      <View style={[styles.slot, styles.right]}>
        {right ??
          (section ? (
            <AppText color="muted" variant="label">
              {section}
            </AppText>
          ) : null)}
      </View>
    </View>
  );

  if (Platform.OS === "web") {
    return <View style={containerStyle}>{content}</View>;
  }

  return (
    <BlurView
      intensity={intensity}
      tint={mode === "dark" ? "dark" : "light"}
      style={containerStyle}
    >
      {content}
    </BlurView>
  );
}

const styles = StyleSheet.create({
  root: {
    overflow: "hidden",
  },
  brand: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },
  titleGroup: {
    alignItems: "center",
    flexDirection: "row",
    gap: 4,
  },
  logo: {
    height: 30,
    width: 30,
  },
  bar: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 44,
  },
  slot: {
    alignItems: "flex-start",
    justifyContent: "center",
  },
  right: {
    alignItems: "flex-end",
  },
  back: {
    justifyContent: "center",
    marginLeft: -4,
  },
  pressed: {
    opacity: 0.5,
  },
});
