import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import SnackBar from "react-native-snackbar-component";
import { Button, Icon } from "react-native-elements";
import * as React from "react";
import * as ImagePicker from "expo-image-picker";

const styles = StyleSheet.create({
    button: {
        height: 65,
        padding: 5,
        marginTop: 30,
        marginBottom: 80,
        width: "80%",
        justifyContent: 'space-around',
        borderRadius: 10,
    },
});

const pickImage = async (navigate) => {
    try {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            quality: 1,
        });
        navigate.navigate("ProductsScreen", { uri: result.uri });
    } catch (e) {
        console.log(e);
    }
};

const takeImage = async (navigate) => {
    try {
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            quality: 1,
        });
        navigate.navigate("ProductsScreen", { uri: result.uri });
    } catch (e) {
        console.log(e);
    }
};

const Home = ({ navigation, route }) => {
    const [visible, setVisible] = useState(false);

    const message = route.params?.message;

    useEffect(() => {
        if (message) {
            setVisible(true);
            setTimeout(() => setVisible(false), 2000);
        }
    }, [message]);

    return (
        <View
            style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
            }}
        >
            <SnackBar
                visible={visible}
                textMessage={message}
                actionHandler={() => setVisible(false)}
                actionText="X"
            />
            <Button
                title="  Zrób zdjęcie paragonu"
                buttonStyle={styles.button}
                icon={<Icon name="camerao" type="antdesign" color="black" />}
                type="outline"
                onPress={async () => {
                    await takeImage(navigation);
                }}
            />
            <Button
                title="  Wrzuć zdjęcie paragonu z galerii"
                type="outline"
                icon={<Icon name="file-photo-o" type="font-awesome" color="black" />}
                buttonStyle={styles.button}
                onPress={async () => {
                    await pickImage(navigation);
                }}
            />
        </View>
    );
}

export default Home;
