import { useRouter } from "expo-router";
import React from "react";
import { Image, Pressable, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

const defaultAvatar = require('@/assets/images/defaultAvatar.png');

const AvatarHeader = () => {
  const router = useRouter();

  const userData = useSelector((state: RootState) => state.user.user);
  

  const avatarUri = userData?.avatarUrl;

  return (
    <Pressable onPress={() => router.push("/profile")}>
      <Image
        source={avatarUri ? { uri: avatarUri } : defaultAvatar}
        style={styles.avatar}
        
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  avatar: {
    width: 36,
    borderColor:"#666",
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
});

export default AvatarHeader;
