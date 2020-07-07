import * as React from "react";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import ProductsScreen from "./ProductsScreen";
import Home from "./HomeScreen";
import { useEffect, useState } from "react";
import AuthScreen from "./AuthScreen";

const Stack = createStackNavigator();

const getPermissionAsync = async () => {
  if (Constants.platform.ios) {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
    }
  }
};

const getCameraPermissionAsync = async () => {
  if (Constants.platform.ios) {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    if (status !== "granted") {
      alert("Sorry, we need camera permissions to make this work!");
    }
  }
};

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState('');

  useEffect(() => {
    getPermissionAsync();
    getCameraPermissionAsync();
  }, []);

  const HomeScreen = ({ navigation, route }) => (
      <Home
          navigation={navigation}
          route={route}
          isLoggedIn={isLoggedIn}
      />
  );

  const Products = ({ route }) => (
    <ProductsScreen
        route={route}
        isLoggedIn={isLoggedIn}
        token={token}
    />
  );

  const Auth = () => (
    <AuthScreen
      isLoggedIn={isLoggedIn}
      setToken={setToken}
      setIsLoggedIn={setIsLoggedIn}
    />
  );

  return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Auth" options={{ headerShown: false }} component={Auth} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="ProductsScreen" options={{ title: "Paragon" }} component={Products} />
        </Stack.Navigator>
      </NavigationContainer>
    );
}

export default App;
