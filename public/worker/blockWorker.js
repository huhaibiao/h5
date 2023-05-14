/*
 * @Author: huhaibiao
 * @Date: 2023-05-12 21:43:52
 */
console.log(11)

onmessage = function (e) {
  try {
    const data = JSON.parse(e.data)
    const res = findSameAWay(data.arr)
    postMessage(res)
  } catch (error) {
    console.log('🚀 ~ file: blockWorker.ts:14 ~ error:', error)
    console.log('Message received from main script', e.data)
  }
}

// close()

/**传入一个数组，判断数组内是否存在相连 */
const findSameAWay = arr => {
  let tmpSet
  const findOtherSame = (x, y, target) => {
    if (x < 0 || y < 0 || x >= arr.length || y >= arr[x].length) {
      return false
    }
    if (tmpSet.has(x + '-' + y)) return
    if (arr[x][y].num === target) {
      tmpSet.add(x + '-' + y)
      if (tmpSet.size >= 2) {
        throw new Error(true)
      }
      findOtherSame(x + 1, y, target)
      findOtherSame(x, y + 1, target)
      findOtherSame(x - 1, y, target)
      findOtherSame(x, y - 1, target)
    }
  }

  for (let x = 0; x < arr.length; x++) {
    for (let y = 0; y < arr[x].length; y++) {
      tmpSet = new Set()
      try {
        findOtherSame(x, y, arr[x][y].num)
      } catch (error) {
        return error.message
      }
    }
  }
  return false
}
