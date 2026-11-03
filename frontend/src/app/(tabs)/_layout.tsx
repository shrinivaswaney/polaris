import { Tabs } from "expo-router";
import {
  BookmarkSimpleIcon,
  CompassIcon,
  MagnifyingGlassIcon,
  SparkleIcon,
  UserIcon,
} from "phosphor-react-native";

import { useTheme } from "../../theme/ThemeProvider";
import { textStyles } from "../../theme/tokens";

export default function TabsLayout() {
  const { theme } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.muted,
        tabBarStyle: {
          backgroundColor: theme.colors.surfaceContainerLowest,
          borderTopColor: theme.colors.border,
        },
        tabBarLabelStyle: textStyles.caption,
      }}
    >
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
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
        name="search"
        options={{
          title: "Search",
          tabBarIcon: ({ focused, size }) => (
            <MagnifyingGlassIcon
              color={focused ? theme.colors.primary : theme.colors.muted}
              size={size}
              weight={focused ? "fill" : "regular"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="concierge"
        options={{
          title: "Concierge",
          tabBarIcon: ({ focused, size }) => (
            <SparkleIcon
              color={focused ? theme.colors.primary : theme.colors.muted}
              size={size}
              weight={focused ? "fill" : "regular"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: "Saved",
          tabBarIcon: ({ focused, size }) => (
            <BookmarkSimpleIcon
              color={focused ? theme.colors.primary : theme.colors.muted}
              size={size}
              weight={focused ? "fill" : "regular"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused, size }) => (
            <UserIcon
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
