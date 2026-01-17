/**
 * 蓝牙 API 封装
 *
 * 文档参考：
 * - 蓝牙 API: /蓝牙 API 文档.md
 * - 低功耗蓝牙 API: /低功耗蓝牙 API 文档.md
 */

// ==================== 蓝牙基础 API ====================

/**
 * @description 初始化蓝牙模块
 * @returns {Promise} 初始化结果
 */
export const openBluetoothAdapter = () => {
	return new Promise((resolve, reject) => {
		uni.openBluetoothAdapter({
			success: resolve,
			fail: reject
		})
	})
}

/**
 * @description 关闭蓝牙模块，调用该方法将断开所有已建立的连接并释放系统资源
 * @returns {Promise} 关闭结果
 */
export const closeBluetoothAdapter = () => {
	return new Promise((resolve, reject) => {
		uni.closeBluetoothAdapter({
			success: resolve,
			fail: reject
		})
	})
}

/**
 * @description 获取本机蓝牙适配器状态
 * @returns {Promise<{discovering: boolean, available: boolean}>} 蓝牙适配器状态
 */
export const getBluetoothAdapterState = () => {
	return new Promise((resolve, reject) => {
		uni.getBluetoothAdapterState({
			success: resolve,
			fail: reject
		})
	})
}

/**
 * @description 开始搜寻附近的蓝牙外围设备
 * @param {Object} options - 搜寻选项
 * @param {string[]} [options.services] - 要搜索的蓝牙设备主 service 的 uuid 列表
 * @param {boolean} [options.allowDuplicatesKey] - 是否允许重复上报同一设备
 * @param {number} [options.interval] - 上报设备的间隔，0 表示找到新设备立即上报
 * @param {string} [options.powerLevel] - 扫描模式：low/medium/high，仅安卓支持
 * @returns {Promise} 开始搜寻结果
 */
export const startBluetoothDevicesDiscovery = (options = {}) => {
	return new Promise((resolve, reject) => {
		uni.startBluetoothDevicesDiscovery({
			...options,
			success: resolve,
			fail: reject
		})
	})
}

/**
 * @description 停止搜寻附近的蓝牙外围设备
 * @returns {Promise} 停止搜寻结果
 */
export const stopBluetoothDevicesDiscovery = () => {
	return new Promise((resolve, reject) => {
		uni.stopBluetoothDevicesDiscovery({
			success: resolve,
			fail: reject
		})
	})
}

/**
 * @description 获取在蓝牙模块生效期间所有已发现的蓝牙设备
 * @returns {Promise<{devices: Array}>} 已发现的设备列表
 */
export const getBluetoothDevices = () => {
	return new Promise((resolve, reject) => {
		uni.getBluetoothDevices({
			success: resolve,
			fail: reject
		})
	})
}

/**
 * @description 根据 uuid 获取处于已连接状态的设备
 * @param {string[]} services - 蓝牙设备主 service 的 uuid 列表
 * @returns {Promise<{devices: Array}>} 已连接的设备列表
 */
export const getConnectedBluetoothDevices = (services) => {
	return new Promise((resolve, reject) => {
		uni.getConnectedBluetoothDevices({
			services,
			success: resolve,
			fail: reject
		})
	})
}

/**
 * @description 监听寻找到新设备的事件
 * @param {Function} callback - 设备发现回调函数，参数 {devices: Array}
 */
export const onBluetoothDeviceFound = (callback) => {
	uni.onBluetoothDeviceFound(callback)
}

/**
 * @description 监听蓝牙适配器状态变化事件
 * @param {Function} callback - 适配器状态回调函数，参数 {available: boolean, discovering: boolean}
 */
export const onBluetoothAdapterStateChange = (callback) => {
	uni.onBluetoothAdapterStateChange(callback)
}

// ==================== 低功耗蓝牙 API ====================

/**
 * @description 连接低功耗蓝牙设备
 * @param {string} deviceId - 蓝牙设备 id
 * @param {number} [timeout] - 超时时间，单位ms，不填表示不会超时
 * @returns {Promise} 连接结果
 */
export const createBLEConnection = (deviceId, timeout) => {
	return new Promise((resolve, reject) => {
		uni.createBLEConnection({
			deviceId,
			timeout,
			success: resolve,
			fail: reject
		})
	})
}

/**
 * @description 断开与低功耗蓝牙设备的连接
 * @param {string} deviceId - 蓝牙设备 id
 * @returns {Promise} 断开连接结果
 */
export const closeBLEConnection = (deviceId) => {
	return new Promise((resolve, reject) => {
		uni.closeBLEConnection({
			deviceId,
			success: resolve,
			fail: reject
		})
	})
}

/**
 * @description 设置蓝牙最大传输单元（2.8.4+，安卓5.1+有效）
 * @param {string} deviceId - 蓝牙设备 id
 * @param {number} mtu - 最大传输单元(22,512) 区间内，单位 bytes
 * @returns {Promise} 设置结果
 */
