import { useEffect, useState } from "react";
import { getApi } from "../api/client";

function useApiResource(path, { authenticated = false } = {}) {
  const [value, setValue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    getApi(path, { authenticated })
      .then((result) => {
        if (active) setValue(result);
      })
      .catch((requestError) => {
        if (active) setError(requestError.message || "Unable to load this information.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [path, authenticated]);

  return { value, setValue, loading, error };
}

export default useApiResource;
