import CustomDrawer from "@/app/components/customDrawer";
import HamburgerButton from "@/app/components/hamburger";
import { Drawer } from "expo-router/drawer";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider } from "react-redux";
import { store } from "../app/store/store";
import { useAppDispatch } from "./hooks/hooks";
import { getCurrentUserSession } from "./lib/session";
import { loginSuccess } from "./slices/user-slice";
import AvatarHeader from "./components/avatarHeader";

const RootLayout = () => {
  return (
    <>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Provider store={store}>
          <Layout />
        </Provider>
      </GestureHandlerRootView>
    </>
  );
};

const Layout = () => {
  const disPatch = useAppDispatch();
  useEffect(() => {
    getCurrentUserSession()
      .then(({ id, avatarUrl }) => {
        disPatch(loginSuccess({ id, avatarUrl }));
      })
      .catch(() => {
        console.log("No Active Session");
      });
  }, []);
  return (
    <>
      <Drawer
        drawerContent={CustomDrawer}
        screenOptions={{
          headerLeft: () => <HamburgerButton />,
          headerTitle: "",
          drawerType: "slide",
          headerRight:()=><AvatarHeader />
        }}
      >
        <Drawer.Screen
          name="tabs"
          options={{
            title: "Main",
          }}
        />
        <Drawer.Screen
          name="modals"
          options={{
            title: "Main",
          }}
        />
      </Drawer>
    </>
  );
};

export default RootLayout;