export const setBLEMTU = (deviceId, mtu) => {
	return new Promise((resolve, reject) => {
		uni.setBLEMTU({
			deviceId,
			mtu,
			success: resolve,
			fail: reject
		})
	})
}

/**
 * @description 获取蓝牙设备的信号强度（2.8.4+）
 * @param {string} deviceId - 蓝牙设备 id
 * @returns {Promise<{RSSI: number}>} 信号强度
 */
export const getBLEDeviceRSSI = (deviceId) => {
	return new Promise((resolve, reject) => {
		uni.getBLEDeviceRSSI({
			deviceId,
			success: resolve,
			fail: reject
		})
	})
}

/**
 * @description 获取蓝牙设备所有服务
 * @param {string} deviceId - 蓝牙设备 id
 * @returns {Promise<{services: Array<{uuid: string, isPrimary: boolean}>}>} 设备服务列表
 */
export const getBLEDeviceServices = (deviceId) => {
	return new Promise((resolve, reject) => {
		uni.getBLEDeviceServices({
			deviceId,
			success: resolve,
			fail: reject
		})
	})
}

/**
 * @description 获取蓝牙设备某个服务中所有特征值
 * @param {string} deviceId - 蓝牙设备 id
 * @param {string} serviceId - 蓝牙服务 uuid
 * @returns {Promise<{characteristics: Array<{uuid: string, properties: object}>}>} 特征值列表
 */
export const getBLEDeviceCharacteristics = (deviceId, serviceId) => {
	return new Promise((resolve, reject) => {
		uni.getBLEDeviceCharacteristics({
			deviceId,
			serviceId,
			success: resolve,
			fail: reject
		})
	})
}

/**
 * @description 读取低功耗蓝牙设备的特征值的二进制数据值
 * @param {string} deviceId - 蓝牙设备 id
 * @param {string} serviceId - 蓝牙服务 uuid
 * @param {string} characteristicId - 蓝牙特征值的 uuid
 * @returns {Promise} 读取结果，实际数据需在 onBLECharacteristicValueChange 中获取
 */
export const readBLECharacteristicValue = (deviceId, serviceId, characteristicId) => {
	return new Promise((resolve, reject) => {
		uni.readBLECharacteristicValue({
			deviceId,
			serviceId,
			characteristicId,
			success: resolve,
			fail: reject
		})
	})
}

/**
 * @description 向低功耗蓝牙设备特征值中写入二进制数据
 * @param {string} deviceId - 蓝牙设备 id
 * @param {string} serviceId - 蓝牙服务 uuid
 * @param {string} characteristicId - 蓝牙特征值的 uuid
 * @param {ArrayBuffer} value - 蓝牙设备特征值对应的二进制值
 * @param {string} [writeType] - 蓝牙特征值的写模式设置：write 或 writeNoResponse，微信小程序支持
 * @returns {Promise} 写入结果
 */
export const writeBLECharacteristicValue = (deviceId, serviceId, characteristicId, value, writeType) => {
	return new Promise((resolve, reject) => {
		const params = {
			deviceId,
			serviceId,
			characteristicId,
			value,
			writeType,
			success: resolve,
			fail: reject
		}
		console.log('writeBLECharacteristicValue params:', params, 'value', value, new Uint8Array(value), value.byteLength)
		uni.writeBLECharacteristicValue(params)
	})
}

/**
 * @description 启用低功耗蓝牙设备特征值变化时的 notify 功能
 * @param {string} deviceId - 蓝牙设备 id
 * @param {string} serviceId - 蓝牙服务 uuid
 * @param {string} characteristicId - 蓝牙特征值的 uuid
 * @param {boolean} state - 是否启用 notify
 * @returns {Promise} 操作结果
 */
export const notifyBLECharacteristicValueChange = (deviceId, serviceId, characteristicId, state) => {
	return new Promise((resolve, reject) => {
		uni.notifyBLECharacteristicValueChange({
			deviceId,
			serviceId,
			characteristicId,
			state,
			success: resolve,
			fail: reject
		})
	})
}

/**
 * @description 监听低功耗蓝牙连接状态的改变事件
 * @param {Function} callback - 连接状态回调函数，参数 {deviceId: string, connected: boolean}
 */
export const onBLEConnectionStateChange = (callback) => {
	uni.onBLEConnectionStateChange(callback)
}

/**
 * @description 监听低功耗蓝牙设备的特征值变化事件
 * @param {Function} callback - 特征值变化回调函数，参数 {deviceId: string, serviceId: string, characteristicId: string, value: ArrayBuffer}
 */
export const onBLECharacteristicValueChange = (callback) => {
	uni.onBLECharacteristicValueChange(callback)
}
