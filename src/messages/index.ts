import { en } from './en';
import { te } from './te';
import { hi } from './hi';
import { useAppStore } from '../stores/appStore';

export type Language = 'en' | 'te' | 'hi';

export const translations = {
  en,
  te,
  hi
};

export function useTranslation() {
  const language = useAppStore((state) => state.language);
  const setLanguage = useAppStore((state) => state.setLanguage);

  const t = translations[language] || translations.en;

  return { t, language, setLanguage };
}
