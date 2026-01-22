import zh from './zh.json'

const messages = {
	zh,
	'zh-Hans': zh
}

export function setLanguage(lang) {
	uni.setStorageSync('language', lang)
	uni.setLocale(lang)
}

export function getLanguage() {
	return uni.getLocale() || 'zh'
}

export function t(key) {
	const lang = getLanguage()
	return messages[lang]?.[key] || key
}