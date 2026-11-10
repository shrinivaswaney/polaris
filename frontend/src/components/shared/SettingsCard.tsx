import { Avatar } from "@/components/sections/settings/Avatar";
import { AppText } from "@/components/shared/AppText";
import { CaretRightIcon, type Icon } from "phosphor-react-native";
import { Pressable, StyleSheet, View } from "react-native";

interface SettingsCardProps {
  header?: string;
  caption?: string;
  source?: string | number | object;
  icon?: Icon;
  onPress?: () => void;
  fill?: boolean;
}

const SettingsCard = ({
  header,
  caption,
  source,
  icon,
  onPress,
  fill,
}: SettingsCardProps) => {
  return (
    <View style={styles.rowContainer}>
      <Avatar source={source} icon={icon} fill={fill} />
      <View style={styles.textContainer}>
        {header && <AppText variant="quote">{header}</AppText>}
        {caption && <AppText variant="bodySmall">{caption}</AppText>}
      </View>
      <Pressable style={styles.caretPressable} onPress={onPress}>
        <CaretRightIcon color="#fff" size={20} />
      </Pressable>
    </View>
  );
};

export default SettingsCard;

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    width: "100%",
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
    alignItems: "flex-start",
  },
  caretPressable: {
    justifyContent: "center",
    alignItems: "center",
    padding: 4,
  },
});
