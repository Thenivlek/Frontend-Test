import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  Platform,
  StatusBar,
  TouchableOpacity,
  Text,
  View,
} from "react-native";
import { SymbolProvider } from "./src/context/SymbolContext";
import PriceTableColumn from "./src/components/PriceTableColumn";
import SymbolListColumn from "./src/components/SymbolListColumn";

import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";

const Drawer = createDrawerNavigator();
import type { DrawerNavigationProp } from "@react-navigation/drawer";
import ListControl from "./src/components/ListControl";

type HomeScreenProps = {
  navigation: DrawerNavigationProp<Record<string, object | undefined>, "Home">;
};

function HomeScreen({ navigation }: HomeScreenProps) {
  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.openDrawer()}
          style={styles.menuButton}
        >
          <Text style={styles.menuText}>☰</Text>
        </TouchableOpacity>
      </View>

      {/* === Dropdown + botão teal === */}
      <ListControl />

      {/* Tabela */}
      <View style={{ flex: 1 }}>
        <PriceTableColumn />
      </View>
    </SafeAreaView>
  );
}

export default function App() {
  const statusBarHeight =
    Platform.OS === "android" ? StatusBar.currentHeight : 44;

  return (
    <SymbolProvider>
      <SafeAreaView
        style={{ ...styles.container, paddingTop: statusBarHeight }}
      >
        <NavigationContainer>
          <Drawer.Navigator
            initialRouteName="Home"
            screenOptions={{
              headerShown: false,
              drawerType: "slide",
              overlayColor: "transparent",
              drawerStyle: { width: 250, backgroundColor: "#FFFFFF" },
            }}
            drawerContent={() => <SymbolListColumn />}
          >
            <Drawer.Screen name="Home" component={HomeScreen} />
          </Drawer.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </SymbolProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  screen: { flex: 1, backgroundColor: "#FFFFFF" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  menuButton: {
    padding: 8,
    marginRight: 10,
  },
  menuText: { fontSize: 24 },
  headerTitle: { fontSize: 18, fontWeight: "bold" },
});
