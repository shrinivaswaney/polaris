import {
  textStyles,
  useTheme,
  type AppTheme,
  type TextVariant,
} from "@/theme/default";
import { Text, type TextProps } from "react-native";

export type AppTextProps = TextProps & {
  variant?: TextVariant;
  color?: keyof AppTheme["colors"];
};

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
