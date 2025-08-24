import React from "react";
import { render, fireEvent } from "@testing-library/react-native";

// Mock do contexto
const mockSetActiveList = jest.fn();
const mockAddSymbolList = jest.fn();
const mockRemoveSymbolList = jest.fn();

jest.mock("../context/SymbolContext", () => ({
  useSymbolContext: () => ({
    symbolLists: { list1: [], list2: [] },
    activeList: "list1",
    setActiveList: mockSetActiveList,
    addSymbolList: mockAddSymbolList,
    removeSymbolList: mockRemoveSymbolList,
  }),
}));

// Mock do Alert
import { Alert } from "react-native";
import ListControl from "../components/ListControl";
jest.spyOn(Alert, "alert");

describe("ListControl", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza corretamente com lista ativa", () => {
    const { getByText } = render(<ListControl />);
    expect(getByText("list1")).toBeTruthy();
    expect(getByText("▾")).toBeTruthy();
    expect(getByText("+")).toBeTruthy();
  });

  it("abre o modal ao clicar no dropdown", () => {
    const { getByText, queryByText } = render(<ListControl />);
    expect(queryByText("list2")).toBeNull(); // modal fechado
    fireEvent.press(getByText("list1"));
    expect(queryByText("list2")).toBeTruthy(); // modal aberto
  });

  it("altera a lista ativa ao selecionar uma opção", () => {
    const { getByText } = render(<ListControl />);
    fireEvent.press(getByText("list1")); // abre modal
    fireEvent.press(getByText("list2")); // seleciona
    expect(mockSetActiveList).toHaveBeenCalledWith("list2");
  });

  it("chama addSymbolList ao clicar no botão +", () => {
    const { getByText } = render(<ListControl />);
    fireEvent.press(getByText("+"));
    expect(mockAddSymbolList).toHaveBeenCalled();
  });

  it("mostra alerta ao clicar no botão de deletar", async () => {
    const { getByText, getAllByText } = render(<ListControl />);
    fireEvent.press(getByText("list1")); // abre modal

    // pega o primeiro botão de delete
    fireEvent.press(getAllByText("×")[0]);
    expect(Alert.alert).toHaveBeenCalledWith(
      "Delete list",
      'Are you sure you want to delete "list1"?',
      expect.any(Array)
    );
  });

  it("remove lista quando confirma o alerta", async () => {
    Alert.alert = jest.fn((title, msg, buttons) => {
      const deleteButton = buttons?.find((b) => b.text === "Delete");
      deleteButton?.onPress?.();
    });

    const { getByText, getAllByText } = render(<ListControl />);
    fireEvent.press(getByText("list1")); // abre modal
    fireEvent.press(getAllByText("×")[0]); // pega o primeiro botão de delete
    expect(mockRemoveSymbolList).toHaveBeenCalledWith("list1");
  });
});
