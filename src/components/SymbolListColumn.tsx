import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { useSymbolContext } from "../context/SymbolContext";

export default function SymbolListColumn() {
  const [symbols, setSymbols] = useState<string[]>([]);
  const [filteredSymbols, setFilteredSymbols] = useState<string[]>([]);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [search, setSearch] = useState("");
  const { addSymbolsToActiveList } = useSymbolContext();

  useEffect(() => {
    (async () => {
      const res = await fetch("https://api.binance.com/api/v3/exchangeInfo");
      const json = await res.json();
      const allSymbols = json.symbols.map((s: any) => s.symbol);
      setSymbols(allSymbols);
      setFilteredSymbols(allSymbols);
    })();
  }, []);

  useEffect(() => {
    if (!search) {
      setFilteredSymbols(symbols);
    } else {
      setFilteredSymbols(
        symbols.filter((s) => s.toLowerCase().includes(search.toLowerCase()))
      );
    }
  }, [search, symbols]);

  const toggle = (sym: string) =>
    setSelected((prev) => ({ ...prev, [sym]: !prev[sym] }));

  const handleAdd = () => {
    const picked = Object.keys(selected).filter((k) => selected[k]);
    if (!picked.length) return;
    addSymbolsToActiveList(picked);
    setSelected({});
    Alert.alert("Success", "Symbols added to active list.");
  };

  const handleSelectAll = () => {
    const allSelected = filteredSymbols.every((s) => selected[s]);
    const newSelected: Record<string, boolean> = {};
    filteredSymbols.forEach((s) => {
      newSelected[s] = !allSelected; // se todos selecionados, desmarca, senão marca
    });
    setSelected((prev) => ({ ...prev, ...newSelected }));
  };

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <TextInput
        placeholder="Search"
        style={styles.searchInput}
        value={search}
        onChangeText={setSearch}
        selectTextOnFocus
      />

      <TouchableOpacity style={styles.headerRow}>
        <View
          style={[
            styles.checkbox,
            filteredSymbols.length > 0 &&
              filteredSymbols.every((s) => selected[s]) &&
              styles.checkboxOn,
          ]}
        >
          {filteredSymbols.length > 0 &&
          filteredSymbols.every((s) => selected[s]) ? (
            <Text style={styles.check}>✓</Text>
          ) : null}
        </View>
        <Text style={styles.headerText}>Symbol</Text>
      </TouchableOpacity>

      <FlatList
        data={filteredSymbols}
        keyExtractor={(i) => i}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => toggle(item)}
            style={[styles.row, selected[item] && styles.rowSelected]}
          >
            <View
              style={[styles.checkbox, selected[item] && styles.checkboxOn]}
            >
              {selected[item] && <Text style={styles.check}>✓</Text>}
            </View>
            <Text>{item}</Text>
          </Pressable>
        )}
      />

      <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
        <Text style={styles.addBtnText}>Add to List</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
  },
  selectAllBtn: {
    marginBottom: 10,
    height: 36,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  selectAllBtnText: {
    color: "#fff",
    fontWeight: "500",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  rowSelected: { backgroundColor: "#E7F6F8" },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: "#999",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxOn: { backgroundColor: "#16939A", borderColor: "#16939A" },
  check: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    lineHeight: 16,
  },
  addBtn: {
    marginTop: 10,
    height: 44,
    backgroundColor: "#16939A",
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  addBtnText: { color: "#fff", fontWeight: "500" },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 12,

    backgroundColor: "#f1f1f1", // cinza claro
    borderRadius: 4,
    marginBottom: 4,
  },
  headerText: {
    fontWeight: "600",
    color: "#333",
  },
});
