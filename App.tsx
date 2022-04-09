import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { useEffect } from "react";

import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";

import { withAuthenticator } from "aws-amplify-react-native";

import { getUser } from "./src/graphql/queries";
import { createUser } from "./src/graphql/mutations";
import { Amplify, Auth, API, graphqlOperation } from "aws-amplify";
import awsconfig from "./src/aws-exports";
Amplify.configure({
  ...awsconfig,
  Analytics: {
    disabled: true,
  },
});

function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  const randomImages = [
    "https://www.hdnicewallpapers.com/Walls/Big/Bear/Animal_Bear_with_2_Beautiful_Cub.jpg",
    "https://a-z-animals.com/media/pig-7-1024x535.jpg",
    "https://wallpaper.sc/en/ipad/wp-content/uploads/2018/08/ipad-2048x2048-thumbnail_00021.jpg",
    "https://media-cldnry.s-nbcnews.com/image/upload/t_today-ss-slide-desktop,f_auto,q_auto:best/MSNBC/Components/Slideshows/_production/TODAY-ready/ss-141026-AT/ss-141026-AT-tease.jpg",
    "https://www.hdnicewallpapers.com/Walls/Big/Cat/Animal_Cat_Shocking_Photo.jpg",
  ];

  const getRandomImage = () => {
    return randomImages[Math.floor(Math.random() * randomImages.length)];
  };

  // run this snippet only when app is first mounted
  useEffect(() => {
    const fetchUser = async () => {
      // get authenticated user from auth
      const userInfo = await Auth.currentAuthenticatedUser({
        bypassCache: true,
      });
      console.log(userInfo);

      if (userInfo) {
        const userData = await API.graphql(
          graphqlOperation(getUser, { id: userInfo.attributes.sub })
        );
        console.log(userInfo.attributes.sub);
        console.log(
          "*************************************************************"
        );
        console.log(userData);
        console.log(
          "*************************************************************"
        );
        // get the user from backend with user id from auth
        if (userData.data.getUser) {
          console.log("user is already registered in db");
          return;
        }
        const newUser = {
          id: userInfo.attributes.sub,
          name: userInfo.username,
          imageUri: getRandomImage(),
          status: "Hi, I am on LetsChat!",
        };

        // if there is no user in db with the id, create one
        await API.graphql(graphqlOperation(createUser, { input: newUser }));
      }
    };
    fetchUser();
  }, []);

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <Navigation colorScheme={colorScheme} />
        <StatusBar />
      </SafeAreaProvider>
    );
  }
}

export default withAuthenticator(App);
