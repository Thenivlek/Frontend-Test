import React, { useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useSymbolContext } from "../context/SymbolContext";

type Quote = { last?: string; bid?: string; ask?: string; changePct?: string };

export default function PriceTableColumn() {
  const { getActiveSymbols } = useSymbolContext();
  const symbols = getActiveSymbols();
  const [quotes, setQuotes] = useState<Record<string, Quote>>({});

  useEffect(() => {
    setQuotes({});
    if (!symbols.length) return;

    const streams = symbols.map((s) => `${s.toLowerCase()}@ticker`).join("/");

    const ws = new WebSocket(
      `wss://data-stream.binance.com/stream?streams=${streams}`
    );

    ws.onmessage = (e) => {
      try {
        const parsed = JSON.parse(e.data);
        const { stream, data } = parsed;
        if (!data) return;
        const sym = stream.split("@")[0].toUpperCase();

        setQuotes((prev) => {
          const q = { ...(prev[sym] || {}) };
          // ticker: c (last), P (percent), b (bid), a (ask)
          if (data.c !== undefined) q.last = data.c;
          if (data.P !== undefined) q.changePct = data.P;
          if (data.b !== undefined) q.bid = data.b;
          if (data.a !== undefined) q.ask = data.a;
          return { ...prev, [sym]: q };
        });
      } catch (err) {
        console.error(err);
      }
    };

    ws.onerror = (err) => console.error("WebSocket error:", err);

    return () => {
      ws.close();
    };
  }, [symbols.join(",")]);

  const rows = useMemo(
    () => symbols.map((s) => ({ s, ...quotes[s] })),
    [symbols, quotes]
  );
  const fmt = (v?: string, d = "-") => (v == null ? d : Number(v).toString());

  return (
    <View style={{ flex: 1, paddingHorizontal: 12 }}>
      <View style={styles.headerRow}>
        <Text style={[styles.hcell, styles.first]}>Symbol</Text>
        <Text style={styles.hcell}>Last Price</Text>
        <Text style={styles.hcell}>Bid Price</Text>
        <Text style={styles.hcell}>Ask Price</Text>
        <Text style={[styles.hcell, styles.last]}>Price Change (%)</Text>
      </View>

      <ScrollView style={styles.tbody}>
        {rows.map((r) => {
          const pct = Number(r.changePct ?? NaN);
          const up = !Number.isNaN(pct) && pct >= 0;
          return (
            <View key={r.s} style={styles.row}>
              <Text style={[styles.cell, styles.first]}>{r.s}</Text>
              <Text style={styles.cell}>{fmt(r.last)}</Text>
              <Text style={styles.cell}>{fmt(r.bid)}</Text>
              <Text style={styles.cell}>{fmt(r.ask)}</Text>
              <View style={[styles.cell, styles.badgeWrap]}>
                <View
                  style={[styles.badge, up ? styles.badgeUp : styles.badgeDown]}
                >
                  <Text
                    style={[
                      styles.badgeText,
                      up ? styles.badgeTextUp : styles.badgeTextDown,
                    ]}
                  >
                    {r.changePct != null
                      ? `${Number(r.changePct).toFixed(2)}%`
                      : "-"}
                  </Text>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    marginTop: 8,
    flexDirection: "row",
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#E3E3E3",
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: "center",
  },
  tbody: {
    borderWidth: 1,
    borderColor: "#E3E3E3",
    borderTopWidth: 0,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  hcell: {
    flex: 1,
    fontSize: 12,
    fontWeight: "500",
    color: "#333",
    textAlign: "center",
  },
  cell: { flex: 1, color: "#222", textAlign: "center", fontSize: 12 },
  first: { flex: 1.2 },
  last: { flex: 1.2, textAlign: "center" },
  badgeWrap: { alignItems: "center" },
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: "#E9F7EF",
  },
  badgeUp: { backgroundColor: "#E7F6EF" },
  badgeDown: { backgroundColor: "#FDECEC" },
  badgeText: { fontWeight: "600" },
  badgeTextUp: { color: "#2E7D32" },
  badgeTextDown: { color: "#C62828" },
});
