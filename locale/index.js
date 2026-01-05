import en from './en.json'
import zh from './zh.json'

const messages = {
	en,
	zh,
	'zh-Hans': zh
}

export function setLanguage(lang) {
	uni.setStorageSync('language', lang)
	uni.setLocale(lang)
}

export function getLanguage() {
	return uni.getLocale() || 'en'
}

export function t(key) {
	const lang = getLanguage()
	return messages[lang]?.[key] || key
}