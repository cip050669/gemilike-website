import { getRequestConfig } from 'next-intl/server';
import { locales, defaultLocale } from '@/lib/i18n/config';

export default getRequestConfig(async ({ requestLocale }) => {
  // Request the locale like this, otherwise it might be undefined
  const locale = await requestLocale;
  const safeLocale = locales.includes(locale as typeof locales[number])
    ? (locale as typeof locales[number])
    : defaultLocale;
  
  return {
    locale: safeLocale,
    messages: (await import(`../messages/${safeLocale}.json`)).default
  };
});
