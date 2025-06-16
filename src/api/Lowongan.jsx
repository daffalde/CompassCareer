import axios from "axios";
import { useEffect, useState } from "react";

export function useGetAllLowongan() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getData() {
      setLoading(true);
      try {
        const resp = await axios.get(
          `${import.meta.env.VITE_BACKEND}data/all-lowongan`
        );
        setData(resp.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    getData();
  }, []);

  return { data, loading };
}
