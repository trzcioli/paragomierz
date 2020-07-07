import React, { useState, useEffect } from "react";
import { Button, View, Picker, Text, StyleSheet, ActivityIndicator } from "react-native";
import { ListItem, Overlay, Input, Icon, Divider } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";
import produce from "immer";
import { nanoid } from 'nanoid/async/index.native';
import { useNavigation } from '@react-navigation/native';
import SnackBar from 'react-native-snackbar-component';
import {encode as btoa} from 'base-64';
import { HOSTNAME } from "./config";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    height: "100%",
  },
  edit: {
    paddingTop: 100,
    paddingBottom: 100,
    flex: 1,
    flexDirection: "column",
    height: 100,
    width: 250,
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  top: {
    width: "100%",
    height: "8%",
  },
  mid: {
    width: "100%",
    height: "64%",
  },
  bot: {
    width: "100%",
    height: "14%",
  },
  input: {
    width: "100%",
  }
});

const getCategories = token =>
  fetch(
    `${HOSTNAME}/api/categories`,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Basic ${btoa(token + ':unused')}`,
      },
      method: "GET",
    }
  )
    .then((response) => response.json())
    .then((success) => success)
    .catch((error) => console.log(error));

const upload = async (uri, setErrorMessage, navigate, token) => {
  const apiUrl = `${HOSTNAME}/api/process-image`;

  if (!uri) {
    navigate('Home');
    return;
  }

  const uriParts = uri.split(".");
  const fileType = uriParts[uriParts.length - 1];

  const formData = new FormData();
  formData.append("photo", {
    uri,
    name: `photo.${fileType}`,
    type: `image/${fileType}`,
  });

  const options = {
    method: "POST",
    body: formData,
    headers: {
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
       Authorization: `Basic ${btoa(token + ':unused')}`
    },
  };

  return fetch(apiUrl, options).then((res) => {
    if (res.status === 200) {
      return res.json();
    }
    console.log(res.status);
    setErrorMessage(`Error: ${res.status}`);
    return [];
  });
};

const uploadResults = (categories, items, token) => {
  const url = `${HOSTNAME}/api/sum`;

  const assignments = {};
  const usedCategories = items.flatMap(item => item.categories);
  categories.filter(category => usedCategories.includes(category))
  .forEach(category => {
    assignments[category] = items
      .filter(item => item.categories.includes(category))
      .map(item => ({ name: item.name, price: Number(item.price) }));
  });

  const options = {
    method: "POST",
    body: JSON.stringify(assignments),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${btoa(token + ':unused')}`
    },
  };
  return fetch(url, options);
}

