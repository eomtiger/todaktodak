import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
  apiKey: "AIzaSyC28lmSh_y2INMvoK4DuOUCPngBObbMkNM",
  authDomain: "todaktodak-6846e.firebaseapp.com",
  projectId: "todaktodak-6846e",
  storageBucket: "todaktodak-6846e.appspot.com",
  messagingSenderId: "964401813700",
  appId: "1:964401813700:web:ea0d9e4fc146ea76531191",
  measurementId: "G-P2DYY794B6",
};

function requestPermission() {
  console.log("Requesting permission...");
  Notification.requestPermission().then((permission) => {
    if (permission === "granted") {
      console.log("Notification permission granted.");

      // Initialize Firebase
      const app = initializeApp(firebaseConfig);

      // Initialize Firebase Cloud Messaging and get a reference to the service
      const messaging = getMessaging(app);

      getToken(messaging, {
        vapidKey:
          "BF3U9375dYGSwWvW4-7mhysfyOYnsFf5nbWEOw3vH5_KWQ2MOhSXszPGZlXSFhbDP_rUn7OYpyfW2NsamrEmVpQ",
      })
        .then((currentToken) => {
          if (currentToken) {
            console.log("currentToken: ", currentToken);
          } else {
            console.log(
              "No registration token available. Request permission to generate one."
            );
          }
        })
        .catch((err) => {
          console.log("An error occurred while retrieving token. ", err);
          // ...
        });
      onMessage(messaging, (payload) => {
        console.log("Message received.", payload);
      });
    } else {
      console.log("Do not get token");
    }
  });
}

requestPermission();
