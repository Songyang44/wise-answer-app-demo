import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function WorkspaceCard(workspaces: { id?: any; name?: any }) {
  const router = useRouter();

  
  return (
    <View style={styles.cardContainer}>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{workspaces.name}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: 150,
    height: 150,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  contentContainer: {
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  iconContainer: {
    padding: 10,
  },
  icon: {
    transform: [{ translateY: -2 }],
  },
  pressed: {
    transform: [{ scale: 0.92 }],
    opacity: 0.8,
  },
});
