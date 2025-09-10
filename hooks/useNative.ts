import { useState, useCallback } from "react";

export function useNative(initialValue: boolean = false) {
  const [isNative, setIsNative] = useState(initialValue);

  const toggleIsNative = useCallback(() => {
    setIsNative((prev) => !prev);
  }, []);

  return { isNative, toggleIsNative, setIsNative };
}
