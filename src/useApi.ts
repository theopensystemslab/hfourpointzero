import axios from "axios";
import { useEffect, useState } from "react";

export function useApi(url: string, method = "get") {
  const [data, setData] = useState([]);
  const [err, setErr] = useState();
  const [loading, setLoading] = useState(true);

  async function fetchUrl() {
    console.log(`fetching ${url}`);
    try {
      const { data } = await axios[method](url);
      setData(data);
    } catch (e) {
      setErr(e);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchUrl();
  }, []);
  return [data, loading, err];
}
