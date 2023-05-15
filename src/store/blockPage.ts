/*
 * @Author: huhaibiao
 * @Date: 2023-05-12 17:37:29
 */
export const blockData = reactive<any>([
  {
    timeStart: new Date().getTime(),
    passCount: 0,
    allCount: 1,
    timeCost: 0,
    level: 1,
    arr: []
  }
])

export const curLevel = ref(0)
export const curBlockData = ref(blockData[curLevel.value])

export const nextBlockData = () => {
  curLevel.value++
  if (!blockData[curLevel.value]) {
    blockData.push({
      timeStart: new Date().getTime(),
      passCount: 0,
      timeCost: 0,
      allCount: 1,
      level: curLevel.value + 1,
      arr: []
    })
  }
  curBlockData.value = blockData[curLevel.value]
}

/**方块类型数据 */
export const btnType: any = [
  '',
  'primary',
  'success',
  'info',
  'warning',
  'danger'
]

export const saveLocalData = () => {
  localStorage.setItem('blockData', JSON.stringify(blockData))
  localStorage.setItem('curLevel', JSON.stringify(curLevel.value))
}

const getLocalData = () => {
  return {
    blockData: JSON.parse(localStorage.getItem('blockData')!),
    curLevel: JSON.parse(localStorage.getItem('curLevel')!)
  }
}

const localData = getLocalData()

if (localData.blockData) {
  blockData.length = 0
  blockData.push(...localData.blockData)
  curLevel.value = localData.curLevel
  curBlockData.value = blockData[curLevel.value]
}

type btnT = {
  type: '' | 'primary' | 'success' | 'info' | 'warning' | 'danger'
  show: boolean
  num: number
  x: number
  y: number
}

/**
 * 生成二维随机数组
 * @param area
 * @param btnType
 * 返回的结果 arr= [ [ { type, show: true, num: num, x: index, y: i }, { type, show: true, num: num, x: index, y: i }, ]
 */
export const generateArr = (
  area = { width: 500, height: 500, targetWidth: 50 },
  btnType: []
) => {
  const x = Math.floor(area.width / area.targetWidth),
    y = Math.floor(area.height / area.targetWidth)
  const arr = Array(x)
    .fill([])
    .map((item, index) => {
      const tmp: btnT[] = []
      for (let i = 0; i < y; i++) {
        const num = Math.floor(Math.random() * btnType.length)
        const type = btnType[num]
        tmp[i] = {
          type,
          show: true,
          num: num,
          x: index,
          y: i
        }
      }
      return tmp
    })

  return { arr, x }
}
