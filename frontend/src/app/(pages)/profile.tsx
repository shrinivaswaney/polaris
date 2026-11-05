import { AppText, Screen } from "@/components/default";
import { Pressable } from "react-native";

export default function ProfileScreen() {
  return (
    <Screen
      title=" User Profile"
      headerRight={
        <Pressable>
          <AppText>Save</AppText>
        </Pressable>
      }
    >
      <AppText>ProfileScreen</AppText>
    </Screen>
  );
}
