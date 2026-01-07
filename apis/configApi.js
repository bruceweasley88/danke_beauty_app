import { get } from './requset.js'

/**
 * @description 获取应用版本信息
 * @param {Object} data - 请求参数对象
 * @param {number} [data.type] - 终端类型 (1: iOS, 2: Android)
 * @param {string} [data.versionNum] - 内部版本号（如"1.0.8"）
 * @param {number} [data.terminal] - 固定为1
 * @returns {Promise<Object>} 返回Promise对象，包含 {state: "0" || "1"} 1为需要更新
 */
export const configGetAppVersion = (data) => {
  return get('/api/config/getAppVersion', data)
}

/**
 * @description 获取审核配置信息
 * @returns {Promise<Object>} 返回Promise对象，包含审核相关配置
 */
export const configGetAudit = () => {
  return get('/api/config/getAudit')
}