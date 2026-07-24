
import {getRequestConfig} from 'next-intl/server';
import {hasLocale} from 'next-intl';
import {routing} from './routing';
import deMessages from '../messages/de.json';
import enMessages from '../messages/en.json';
import frMessages from '../messages/fr.json';

const messages = {
  de: deMessages,
  en: enMessages,
  fr: frMessages
};
 
export default getRequestConfig(async ({requestLocale}) => {
  // Static for now, we'll change this later
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;
 
  return {
    locale,
    messages: messages[locale]
  };
});