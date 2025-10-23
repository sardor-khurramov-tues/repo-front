const LOCAL_STORAGE_LANG = "lang";
const LANG_EN = "en";
const LANG_UZ = "uz";
const LANG_RU = "ru";
const LANG_DEFAULT = LANG_EN;

export const getLang = () => {
  let lang = localStorage.getItem(LOCAL_STORAGE_LANG);
  if (!lang) {
    lang = LANG_DEFAULT;
    localStorage.setItem(LOCAL_STORAGE_LANG, lang);
  }
  return lang;
};

export const setLangToEn = () => {
  localStorage.setItem(LOCAL_STORAGE_LANG, LANG_EN);
  return LANG_EN;
};

export const setLangToUz = () => {
  localStorage.setItem(LOCAL_STORAGE_LANG, LANG_UZ);
  return LANG_UZ;
};

export const setLangToRu = () => {
  localStorage.setItem(LOCAL_STORAGE_LANG, LANG_RU);
  return LANG_RU;
};
