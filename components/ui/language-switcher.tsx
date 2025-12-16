// components/ui/language-switcher.tsx
"use client";

import React from "react";
import { Globe } from "lucide-react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const languages = [
  { code: "en", name: "English", flag: "en" },
  { code: "fil", name: "Tagalog", flag: "fil" },
  // Add more languages as needed
];

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();

  const currentLanguage =
    languages.find((lang) => lang.code === locale) || languages[0];

  const handleLanguageChange = (languageCode: string) => {
    // Set cookie for persistence
    document.cookie = `NEXT_LOCALE=${languageCode}; path=/; max-age=31536000`;

    // Refresh to apply new locale
    router.refresh();
  };

  return (
    <Select value={locale} onValueChange={handleLanguageChange}>
      <SelectTrigger className="bg-primary flex w-auto items-center gap-2 rounded-lg border border-white/30 px-4 py-5 text-white backdrop-blur-md transition-all hover:opacity-80">
        <Globe className="h-5 w-5" />
        <SelectValue>
          <span className="text-sm font-medium">{currentLanguage.name}</span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="bg-light rounded-lg border border-white/20 backdrop-blur-md">
        {languages.map((language) => (
          <SelectItem
            key={language.code}
            value={language.code}
            className="text-dark hover:bg-primary focus:bg-primary hover:text-light data-[state=checked]:bg-primary data-[state=checked]:text-light my-1 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text">{language.flag}</span>
              <span className="font-medium">{language.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
