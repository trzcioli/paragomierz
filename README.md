**Paragomierz Client**

An application that allows you to easily document and synchronize your expenses with [kontomierz](https://kontomierz.pl/). Simply take a photo of a receipt or upload a photo from the device's memory, verify/edit the product list and click save.

You can run this app by dowloading and installing [Expo app](https://play.google.com/store/apps/details?id=host.exp.exponent&hl=en) on your phone,
scanning QR code on [this site](https://expo.io/@trzcioli/)
or by run it locally: (you need to have node and npm installed)

```console
git clone https://github.com/trzcioli/paragomierz.git

cd paragomierz

npm install -g expo-cli

npm install

expo start
```

scan QR code by Expo app to run it on your phone. By default, its connecting to https://paragomierz.herokuapp.com server instance. To change it, edit the HOSTNAME in config.js.
