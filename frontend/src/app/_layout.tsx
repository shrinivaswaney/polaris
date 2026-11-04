import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";

import { ThemeProvider, useTheme } from "../theme/ThemeProvider";
import { fontDefinitions } from "../theme/fonts";

// Keep the splash screen visible until the fonts are ready.
SplashScreen.preventAutoHideAsync().catch(() => {});

function ThemedStatusBar() {
  const { mode } = useTheme();

  return <StatusBar style={mode === "dark" ? "light" : "dark"} />;
}

export default function RootLayout() {
  const [loaded, error] = useFonts(fontDefinitions);

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <ThemeProvider mode="dark">
      <Stack screenOptions={{ headerShown: false }} />
      <ThemedStatusBar />
    </ThemeProvider>
  );
}