const ProductsScreen = ({ route, token }) => {
  const [categories, setCategories] = useState([]);
  const [currentCategory, setCurrentCategory] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [items, setItems] = useState([]);
  const [categoriesFetched, setCategoriesFetched] = useState(false);
  const [itemsFetched, setItemsFetched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const navigation = useNavigation();

  if (!route.params.uri) {
    navigation.navigate('Home');
  }

  useEffect(() => {
    if (errorMessage.length) {
      setTimeout(() => setErrorMessage(''), 2000);
    }
  }, [errorMessage]);

  useEffect(() => {
    if (!categoriesFetched) {
      getCategories(token).then((r) => {
        if (r) {
          setCategoriesFetched(true);
          setCategories(
              r.category_groups.flatMap((cg) => cg.categories.map((c) => c.name))
          );
        }
      });
    }
    if (!itemsFetched) {
      setLoading(true);
      upload(route.params.uri, setErrorMessage, navigation.navigate, token).then(r => {
        setItemsFetched(true);
        const items = r.map(i => ({ ...i, id: i.name, categories: [] }) );
        setItems(items);
        setLoading(false);
      });
    }
  }, []);

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const deleteItem = item => {
    const newItems = produce(items, draft => {
      const idx = items.findIndex(i => i.id === item.id);
      draft.splice(idx, 1);
    });
    setItems(newItems);
  }

  const addOrRemoveCurrentCategoryFromItem = item => {
    const newItems = produce(items, draftItems => {
      const idx = items.findIndex(i => i.id === item.id);
      if (draftItems[idx].categories.includes(currentCategory)) {
        draftItems[idx].categories = draftItems[idx].categories.filter(c => c !== currentCategory);
      } else {
        draftItems[idx].categories.push(currentCategory);
      }
    });
    setItems(newItems);
  };

  return (
    <View style={styles.container}>
      <SnackBar
          visible={errorMessage.length > 0}
          textMessage={errorMessage}
          actionHandler={() => setErrorMessage('')}
          actionText="X"
      />

      <Overlay
        containerStyle={styles.edit}
        style={styles.edit}
        isVisible={modalVisible}
        onBackdropPress={() => {
          setCurrentItem(null);
          toggleModal();
        }}
      >
        <View
            style={styles.edit}
        >
          <Text style={{ fontSize: 18, paddingBottom: 10 }}>Dodaj lub dostosuj produkt</Text>
          <Input
            style={styles.input}
            value={currentItem?.name}
            onChangeText={value => setCurrentItem({ ...currentItem, name: value })}
          />
          <Input
              style={styles.input}
              value={currentItem?.price?.toString()}
              onChangeText={value => setCurrentItem({ ...currentItem, price: value })}
          />
          <Button
            icon={<Icon name="arrow-right" size={15} color="white" />}
            type="outline"
            title="Zatwierdź"
            onPress={() => {
              const newItems = produce(items, draft => {
                let idx = draft.findIndex(i => i.id === currentItem?.id);
                if (idx === -1) {
                  draft.push(currentItem);
                } else {
                  draft[idx] = currentItem;
                }
              });
              setItems(newItems);
              setCurrentItem(null);
              toggleModal();
            }}
          />
        </View>
      </Overlay>

      <Picker
        style={styles.top}
        selectedValue={currentCategory}
        onValueChange={(value) => setCurrentCategory(value)}
        enabled={categories?.length > 0}
      >
        {categories.map((c) => (
          <Picker.Item key={c} label={c} value={c} />
        ))}
      </Picker>

      {!loading ? (
      <ScrollView style={styles.mid}>
        {items?.map(item => (
            <ListItem
              key={item.id}
              title={item.name}
              subtitle={item.price?.toString()}
              leftIcon={item.categories?.includes(currentCategory) ? ({ name: 'check', color: 'green' }) : null}
              rightIcon={<Icon name="delete" type="antdesign" size={24} onPress={() => deleteItem(item)} />}
              bottomDivider
              onPress={() => addOrRemoveCurrentCategoryFromItem(item)}
              onLongPress={() => {
                setCurrentItem(item);
                toggleModal();
              }}
            />
          ))}
      </ScrollView>
      ) : (
          <ScrollView style={styles.mid}>
            <ActivityIndicator size="large" color="#0000ff" />
          </ScrollView>
      )}

      <Button
          style={styles.bot}
          icon={<Icon name="arrow-right" size={15} color="white" />}
          type="outline"
          title="Dodaj produkt"
          onPress={async () => {
            setCurrentItem({ id: await nanoid(), name: '', price: 0, categories: [] });
            toggleModal();
          }}
      />

      <Divider />

      <Button
        style={styles.bot}
        icon={<Icon name="arrow-right" size={15} color="white" />}
        type="outline"
        title="Zapisz"
        onPress={async () => {
          setLoading(true);
          const response = await uploadResults(categories, items, token);
          setLoading(false);
          if (response.status === 200) {
            navigation.navigate('Home', { message: 'Zapisano!' });
          } else {
            setErrorMessage('Nie udało się zapisać wyników');
            setTimeout(() => setErrorMessage(''), 200);
          }
        }}
      />
    </View>
  );
};

export default ProductsScreen;
