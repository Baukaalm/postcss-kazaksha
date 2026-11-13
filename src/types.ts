/** Қазақша атау → CSS атауы */
export type Dictionary = Readonly<Record<string, string>>;

export type DictionaryKind =
  | 'properties'
  | 'values'
  | 'functions'
  | 'selectors'
  | 'atRules'
  | 'mediaWords';

export interface Options {
  /**
   * Өз сөздеріңізді қосу немесе бар сөздерді қайта анықтау.
   * @example { values: { 'теңіз': '#1e90ff' } }
   */
  extend?: Partial<Record<DictionaryKind, Dictionary>>;
  /** Аударылмаған қазақша сөздерге ескерту шығару. Әдепкі: `false` */
  strict?: boolean;
}
