import React, { createContext, useContext, useMemo, useState } from "react";

type SymbolLists = Record<string, string[]>;

type Ctx = {
  symbolLists: SymbolLists;
  activeList: string;
  setActiveList: (name: string) => void;
  addSymbolList: (name?: string) => string;
  removeSymbolList: (name: string) => void;
  addSymbolsToActiveList: (symbols: string[]) => void;
  removeSymbolFromActiveList: (symbol: string) => void;
  getActiveSymbols: () => string[];
};

const DEFAULT_LIST = "List A";

const SymbolContext = createContext<Ctx | null>(null);

export const SymbolProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [symbolLists, setSymbolLists] = useState<SymbolLists>({
    [DEFAULT_LIST]: [],
  });
  const [activeList, setActiveList] = useState<string>(DEFAULT_LIST);

  const addSymbolList = (name?: string) => {
    let newName = name?.trim();
    if (!newName) {
      const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      let i = 0;
      while (i < letters.length) {
        const cand = `List ${letters[i]}`;
        if (!symbolLists[cand]) {
          newName = cand;
          break;
        }
        i++;
      }
      if (!newName) newName = `List ${Object.keys(symbolLists).length + 1}`;
    }
    if (symbolLists[newName]) return newName;
    setSymbolLists((prev) => ({ ...prev, [newName!]: [] }));
    setActiveList(newName!);
    return newName!;
  };

  const removeSymbolList = (name: string) => {
    setSymbolLists((prev) => {
      const copy = { ...prev };
      delete copy[name];
      // escolher próxima ativa
      const names = Object.keys(copy);
      if (!names.length) {
        copy[DEFAULT_LIST] = [];
        setActiveList(DEFAULT_LIST);
      } else if (activeList === name) {
        setActiveList(names[0]);
      }
      return copy;
    });
  };

  const addSymbolsToActiveList = (symbols: string[]) => {
    setSymbolLists((prev) => {
      const current = prev[activeList] ?? [];
      const merged = Array.from(new Set([...current, ...symbols]));
      return { ...prev, [activeList]: merged };
    });
  };

  const removeSymbolFromActiveList = (symbol: string) => {
    setSymbolLists((prev) => ({
      ...prev,
      [activeList]: (prev[activeList] ?? []).filter((s) => s !== symbol),
    }));
  };

  const getActiveSymbols = () => symbolLists[activeList] ?? [];

  const value = useMemo(
    () => ({
      symbolLists,
      activeList,
      setActiveList,
      addSymbolList,
      removeSymbolList,
      addSymbolsToActiveList,
      removeSymbolFromActiveList,
      getActiveSymbols,
    }),
    [symbolLists, activeList]
  );

  return (
    <SymbolContext.Provider value={value}>{children}</SymbolContext.Provider>
  );
};

export const useSymbolContext = () => {
  const ctx = useContext(SymbolContext);
  if (!ctx)
    throw new Error("useSymbolContext must be used within SymbolProvider");
  return ctx;
};
