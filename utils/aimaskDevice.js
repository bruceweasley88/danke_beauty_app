/**
 * AI 面膜蓝牙设备封装库
 *
 * 基于 kit.md 协议文档实现
 * 协议参考：
 * - 产品名称：AI 面膜
 * - 蓝牙广播名称：AIMASK
 * - 产品短PID：0x0001
 */

import * as Bluetooth from './bluetoothApi.js'

// ==================== 数据转换工具 ====================

/**
 * @description 十六进制字符串转 ArrayBuffer
 * @param {string} hex - 十六进制字符串，如 "01 00 05 11 00"
 * @returns {ArrayBuffer}
 */
export const hexToArrayBuffer = (hex) => {
	const hexString = hex.replace(/\s+/g, '')
	const length = hexString.length / 2
	const buffer = new ArrayBuffer(length)
	const dataView = new DataView(buffer)

	for (let i = 0; i < length; i++) {
		dataView.setUint8(i, parseInt(hexString.substring(i * 2, i * 2 + 2), 16))
	}

	return buffer
}

/**
 * @description ArrayBuffer 转十六进制字符串
 * @param {ArrayBuffer} buffer
 * @returns {string} 如 "01 00 05 11 00"
 */
export const arrayBufferToHex = (buffer) => {
	const hexArray = []
	const dataView = new DataView(buffer)

	for (let i = 0; i < dataView.byteLength; i++) {
		const byte = dataView.getUint8(i)
		hexArray.push(byte.toString(16).padStart(2, '0').toUpperCase())
	}

	return hexArray.join(' ')
}

/**
 * @description 构建 DP 数据包（通用）
 * @param {Array<{dpId: number, value: number, type: string}>} dpList - DP 数组
 * @returns {ArrayBuffer}
 */
export const buildDPPacket = (dpList) => {
	const packets = []

	// 1. 添加蓝牙数据ID（0x01-0xFF循环）
	packets.push(bluetoothDataId.toString(16).padStart(2, '0').toUpperCase())
	bluetoothDataId = bluetoothDataId >= 0xFF ? 0x01 : bluetoothDataId + 1

	// 2. 添加包序号（固定0x01）
	packets.push('01')

	// 3. 添加随机数（固定0x00）
	packets.push('00')

	// 4. 添加DP数量
	packets.push(dpList.length.toString(16).padStart(2, '0').toUpperCase())

	// 5. 添加DP数据
	dpList.forEach(dp => {
		// DP ID：2字节（数值转16进制）
		packets.push((dp.dpId >> 8).toString(16).padStart(2, '0').toUpperCase())
		packets.push((dp.dpId & 0xFF).toString(16).padStart(2, '0').toUpperCase())
		// 数据类型
		packets.push(dp.type || '11')
		// 值
		packets.push(dp.value.toString(16).padStart(2, '0').toUpperCase())

	})
	console.log('构建 DP 数据包:', packets.join(' '))
	return hexToArrayBuffer(packets.join(' '))
}

/**
 * @description 解析设备返回的 DP 数据包（通用）
 * @param {string} hexData - 十六进制数据
 * @returns {Array<{dpId: number, value: number}>}
 */
export const parseDPData = (hexData) => {
	const hex = hexData.replace(/\s+/g, '')

	// 跳过：蓝牙数据ID(1) + 包序号(1) + 随机数(1) = 3字节（6个字符）
	let index = 6

	// 读取DP数量（1字节）
	if (index + 2 > hex.length) return []
	const dpCount = parseInt(hex.substring(index, index + 2), 16)
	index += 2

	const result = []

	for (let i = 0; i < dpCount; i++) {
		if (index + 8 > hex.length) break

		const dpIdHigh = hex.substring(index, index + 2)
		const dpIdLow = hex.substring(index + 2, index + 4)
		const dataType = hex.substring(index + 4, index + 6)
		const value = parseInt(hex.substring(index + 6, index + 8), 16)

		// DP ID：2字节转数值
		const dpId = parseInt(dpIdHigh + dpIdLow, 16)

		result.push({
			dpId,
			value
		})

		index += 8
	}

	return result
}

// ==================== 设备管理 ====================

// 蓝牙数据ID（0x01-0xFF循环）
let bluetoothDataId = 0x01
// 包序号（从0x01开始递增）
let packetSequence = 0x01

// 待处理的 DP 响应回调队列
const pendingDPRequests = new Map()

/**
 * @description 处理设备返回的 DP 数据
 * @param {string} deviceId
 * @param {ArrayBuffer} value
 */
const handleDPResponse = (deviceId, value) => {
	const hexData = arrayBufferToHex(value)
	const dpList = parseDPData(hexData)

	dpList.forEach(dp => {
		const key = `${deviceId}-${dp.dpId}`
		const callback = pendingDPRequests.get(key)

		if (callback) {
			callback(dp.value)
			pendingDPRequests.delete(key)  // 执行后删除
		}
	})
}

/**
 * @description 搜索 AI 面膜设备
 * @param {Object} options
 * @param {number} [options.timeout=10000] - 搜索超时时间(ms)
 * @param {Function} [options.onDeviceFound] - 设备发现回调
 * @returns {Promise<Array<{deviceId: string, name: string, rssi: number}>>}
 */
