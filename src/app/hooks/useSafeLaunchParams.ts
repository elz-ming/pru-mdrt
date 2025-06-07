import { useState, useEffect } from "react";
import {
  retrieveLaunchParams,
  type RetrieveLPResult,
} from "@telegram-apps/sdk";

/**
 * A safe version of retrieveLaunchParams() that won’t throw outside Telegram.
 */
export function useSafeLaunchParams(): RetrieveLPResult | null {
  const [params, setParams] = useState<RetrieveLPResult | null>(null);

  useEffect(() => {
    try {
      const result = retrieveLaunchParams();
      setParams(result);
    } catch (err) {
      console.warn("Not in Telegram WebApp:", err);
      setParams(null);
    }
  }, []);

  return params;
}
