import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

const PriceRow = ({ symbol }: { symbol: string }) => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const wsUrl = `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@ticker`;
    const ws = new WebSocket(wsUrl);

    ws.onmessage = (event) => {
      const parsed = JSON.parse(event.data);

      setData(parsed);
    };

    ws.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    return () => {
      ws.close();
    };
  }, [symbol]);

  return (
    <View style={styles.priceRow}>
      <Text style={styles.cell}>{symbol}</Text>
      <Text style={styles.cell}>{data?.c ? data?.c.toString() : "-"}</Text>
      <Text style={styles.cell}>{data?.b ? data?.b.toString() : "-"}</Text>
      <Text style={styles.cell}>{data?.a ? data?.a.toString() : "-"}</Text>

      <Text style={[styles.cell, styles.change, styles.badge]}>
        {data ? `${parseFloat(data.P).toFixed(2)}%` : "-"}
      </Text>
    </View>
  );
};

export default PriceRow;

const styles = StyleSheet.create({
  priceRow: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    alignItems: "center",
    borderColor: "#FFFFFF",
    backgroundColor: "#FFFFFF",
  },
  cell: { flex: 1, textAlign: "center" },
  change: { color: "green" },
  badge: {
    backgroundColor: "#E6F9EE",
    paddingHorizontal: 5,
    paddingVertical: 5,
    borderRadius: 20,
    borderColor: "#FFFFFF",
  },
});
