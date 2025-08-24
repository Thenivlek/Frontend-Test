import React, { useEffect, useState } from "react";
import { View, Text, Button, ScrollView, StyleSheet } from "react-native";
import { fetchSymbols } from "../services/binanceApi";
import { useSymbolContext } from "../context/SymbolContext";
//import { SymbolItem } from "./SymbolItem";

export const SymbolList: React.FC = () => {
  const [allSymbols, setAllSymbols] = useState<string[]>([]);
  const { symbols, addSymbol, removeSymbol } = useSymbolContext();

  useEffect(() => {
    const loadSymbols = async () => {
      const symbols = await fetchSymbols();
      setAllSymbols(symbols.slice(0, 50)); // limitar para testar
    };
    loadSymbols();
  }, []);

  return (
    <ScrollView>
      <Text style={styles.title}>Available Symbols</Text>
      {allSymbols.map((symbol) => (
        <View key={symbol} style={styles.row}>
          <Text>{symbol}</Text>
          <Button title="Add" onPress={() => addSymbol(symbol)} />
        </View>
      ))}

      <Text style={styles.title}>Selected Symbols</Text>
      {/*symbols.map((symbol) => (
        <SymbolItem
          key={symbol}
          symbol={symbol}
          onRemove={() => removeSymbol(symbol)}
        />
      ))*/}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  title: { fontSize: 18, fontWeight: "bold", marginVertical: 10 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
  },
});
