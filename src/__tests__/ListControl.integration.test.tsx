import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { Alert } from "react-native";

import { useSymbolContext } from "../context/SymbolContext";
import ListControl from "../components/ListControl";

// Mock do contexto
jest.mock("../context/SymbolContext");

describe("ListControl - integração", () => {
  const mockSetActiveList = jest.fn();
  const mockAddSymbolList = jest.fn();
  const mockRemoveSymbolList = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useSymbolContext as jest.Mock).mockReturnValue({
      symbolLists: { List1: [], List2: [] },
      activeList: "List1",
      setActiveList: mockSetActiveList,
      addSymbolList: mockAddSymbolList,
      removeSymbolList: mockRemoveSymbolList,
    });

    // Mock do Alert
    jest.spyOn(Alert, "alert").mockImplementation((title, message, buttons) => {
      // Simula clicar no botão "Delete" automaticamente
      const deleteButton = buttons?.find((b) => b.text === "Delete");
      deleteButton?.onPress && deleteButton.onPress();
    });
  });

  it("abre modal ao pressionar select e fecha ao clicar no backdrop", () => {
    const { getByTestId, queryByText } = render(<ListControl />);

    // Modal começa fechado
    expect(queryByText("List2")).toBeNull();

    // Abrir modal
    fireEvent.press(getByTestId("select-button"));
    expect(queryByText("List2")).toBeTruthy();

    // Fechar modal clicando no backdrop
    fireEvent.press(getByTestId("backdrop"));
    expect(queryByText("List2")).toBeNull();
  });

  it("altera lista ativa ao clicar em uma opção", () => {
    const { getByTestId } = render(<ListControl />);

    fireEvent.press(getByTestId("select-button")); // abrir modal
    fireEvent.press(getByTestId("option-List2")); // escolher nova lista

    expect(mockSetActiveList).toHaveBeenCalledWith("List2");
  });

  it("adiciona nova lista ao clicar no botão +", () => {
    const { getByTestId } = render(<ListControl />);
    fireEvent.press(getByTestId("add-button"));
    expect(mockAddSymbolList).toHaveBeenCalled();
  });

  it("chama removeSymbolList ao confirmar delete", async () => {
    const { getByTestId } = render(<ListControl />);

    fireEvent.press(getByTestId("select-button")); // abrir modal
    fireEvent.press(getByTestId("delete-List1")); // apertar delete

    await waitFor(() => {
      expect(mockRemoveSymbolList).toHaveBeenCalledWith("List1");
    });
  });
});
