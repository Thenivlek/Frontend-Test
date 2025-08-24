import { useEffect, useState } from "react";

export const useWebSocket = (url: string) => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const socket = new WebSocket(url);
    socket.onmessage = (event) => {
      const parsedData = JSON.parse(event.data);
      setData(parsedData);
    };
    return () => socket.close();
  }, [url]);

  return data;
};
