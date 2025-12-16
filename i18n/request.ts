// src/i18n/request.ts
import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";
import { IntlErrorCode } from "next-intl";

export default getRequestConfig(async () => {
  // Get locale from cookie or default to 'en'
  const cookieStore = await cookies();
  const locale = cookieStore.get("NEXT_LOCALE")?.value || "en";

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,

    // Handle translation errors gracefully - suppress all MISSING_MESSAGE errors
    onError: (error) => {
      if (error.code === IntlErrorCode.MISSING_MESSAGE) {
        // Silently ignore missing translations
        return;
      } else {
        // Log other errors normally
        console.error("i18n error:", error);
      }
    },

    // Provide fallback for missing messages
    getMessageFallback: ({ namespace, key, error }) => {
      const path = [namespace, key].filter((part) => part != null).join(".");

      if (error.code === IntlErrorCode.MISSING_MESSAGE) {
        // Return empty string for missing array items
        // This prevents the loop from crashing
        return "";
      }

      // For other errors, return the key
      return path;
    },
  };
});
