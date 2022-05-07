import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { useEffect } from "react";
import { LogBox } from "react-native";

import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";

import { withAuthenticator } from "aws-amplify-react-native";

import { getUser } from "./src/graphql/queries";
import { createUser } from "./src/graphql/mutations";
import { Amplify, Auth, API, graphqlOperation } from "aws-amplify";
import awsconfig from "./src/aws-exports";

LogBox.ignoreLogs(["Remote debugger", "Setting a timer"]);

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
    "https://www.10wallpaper.com/wallpaper/1920x1440/1204/ladybug-Animal_photography_HD_wallpaper_1920x1440.jpg",
    "https://images2.minutemediacdn.com/image/upload/c_fill,g_auto,h_1248,w_2220/v1555929409/shape/mentalfloss/2061856957_992821eb82_5.jpg?itok=6HVpwgcJ",
    "https://www.hdnicewallpapers.com/Walls/Big/Cat/Animal_Cat_Shocking_Photo.jpg",
    "https://www.hdnicewallpapers.com/Walls/Big/Cat/Animal_Cat_Roaring_Image.jpg",
    "https://img1.wsimg.com/isteam/ip/5d73d6db-f86f-40e1-80c0-92ac07494800/a3df9255-1592-446b-8a40-f49f70a3b48c.jpg",
    "http://images2.fanpop.com/image/photos/14000000/Seal-Wallpaper-the-animal-kingdom-14060693-1280-960.jpg",
    "https://1.bp.blogspot.com/-lw4AwU1bmvs/Td5bry0ZSzI/AAAAAAAABrA/yFBCzRQULWw/s1600/badger9.jpg",
    "https://animalcorner.org/wp-content/uploads/2015/02/syrian-hamster-1-1-720x422.jpg",
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

      if (userInfo) {
        const usersData = await API.graphql(
          graphqlOperation(getUser, { id: userInfo.attributes.sub })
        );
        // get the user from backend with user id from auth
        if (usersData.data.getUser) {
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
