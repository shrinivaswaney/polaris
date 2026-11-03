import { Tabs } from "expo-router";
import { HouseIcon, UserIcon } from "phosphor-react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <HouseIcon weight={focused ? "fill" : "regular"} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused }) => (
            <UserIcon weight={focused ? "fill" : "regular"} />
          ),
        }}
      />
    </Tabs>
  );
}
