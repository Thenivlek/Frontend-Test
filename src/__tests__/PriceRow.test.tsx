import React from "react";
import { render, act } from "@testing-library/react-native";
import PriceRow from "../components/PriceRow";

describe("PriceRow", () => {
  let mockWebSocket: any;

  beforeEach(() => {
    // Mock global do WebSocket
    mockWebSocket = {
      onmessage: jest.fn(),
      onerror: jest.fn(),
      close: jest.fn(),
      send: jest.fn(),
    };
    (global as any).WebSocket = jest.fn(() => mockWebSocket);
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza corretamente com valores iniciais", () => {
    const { getByText, getAllByText } = render(<PriceRow symbol="BTCUSDT" />);
    expect(getByText("BTCUSDT")).toBeTruthy();

    const allDashes = getAllByText("-");
    expect(allDashes.length).toBe(4); // c, b, a, P
  });

  it("atualiza dados quando WebSocket envia mensagem", () => {
    const { getByText } = render(<PriceRow symbol="BTCUSDT" />);

    const messageData = {
      c: "30000",
      b: "29990",
      a: "30010",
      P: "1.23",
    };

    // Simula o recebimento da mensagem
    act(() => {
      mockWebSocket.onmessage({ data: JSON.stringify(messageData) });
    });

    expect(getByText("30000")).toBeTruthy(); // last price
    expect(getByText("29990")).toBeTruthy(); // bid
    expect(getByText("30010")).toBeTruthy(); // ask
    expect(getByText("1.23%")).toBeTruthy(); // change
  });

  it("fecha WebSocket ao desmontar", () => {
    const { unmount } = render(<PriceRow symbol="BTCUSDT" />);
    unmount();
    expect(mockWebSocket.close).toHaveBeenCalled();
  });

  it("loga erro do WebSocket", () => {
    render(<PriceRow symbol="BTCUSDT" />);
    const error = new Error("WebSocket error");
    act(() => {
      mockWebSocket.onerror(error);
    });
    expect(console.error).toHaveBeenCalledWith("WebSocket error:", error);
  });
});
