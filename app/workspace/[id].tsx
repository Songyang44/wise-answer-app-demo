import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function WorkspacePage() {
  const { id } = useLocalSearchParams();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Workspace ID: {id}</Text>
    </View>
  );
}
