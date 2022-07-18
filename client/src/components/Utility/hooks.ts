import { useState, useEffect } from "react";
import axios from "axios";

export const useTokenValidation = (
  token: string | null,
  username: string | null
) => {
  const [isLoading, setIsLoading] = useState(true);
  const [tokenData, setTokenData] = useState<boolean>(false);

  if (!token) {
    token = "null";
  }

  let config = {
    headers: {
      auth: token,
    },
  };

  useEffect(() => {
    axios.post("/validateToken", { user: username }, config).then((data) => {
      setTokenData(data.data.status);
      setIsLoading(false);
    });
  }, []);

  return { isLoading, tokenData };
};
