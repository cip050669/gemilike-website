import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ requestLocale }) => {
  // Request the locale like this, otherwise it might be undefined
  const locale = await requestLocale;
  
  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});

