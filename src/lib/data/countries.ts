import countries from "i18n-iso-countries";
import en from "i18n-iso-countries/langs/en.json";

countries.registerLocale(en);

export const COUNTRY_NAMES: string[] = Object.values(countries.getNames("en", { select: "official" })).sort(
  (a, b) => a.localeCompare(b)
);
