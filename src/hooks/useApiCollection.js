import { useEffect, useState } from "react";
import { getApi } from "../api/client";

function useApiCollection(path, fallbackItems) {
  const [items, setItems] = useState(fallbackItems);

  useEffect(() => {
    let active = true;

    getApi(path)
      .then((result) => {
        if (!Array.isArray(result)) {
          console.warn(
            `Expected an array from ${path}; keeping local sample data. The backend route currently returns a placeholder.`,
            result,
          );
          return;
        }

        if (active) setItems(result);
      })
      .catch((error) => {
        if (active) {
          console.error(`Could not load ${path}; keeping local sample data.`, error);
        }
      });

    return () => {
      active = false;
    };
  }, [path]);

  return [items, setItems];
}

export default useApiCollection;
