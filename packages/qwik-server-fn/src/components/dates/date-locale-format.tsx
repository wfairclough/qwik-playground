import { component$, useBrowserVisibleTask$, useSignal } from '@builder.io/qwik';

export interface DateLocaleFormatProps {
  date: Date;
  locale?: string;
  options?: Intl.DateTimeFormatOptions;
}

export const DateLocaleFormat = component$((props: DateLocaleFormatProps) => {
  const { date, locale: localeOverride, options } = props;
  const locale = useSignal(localeOverride);

  if (!localeOverride) {
    useBrowserVisibleTask$(() => {
      const navLocale = navigator.language;
      locale.value = navLocale;
    });
  }

  const formattedDate = new Intl.DateTimeFormat(locale.value, options).format(date);
  return <span>{ formattedDate }</span>;
});
