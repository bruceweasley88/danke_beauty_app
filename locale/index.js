import zhHans from './zh-Hans.json'
import zhTW from './zh-TW.json'
import zhHK from './zh-HK.json'
import en from './en.json'
import da from './da.json'
import fr from './fr.json'
import de from './de.json'
import ja from './ja.json'
import ko from './ko.json'
import es from './es.json'
import enUS from './en-US.json'

const messages = {
	'zh-Hans': zhHans,
	'zh-TW': zhTW,
	'zh-HK': zhHK,
	'en': en,
	'da': da,
	'fr': fr,
	'de': de,
	'ja': ja,
	'ko': ko,
	'es': es,
	'en-US': enUS
}

export function setLanguage(lang) {
	uni.setStorageSync('language', lang)
}

export function getLanguage() {
	return uni.getStorageSync('language') || uni.getLocale() || 'en'
}

export function t(key) {
	const lang = getLanguage()
	return messages[lang]?.[key] || key
}