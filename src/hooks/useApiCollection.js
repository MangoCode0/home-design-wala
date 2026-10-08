import { useCallback, useEffect, useState } from "react";
import { getApi } from "../api/client";

function useApiCollection(path, { authenticated = false } = {}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [revision, setRevision] = useState(0);

  const reload = useCallback(() => setRevision((current) => current + 1), []);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");

    getApi(path, { authenticated })
      .then((result) => {
        if (!Array.isArray(result)) throw new Error(`Expected a collection from ${path}.`);
        if (active) setItems(result);
      })
      .catch((requestError) => {
        if (active) setError(requestError.message || "Unable to load this collection.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [path, authenticated, revision]);

  return { items, setItems, loading, error, reload };
}

export default useApiCollection;
