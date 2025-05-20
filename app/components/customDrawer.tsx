import { DrawerContentScrollView } from "@react-navigation/drawer";
import { Pressable, Text } from "react-native";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";


// fake data
const fetchWorkspaces = async () => {
  return [
    { id: "ws1", name: "Workspace A" },
    { id: "ws2", name: "Workspace B" },
  ];
};

export default function CustomDrawer() {
  const router = useRouter();
  const [workspaces, setWorkspaces] = useState<{ id: string; name: string }[]>([]);


  useEffect(() => {
    fetchWorkspaces().then(setWorkspaces);
  }, []);

  return (
    <DrawerContentScrollView>
      {workspaces.map((ws) => (
        <Pressable
          key={ws.id}
          style={{ padding: 16 }}
          onPress={() => router.push({ pathname: "/workspace/[id]", params: { id: ws.id } })}
        >
          <Text>{ws.name}</Text>
        </Pressable>
      ))}
    </DrawerContentScrollView>
  );
}
