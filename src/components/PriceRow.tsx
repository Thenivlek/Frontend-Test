import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

interface PriceData {
  c: string; // último preço
  b: string; // melhor bid
  a: string; // melhor ask
  P: string; // variação %
}

const PriceRow = ({ symbol }: { symbol: string }) => {
  const [data, setData] = useState<PriceData | null>(null);

  useEffect(() => {
    const wsUrl = `wss://data-stream.binance.com/stream?streams=${symbol.toLowerCase()}@ticker`;
    const ws = new WebSocket(wsUrl);

    ws.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);

        if (parsed?.data) {
          const ticker = parsed.data;
          setData({
            c: ticker.c,
            b: ticker.b,
            a: ticker.a,
            P: ticker.P,
          });
        }
      } catch (err) {
        console.error(err);
      }
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
      <Text style={styles.cell}>{data?.c ?? "-"}</Text>
      <Text style={styles.cell}>{data?.b ?? "-"}</Text>
      <Text style={styles.cell}>{data?.a ?? "-"}</Text>
      <Text style={[styles.cell, styles.change, styles.badge]}>
        {data?.P ? `${parseFloat(data.P).toFixed(2)}%` : "-"}
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
