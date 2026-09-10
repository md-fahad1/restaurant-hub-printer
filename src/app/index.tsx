import { Text, View } from "react-native";

export default function Index() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Restaurant Hub Printer</Text>
      <Text style={{ marginTop: 8, color: "#888" }}>
        Waiting for a print job...
      </Text>
    </View>
  );
}
