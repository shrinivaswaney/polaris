import { Text, type TextProps } from "react-native";
import { useTheme } from "../../theme/ThemeProvider";
import {
  textStyles,
  type AppTheme,
  type TextVariant,
} from "../../theme/tokens";

export type AppTextProps = TextProps & {
  /** Defaults to `body`, which uses Manrope. */
  variant?: TextVariant;
  /** Theme color token. Defaults to `text`. */
  color?: keyof AppTheme["colors"];
};

/**
 * Text with a typography variant and theme color applied.
 * Defaults to Manrope body copy so regular UI text does not need to repeat
 * the font family.
 */
export function AppText({
  variant = "body",
  color = "text",
  style,
  ...props
}: AppTextProps) {
  const { theme } = useTheme();

  return (
    <Text
      {...props}
      style={[textStyles[variant], { color: theme.colors[color] }, style]}
    />
  );
}
