import { useTheme } from "@/theme/ThemeProvider";
import type { PropsWithChildren, ReactNode } from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { AppHeader } from "./AppHeader";

export type ScreenProps = PropsWithChildren<{
  section?: string;
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  headerLeft?: ReactNode;
  headerRight?: ReactNode;
  style?: StyleProp<ViewStyle>;
}>;

export function Screen({
  children,
  section,
  title,
  showBack,
  onBack,
  headerLeft,
  headerRight,
  style,
}: ScreenProps) {
  const { theme } = useTheme();

  return (
    <View style={[styles.screen, { backgroundColor: theme.colors.background }]}>
      <AppHeader
        section={section}
        title={title}
        showBack={showBack}
        onBack={onBack}
        left={headerLeft}
        right={headerRight}
      />
      <View style={[styles.content, style]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
