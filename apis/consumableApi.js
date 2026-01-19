import { get } from './requset.js'

/**
 * @description 获取用户耗材使用记录
 * @param {Object} data - 请求参数对象
 * @param {string} [data.token] - 用户认证token
 * @param {number} [data.consumableType] - 耗材类型 1：面膜 2：补水喷雾 3：文胸
 * @returns {Promise<Object>} 返回Promise对象，包含耗材使用记录列表
 */
export const getUserConsumableRecords = (data) => {
  return get('/api/device/getUserConsumableRecords', data)
}

/**
 * @description 获取耗材信息
 * @param {Object} data - 请求参数对象
 * @param {number} [data.consumableType] - 耗材类型 1：面膜 2：补水喷雾 3：文胸
 * @param {string} [data.code] - 耗材编码
 * @returns {Promise<Object>} 返回Promise对象，包含耗材信息列表
 */
export const getMaterialConsumables = (data) => {
  return get('/api/device/getMaterialConsumables', data)
}

/**
 * @description 使用耗材
 * @param {Object} data - 请求参数对象
 * @param {string} data.token - 用户认证token
 * @param {string} data.consumableCode - 耗材编码
 * @returns {Promise<Object>} 返回Promise对象，使用成功后会根据耗材积分值发放相应积分奖励
 */
export const useMaterialConsumable = (data) => {
  return get('/api/device/useMaterialConsumable', data)
}
