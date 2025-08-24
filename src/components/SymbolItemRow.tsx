import React, { memo } from "react";
import { TouchableOpacity, Text, StyleSheet, Switch } from "react-native";

interface Props {
  symbol: string;
  selected: boolean;
  onSelect: () => void;
}

const SymbolItemRow = ({ symbol, selected, onSelect }: Props) => {
  return (
    <TouchableOpacity style={styles.row} onPress={onSelect}>
      <Text style={styles.text}>{symbol}</Text>
      <Switch value={selected} onValueChange={onSelect} />
    </TouchableOpacity>
  );
};

export default memo(SymbolItemRow);

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#eee",
    alignItems: "center",
  },
  text: { fontSize: 16 },
});
