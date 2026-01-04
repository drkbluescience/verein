import { FIBU_KATEGORIEN } from '../../../types/easyFiBu.types';

const FIBU_KATEGORIEN_TRANSLATION_KEYS: Record<keyof typeof FIBU_KATEGORIEN, string> = {
  IDEELLER_BEREICH: 'ideellerBereich',
  VERMOEGENSVERWALTUNG: 'vermoegensverwaltung',
  ZWECKBETRIEB: 'zweckbetrieb',
  WIRTSCHAFTLICHER_BETRIEB: 'wirtschaftlicherBetrieb',
  DURCHLAUFENDE_POSTEN: 'durchlaufendePosten',
};

type Translator = (key: string, ...args: unknown[]) => string;

export interface KategorieOption {
  key: keyof typeof FIBU_KATEGORIEN;
  value: string;
  label: string;
}

export const getKategorieLabel = (t: Translator, key: keyof typeof FIBU_KATEGORIEN): string => {
  const translationKey = FIBU_KATEGORIEN_TRANSLATION_KEYS[key];
  if (!translationKey) {
    return FIBU_KATEGORIEN[key];
  }

  return t(`finanz:easyFiBu.konten.kategorien.${translationKey}`, {
    defaultValue: FIBU_KATEGORIEN[key],
  });
};

export const getKategorieOptions = (t: Translator): KategorieOption[] => {
  return (Object.keys(FIBU_KATEGORIEN) as Array<keyof typeof FIBU_KATEGORIEN>).map((key) => ({
    key,
    value: FIBU_KATEGORIEN[key],
    label: getKategorieLabel(t, key),
  }));
};

export const getKategorieLabelByValue = (t: Translator, value: string): string => {
  const key = (Object.keys(FIBU_KATEGORIEN) as Array<keyof typeof FIBU_KATEGORIEN>).find(
    (entryKey) => FIBU_KATEGORIEN[entryKey] === value,
  );
  if (!key) return value;
  return getKategorieLabel(t, key);
};

export const getLocalizedKontoName = (
  konto: { bezeichnung: string; bezeichnungTr?: string },
  language: string,
): string => {
  if (language?.toLowerCase().startsWith('tr') && konto.bezeichnungTr) {
    return konto.bezeichnungTr;
  }
  return konto.bezeichnung;
};
