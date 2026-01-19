import { connectAIMASKDevice } from "./aimaskDevice"
import { closeBLEConnection, openBluetoothAdapter } from "./bluetoothApi"


openBluetoothAdapter();

/**
 * 设备列表
 * @type {Array<{type: string, time: string, connect: Object, deviceId: string, connected: boolean}>}
 */
const deivces = []

const STORAGE_KEY = 'bluetooth_devices'

// 保存设备列表
const saveDevices = () => {
	uni.setStorageSync(STORAGE_KEY, deivces)
}

// 加载设备列表
const loadDevices = () => {
	try {
		const savedData = uni.getStorageSync(STORAGE_KEY)
		if (savedData && savedData.length > 0) {
			savedData.forEach(device => {
				device.connected = false
				deivces.push(device)
			})
		}
	} catch (e) {
		console.log('加载设备列表失败:', e)
	}
}

// 初始化：加载已保存的设备列表
loadDevices()

// 初始化：监听蓝牙连接状态变化，自动更新设备状态
uni.onBLEConnectionStateChange((res) => {
	console.log('监听到设备状态发生变化', res)
	for (const device of deivces) {
		if (device.connect.deviceId === res.deviceId) {
			device.connected = res.connected
		}
	}
})

/**
 * 获取指定类型的设备
 * @param {string} type - 设备类型（mask/spray/bra/importer）
 * @returns {Object|undefined} 设备对象，不存在返回 undefined
 */
export const getDevice = (type) => {
	console.log('正在获取', type, deivces)
	return deivces.find(device => device.type === type || device.deviceId === type)
}

/**
 * 删除指定类型的设备记录
 * @param {string} typeOrDeviceId - 设备类型（mask/spray/bra/importer）或id
 */
export const delDevice = async (typeOrDeviceId, close) => {
	while (true) {
		const index = deivces.findIndex(device => device.type === typeOrDeviceId || device.deviceId === typeOrDeviceId);
		if (index === -1) {
			break;
		}

		if (close) {
			const device = deivces[index];
			try {
				await closeBLEConnection(device.deviceId)
			} catch { }
		}

		deivces.splice(index, 1)
	}
	saveDevices()
}

/**
 * 连接指定类型的设备
 * @param {string} type - 设备类型（mask/spray/bra/importer）
 * @param {string} deviceId - 设备ID
 * @returns {Object | false} 设备对象
 */
export const connectDevice = async (type, deviceId) => {
	console.log('开始连接...')
	const connection = await connectAIMASKDevice(deviceId, (data) => {
		console.log('---- 收到设备数据:', data)
	});
	if (connection === false) {
		return false
	}
	console.log('连接完成!')

	// 删除旧的连接记录
	await delDevice(type);
	await delDevice(deviceId);

	// 格式化时间 yyyy-mm-dd hh:ss
	const now = new Date()
	const year = now.getFullYear()
	const month = String(now.getMonth() + 1).padStart(2, '0')
	const day = String(now.getDate()).padStart(2, '0')
	const hour = String(now.getHours()).padStart(2, '0')
	const minute = String(now.getMinutes()).padStart(2, '0')
	const timeStr = `${year}-${month}-${day} ${hour}:${minute}`


	// 添加新的连接记录
	const device = {
		type,
		time: timeStr,
		connect: connection,
		deviceId: connection.deviceId,
		connected: true
	}
	deivces.push(device)

	// 保存到本地存储
	saveDevices()

	return device
}

