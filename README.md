**Paragomierz Client**

App that allows you to take a photo of a receipt or upload a photo from the device's memory, edit the product list and synchronize expenses with [kontomierz](https://kontomierz.pl/).

You can run this app by dowloading and installing [Expo app](https://play.google.com/store/apps/details?id=host.exp.exponent&hl=en) on your phone,
scanning QR code on [this site](https://expo.io/@trzcioli/)
or by run it locally:

```console
git clone https://github.com/trzcioli/paragomierz.git

cd paragomierz

conda create --name paragomierz

conda activate paragomierz

conda install -c conda-forge nodejs

npm install -g expo-cli

npm install

expo start
```

and scan QR code by Expo app.
