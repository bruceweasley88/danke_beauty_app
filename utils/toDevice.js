import { getDevice } from "./deivceManage"

export const toDevice = (type) => {
  const device = getDevice(type);
  if (device) {
    uni.navigateTo({
      url: '/pages/device/device?type=' + type
    })
  } else {
    uni.navigateTo({
      url: '/pages/bindding/bindding?type=' + type
    })
  }

}