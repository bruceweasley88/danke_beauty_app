/**
 * 获取设备名称
 */
export const getDeviceName = (type) => {
  switch (type) {
    case 'mask': return 'AI面膜';
    case 'spray': return '补水喷雾器';
    case 'importer': return '美容导入仪';
    case 'bra': return 'AI文胸';
  }
  return '未知设备';
}