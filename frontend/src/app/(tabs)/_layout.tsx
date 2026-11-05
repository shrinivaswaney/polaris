import { useTheme } from "@/theme/ThemeProvider";
import { Tabs } from "expo-router";
import { CompassIcon, GearIcon } from "phosphor-react-native";

export default function TabsLayout() {
  const { theme } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.muted,
        tabBarStyle: {
          backgroundColor: theme.colors.surfaceContainerLowest,
          borderTopColor: theme.colors.border,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ focused, size }) => (
            <CompassIcon
              color={focused ? theme.colors.primary : theme.colors.muted}
              size={size}
              weight={focused ? "fill" : "regular"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ focused, size }) => (
            <GearIcon
              color={focused ? theme.colors.primary : theme.colors.muted}
              size={size}
              weight={focused ? "fill" : "regular"}
            />
          ),
        }}
      />
    </Tabs>
  );
}
