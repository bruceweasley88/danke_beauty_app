import { t } from '../locale/index.js'

/**
 * 获取设备名称
 */
export const getDeviceName = (type) => {
  switch (type) {
    case 'mask': return t('deviceType.mask');
    case 'spray': return t('deviceType.spray');
    case 'importer': return t('deviceType.importer');
    case 'bra': return t('deviceType.bra');
  }
  return t('deviceType.unknown');
}