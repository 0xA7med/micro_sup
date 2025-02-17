import ar from '../i18n/ar.json';
type Language = 'ar' | 'en';
interface I18nStore {
    language: Language;
    translations: typeof ar;
    setLanguage: (lang: Language) => void;
}
export declare const useI18nStore: import("zustand").UseBoundStore<Omit<import("zustand").StoreApi<I18nStore>, "persist"> & {
    persist: {
        setOptions: (options: Partial<import("zustand/middleware").PersistOptions<I18nStore, I18nStore>>) => void;
        clearStorage: () => void;
        rehydrate: () => Promise<void> | void;
        hasHydrated: () => boolean;
        onHydrate: (fn: (state: I18nStore) => void) => () => void;
        onFinishHydration: (fn: (state: I18nStore) => void) => () => void;
        getOptions: () => Partial<import("zustand/middleware").PersistOptions<I18nStore, I18nStore>>;
    };
}>;
export {};
