import * as React from "react";
import {
  Text,
  View,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  TextInput,
  ImageBackground,
  KeyboardAvoidingView,
} from "react-native";
import { Button } from "react-native-elements";
import { useEffect, useState } from "react";
import { HOSTNAME } from "./config";
import SnackBar from "react-native-snackbar-component";
import { useNavigation } from "@react-navigation/native";

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  containerView: {
    flex: 1,
  },
  loginScreenContainer: {
    flex: 1,
  },
  logoText: {
    fontSize: 40,
    fontWeight: "800",
    marginTop: "15%",
    marginBottom: 60,
    textAlign: "center",
  },
  loginFormView: {
    flex: 1,
  },
  loginFormTextInput: {
    height: 43,
    fontSize: 14,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "black",
    backgroundColor: "#fafafa",
    paddingLeft: 10,
    marginLeft: 15,
    marginRight: 15,
    marginTop: 5,
    marginBottom: 5,
  },
  loginButton: {
    backgroundColor: "#3897f1",
    borderRadius: 5,
    height: 45,
    marginTop: 10,
    marginLeft: 15,
    marginRight: 15,
  },
  fbLoginButton: {
    height: 45,
    margin: 15,
    borderColor: "black",
  },
});

const register = async (
  email,
  password,
  apiKey,
  urlApiKey,
  setToken,
  setIsLoggedIn,
  navigate,
  setErrorMessage,
  setLoading
) => {
  const url = `${HOSTNAME}/register`;

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
      api_key: apiKey,
      url_api_key: urlApiKey,
    }),
  };

  setLoading(true);
  const response = await fetch(url, options).catch(() =>
    setErrorMessage("Wystąpił błąd")
  );
  setLoading(false);

  if (response?.status !== 200) {
    console.log("Register returned", response?.status);
    setErrorMessage("Wystąpił błąd");
    return;
  }

  const token = await response.text();

  setToken(token);
  setIsLoggedIn(true);

  navigate("Home", { message: "Zarjestrowano. Witamy!" });
};

const logIn = async (
  email,
  password,
  setToken,
  setIsLoggedIn,
  navigate,
  setErrorMessage,
  setLoading
) => {
  const url = `${HOSTNAME}/sign_in`;

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  };

  setLoading(true);
  const response = await fetch(url, options).catch(() =>
    setErrorMessage("Wystąpił błąd")
  );
  setLoading(false);

  if (response?.status === 401) {
    console.log("LogIn returned", response?.status);
    setErrorMessage("Nieprawidłowy login lub hasło");
    return;
  }

  if (response?.status !== 200) {
    console.log(response?.status);
    setErrorMessage("Wystąpił błąd");
    return;
  }

  const token = await response.text();

  setToken(token);
  setIsLoggedIn(true);

  navigate("Home", { message: "Zalogowano!" });
};

const AuthScreen = ({ setToken, setIsLoggedIn }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [urlApiKey, setUrlApiKey] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    if (errorMessage.length) {
      setTimeout(() => setErrorMessage(""), 2000);
    }
  }, [errorMessage]);

  const tryRegister = () =>
    register(
      email,
      password,
      apiKey,
      urlApiKey,
      setToken,
      setIsLoggedIn,
      navigation.navigate,
      setErrorMessage,
      setLoading
    );
  const tryLogin = () =>
    logIn(
      email,
      password,
      setToken,
      setIsLoggedIn,
      navigation.navigate,
      setErrorMessage,
      setLoading
    );

  return (
    <ImageBackground
      source={require("./memphis-mini.png")}
      style={styles.backgroundImage}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.loginScreenContainer}>
          <SnackBar
            visible={errorMessage.length > 0}
            textMessage={errorMessage}
            actionHandler={() => setErrorMessage("")}
            actionText="X"
          />
          <View style={styles.loginFormView}>
            <Text style={styles.logoText}>Paragomierz</Text>
            <TextInput
              placeholder="Email"
              placeholderColor="#c4c3cb"
              style={styles.loginFormTextInput}
              onChangeText={(value) => setEmail(value)}
            />
            <TextInput
              placeholder="Hasło"
              placeholderColor="#c4c3cb"
              style={styles.loginFormTextInput}
              secureTextEntry={true}
              onChangeText={(value) => setPassword(value)}
            />
            {isRegister && (
              <>
                <TextInput
                  placeholder="Klucz API"
                  placeholderColor="#c4c3cb"
                  style={styles.loginFormTextInput}
                  onChangeText={(value) => setApiKey(value)}
                />
                <TextInput
                  placeholder="Klucz API URL"
                  placeholderColor="#c4c3cb"
                  style={styles.loginFormTextInput}
                  onChangeText={(value) => setUrlApiKey(value)}
                />
              </>
            )}
            <Button
              buttonStyle={styles.loginButton}
              onPress={() => (isRegister ? tryRegister() : tryLogin())}
              title={isRegister ? "Zarejestruj" : "Zaloguj się"}
              loading={loading}
            />
            <Button
              buttonStyle={styles.fbLoginButton}
              onPress={() => setIsRegister(!isRegister)}
              title={isRegister ? "Anuluj" : "Zarejestruj się"}
              color="black"
              type="outline"
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </ImageBackground>
  );
};

export default AuthScreen;
