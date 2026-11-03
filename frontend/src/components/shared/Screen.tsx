import type { PropsWithChildren } from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { useTheme } from "../../theme/ThemeProvider";

export type ScreenProps = PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
}>;

/**
 * Full-screen container that applies the active theme background.
 * Use this instead of a bare `View` at the root of each screen.
 */
export function Screen({ children, style }: ScreenProps) {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.screen,
        { backgroundColor: theme.colors.background },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});
