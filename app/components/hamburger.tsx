// components/hamburger.tsx
import { AntDesign } from "@expo/vector-icons";
import {
  DrawerNavigationProp,
  useDrawerStatus,
} from "@react-navigation/drawer";
import { useNavigation } from "expo-router";
import React, { useEffect } from "react";
import { Pressable } from "react-native";

const HamburgerButton = () => {
  const isDrawerIsOpen = useDrawerStatus() === "open";

  const navigation = useNavigation<DrawerNavigationProp<{}>>();
  useEffect(() => {
    console.log("Drawer open status changed:", isDrawerIsOpen);
  }, [isDrawerIsOpen]);

  return (
    <>
      <Pressable
        onPress={() => navigation.toggleDrawer()}
        style={{ paddingHorizontal: 15 }}
      >
        {isDrawerIsOpen ? (
          <AntDesign name="menufold" size={24} color="black" />
        ) : (
          <AntDesign name="menuunfold" size={24} color="black" />
        )}
      </Pressable>
    </>
  );
};

export default HamburgerButton;
