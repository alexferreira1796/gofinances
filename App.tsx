import "react-native-gesture-handler";
import "intl";
import "intl/locale-data/jsonp/pt-BR";

import React from "react";
import { StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import AppLoading from "expo-app-loading";
import { ThemeProvider, useTheme } from "styled-components";

import { AppRoutes } from "./src/routes/app.routes";
import { SignIn } from "./src/screens/SignIn";

import { AuthProvider } from "./src/hooks/AuthContext";

import {
  useFonts, // carregando as fonts
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";

import Theme from "./src/global/styles/theme";

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold,
  });
  const theme = useTheme();

  // Se não tiver as fontes carregadas
  if (!fontsLoaded) {
    return <AppLoading />;
  }
  return (
    <ThemeProvider theme={Theme}>
      <NavigationContainer>
        <StatusBar barStyle="light-content" backgroundColor="#5636D3" />
        <AuthProvider>
          <SignIn />
        </AuthProvider>
      </NavigationContainer>
    </ThemeProvider>
  );
}
