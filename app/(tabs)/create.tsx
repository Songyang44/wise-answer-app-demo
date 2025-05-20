import WorkspaceCard from "@/app/components/workspaceCard";
import AntDesign from "@expo/vector-icons/AntDesign";
import * as DocumentPicker from "expo-document-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import {
  StartUpload,
  UploadFailure,
  UploadSuccess,
} from "../slices/create-slice";

export default function Create() {
  const [pressed, setPressed] = useState(false);
  const dispatch = useAppDispatch();
  const uploading = useAppSelector((state) => state.create.uploading);
  const fileUrl = useAppSelector((state) => state.create.fileUrl);
  const [workspaces, setWorkspaces] = useState([
    { id: "1", name: "workspace 1" },
    { id: "2", name: "workspace 2" },
    { id: "3", name: "workspace 3" },
    { id: "4", name: "workspace 4" },
    { id: "5", name: "workspace 5" },
  ]);
  const router = useRouter();

  const handleUpload = async () => {
    if (uploading) return;

    try {
      const result = await DocumentPicker.getDocumentAsync({
        copyToCacheDirectory: true,
        type: ["application/pdf", "image/*"],
      });

      if (result.canceled) return;

      const file = result.assets[0];
      dispatch(StartUpload());

      // 模拟上传（实际应替换为真实API调用）
      await new Promise((resolve) => setTimeout(resolve, 2000));

      dispatch(UploadSuccess(file.uri));
      Alert.alert("Upload Success", "File uploaded successfully");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error";
      dispatch(UploadFailure(message));
      Alert.alert("Upload Failed", message);
    }
  };

  const handleAddWorkSpace = () => {
    router.push('/components/createWorkSpaceCard');
  };

  return (
    <View style={styles.container}>
      
      <FlatList
        data={workspaces}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <WorkspaceCard id={item.id} name={item.name} />
        )}
        contentContainerStyle={styles.list}
        numColumns={2}
      />
      <Pressable
        onPress={handleAddWorkSpace}
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}
        disabled={uploading}
        style={({ pressed }) => [
          styles.iconContainer,
          pressed && styles.pressed,
          uploading && styles.disabled,
        ]}
      >
        {uploading ? (
          <ActivityIndicator size="large" color="#007AFF" />
        ) : (
          <AntDesign
            name="pluscircle"
            size={56}
            color={pressed ? "#666" : "#007AFF"}
            style={styles.icon}
          />
        )}
      </Pressable>

      {fileUrl && (
        <Text style={styles.fileText}>
          Selected File: {fileUrl.split("/").pop()}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 40,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  icon: {
    transform: [{ translateY: -2 }],
  },
  pressed: {
    transform: [{ scale: 0.92 }],
    opacity: 0.8,
  },
  disabled: {
    opacity: 0.6,
  },
  fileText: {
    marginTop: 20,
    color: "#666",
    fontSize: 14,
    maxWidth: "80%",
  },
  list: {
    alignItems: "center",
  },
});