export const searchAIMASKDevice = (options = {}) => {
	const { timeout = 10000, onDeviceFound } = options
	const devices = []

	return new Promise(async (resolve, reject) => {
		let timer = null
		let isActive = true

		// 超时处理
		timer = setTimeout(async () => {
			if (!isActive) return
			isActive = false

			try {
				console.log('搜索超时，已停止搜索')
				await Bluetooth.stopBluetoothDevicesDiscovery()
				resolve(devices)
			} catch (error) {
				console.error('停止搜索失败:', error)
				resolve(devices)
			}
		}, timeout);

		// 监听设备发现
		Bluetooth.onBluetoothDeviceFound((res) => {
			if (!isActive) return

			console.log('发现设备:', res.devices);
			res.devices.forEach(device => {
				if (device.name === 'AIMASK' || device.localName === 'AIMASK') {
					const exists = devices.some(d => d.deviceId === device.deviceId)
					if (!exists) {
						devices.push({
							deviceId: device.deviceId,
							name: device.name || device.localName,
							rssi: device.RSSI,
							advertisData: device.advertisData,
							advertisServiceUUIDs: device.advertisServiceUUIDs
						})
						if (onDeviceFound) {
							onDeviceFound(devices[devices.length - 1])
						}
					}
				}
			})
		})

		// 开始搜索
		try {
			await Bluetooth.openBluetoothAdapter()
			await Bluetooth.startBluetoothDevicesDiscovery()
		} catch (error) {
			if (!isActive) return
			isActive = false
			if (timer) clearTimeout(timer)
			console.error('搜索设备失败:', error)
			reject(error)
		}
	})
}

/**
 * @description 连接 AI 面膜设备（使用固定UUID）
 * @param {string} deviceId - 设备 ID
 * @param {Function} [onDataReceived] - 数据接收回调（通用）
 * @returns {Promise<{deviceId: string, serviceId: string, writeCharacteristicId: string, notifyCharacteristicId: string}>} | false
 */
export const connectAIMASKDevice = async (deviceId, onDataReceived) => {
	// 固定UUID
	const SERVICE_UUID = '0000EE01-0000-1000-8000-00805f9b34fb'
	const WRITE_CHAR_UUID = '0000EE03-0000-1000-8000-00805f9b34fb'
	const NOTIFY_CHAR_UUID = '0000EE02-0000-1000-8000-00805f9b34fb'

	// 监听数据接收（统一处理 DP 响应）
	Bluetooth.onBLECharacteristicValueChange((res) => {
		if (res.deviceId === deviceId) {
			// 先处理 DP 响应
			handleDPResponse(deviceId, res.value)

			// 再通知用户
			if (onDataReceived) {
				onDataReceived(res)
			}
		}
	})

	// 连接设备
	console.log('调用连接接口...', deviceId)
	let res;
	try {
		res = await Bluetooth.createBLEConnection(deviceId, 3000)
	} catch (e) {
		console.log(e)
		return false;
	}
	console.log('连接接口返回', res);


	// 启用 notify
	console.log('正在启用 notify...')
	await Bluetooth.notifyBLECharacteristicValueChange(deviceId, SERVICE_UUID, NOTIFY_CHAR_UUID, true)
	console.log('notify 启用成功')

	return {
		deviceId,
		serviceId: SERVICE_UUID,
		writeCharacteristicId: WRITE_CHAR_UUID,
		notifyCharacteristicId: NOTIFY_CHAR_UUID
	}

}

/**
 * @description 断开设备连接并清理资源
 * @param {string} deviceId - 设备 ID
 * @returns {Promise<void>}
 */
export const disconnectDevice = async (deviceId) => {
	// 清理该设备的所有待处理请求
	for (const key of pendingDPRequests.keys()) {
		if (key.startsWith(deviceId)) {
			pendingDPRequests.delete(key)
		}
	}

	// 重置状态
	bluetoothDataId = 0x01
	packetSequence = 0x01

	// 断开连接
	await Bluetooth.closeBLEConnection(deviceId)
}


// ==================== DP 操作 ====================

/**
 * @description 设置按摩强度（DP001）
 * @param {Object} connection - 连接信息
 * @param {number} intensity - 强度 0-100
 * @returns {Promise<void>}
 */
export const setMassageIntensity = async (connection, intensity) => {
	const packet = buildDPPacket([{ dpId: 1, value: intensity, type: '11' }])
	await Bluetooth.writeBLECharacteristicValue(
		connection.deviceId,
		connection.serviceId,
		connection.writeCharacteristicId,
		packet
	)
}

/**
 * @description 设置护肤模式（DP002）
 * @param {Object} connection - 连接信息
 * @param {number} mode - 模式 0:关闭 1:模式1 2:模式2 3:模式3
 * @returns {Promise<void>}
 */
export const setSkinMode = async (connection, mode) => {
	const packet = buildDPPacket([{ dpId: 2, value: mode, type: '11' }])
	await Bluetooth.writeBLECharacteristicValue(
		connection.deviceId,
		connection.serviceId,
		connection.writeCharacteristicId,
		packet
	)
}

/**
 * @description 启动/停止设备（DP006）
 * @param {Object} connection - 连接信息
 * @param {number} state - 0:停止 1:启动
 * @returns {Promise<void>}
 */
export const setDeviceState = async (connection, state) => {
	const packet = buildDPPacket([{ dpId: 6, value: state, type: '11' }])
	await Bluetooth.writeBLECharacteristicValue(
		connection.deviceId,
		connection.serviceId,
		connection.writeCharacteristicId,
		packet,
	)
}

/**
 * @description 查询设备全量状态（DP200）
 * @param {Object} connection - 连接信息
 * @returns {Promise<Object>}
 */
export const queryDeviceState = async (connection) => {
	const packet = buildDPPacket([{ dpId: 200, value: 1, type: '01' }])
	await Bluetooth.writeBLECharacteristicValue(
		connection.deviceId,
		connection.serviceId,
		connection.writeCharacteristicId,
		packet
	)
}
