
import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';

import en from './locales/en.json';
import hi from './locales/hi.json';

const i18n = new I18n({
  en,
  hi,
});

i18n.locale = Localization.locale;
i18n.enableFallback = true;

export default i18n;
