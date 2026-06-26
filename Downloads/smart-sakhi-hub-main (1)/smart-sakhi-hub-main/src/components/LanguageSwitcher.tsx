import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { LanguageCode } from "@/i18n";

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage, availableLanguages } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          id="language-switcher-btn"
          aria-label="Change language"
        >
          <Globe className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[160px]">
        {(Object.keys(availableLanguages) as LanguageCode[]).map((code) => {
          const lang = availableLanguages[code];
          const isActive = code === language;
          return (
            <DropdownMenuItem
              key={code}
              onClick={() => setLanguage(code)}
              className={`flex items-center gap-2 cursor-pointer ${
                isActive ? "bg-primary/10 text-primary font-semibold" : ""
              }`}
              id={`lang-option-${code}`}
            >
              <span className="text-base">{lang.flag}</span>
              <span>{lang.native}</span>
              {isActive && (
                <span className="ml-auto text-xs text-primary">✓</span>
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
