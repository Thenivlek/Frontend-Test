import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  FlatList,
  Alert,
} from "react-native";
import { useSymbolContext } from "../context/SymbolContext";

const ListControl: React.FC = () => {
  const {
    symbolLists,
    activeList,
    setActiveList,
    addSymbolList,
    removeSymbolList,
  } = useSymbolContext();

  const [open, setOpen] = useState(false);

  const names = Object.keys(symbolLists);

  const confirmDelete = (name: string) => {
    Alert.alert("Excluir lista", `Tem certeza que deseja excluir "${name}"?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: () => removeSymbolList(name),
      },
    ]);
  };

  return (
    <View style={styles.wrapper}>
      <Pressable style={styles.select} onPress={() => setOpen(true)}>
        <Text style={styles.selectText}>{activeList}</Text>
        <Text style={styles.caret}>▾</Text>
      </Pressable>

      <Pressable style={styles.addBtn} onPress={() => addSymbolList()}>
        <Text style={styles.addIcon}>＋</Text>
      </Pressable>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)} />
        <View style={styles.modal}>
          <FlatList
            data={names.sort()}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <View style={styles.optionRow}>
                <Pressable
                  style={styles.optionPress}
                  onPress={() => {
                    setActiveList(item);
                    setOpen(false);
                  }}
                >
                  <Text style={styles.optionText}>{item}</Text>
                </Pressable>

                <Pressable
                  style={styles.deletePill}
                  onPress={() => confirmDelete(item)}
                >
                  <Text style={styles.deleteX}>×</Text>
                </Pressable>
              </View>
            )}
          />
        </View>
      </Modal>
    </View>
  );
};

export default ListControl;

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  select: {
    flex: 1,
    height: 40,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  selectText: { flex: 1, fontSize: 14, color: "#333" },
  caret: { fontSize: 16, color: "#666" },
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: 6,
    backgroundColor: "#16939A",
    alignItems: "center",
    justifyContent: "center",
  },
  addIcon: { color: "#fff", fontSize: 20, fontWeight: "bold", marginTop: -2 },
  backdrop: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.15)",
  },
  modal: {
    position: "absolute",
    left: 12,
    right: 12,
    top: 90,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
    overflow: "hidden",
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  optionPress: { flex: 1, paddingHorizontal: 12, paddingVertical: 12 },
  optionText: { fontSize: 14, color: "#222" },
  deletePill: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FDECEC",
  },
  deleteX: { fontSize: 18, color: "#C62828", marginTop: -2 },
});
