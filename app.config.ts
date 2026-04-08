import "tsx";

export default () => ({
  "expo": {
    "name": "Candle",
    "slug": "candle",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "scheme": "candle",
    "userInterfaceStyle": "automatic",
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "adaptiveIcon": {
        "backgroundColor": "#2A0545",
        "foregroundImage": "./assets/images/android-foreground.png",
      },
      "predictiveBackGestureEnabled": false,
      "permissions": [
        "android.permission.READ_CONTACTS",
        "android.permission.WRITE_CONTACTS",
        "android.permission.NFC",
      ],
      "package": "com.placeholder.group.candle"
    },
    "web": {
      "output": "static",
      "favicon": "./assets/images/favicon.png"
    },
    "plugins": [
      [
        "expo-contacts",
        {
          "contactsPermission": "Allow $(PRODUCT_NAME) to access your contacts."
        }
      ],
      "expo-router",
      [
        "expo-splash-screen",
        {
          "image": "./assets/images/icon.png",
          "imageWidth": 200,
          "resizeMode": "contain",
          "backgroundColor": "#2A0545",
          "dark": {
            "backgroundColor": "#2A0545"
          }
        }
      ],
      [
        "expo-contacts",
        {
          "contactsPermission": "Allow $(PRODUCT_NAME) to access your contacts."
        }
      ],
      [
        "expo-secure-store",
        {
          "configureAndroidBackup": true,
          "faceIDPermission": "Allow $(PRODUCT_NAME) to access your Face ID biometric data."
        }
      ],
      "expo-sqlite",
      "expo-font",
      "./plugins/withHCEConfiguration.ts"
    ],
    "experiments": {
      "typedRoutes": true,
      "reactCompiler": true
    }
  }
})
