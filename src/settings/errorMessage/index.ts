import Assets from '@util/Assets';
import path from 'path';

export default (locale: string): ((arg0: string) => string) => {
  const locales = Assets.dirCollector(
    path.join(process.cwd(), '/src/settings/errorMessage/locale'),
  );

  const res = locales[locale];
  if (!res) {
    return locales.en_us;
  }

  return res;
};
