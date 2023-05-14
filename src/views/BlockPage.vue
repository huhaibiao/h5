<!--
 * @Author: huhaibiao
 * @Date: 2023-05-11 20:36:35
-->
<script setup lang="ts">
import BlockPageHeader from '../components/blockPage/BlockPageHeader.vue'
import FailTip from '../components/blockPage/FailTip.vue'
import {
  curBlockData,
  curLevel,
  generateArr,
  saveLocalData,
  nextBlockData,
  blockData
} from '../store/blockPage'
import { myWorker } from '../worker'

import { isMobile, touchSwiper } from './../utils/index'
const btnType: any = ['', 'primary', 'success', 'info', 'warning', 'danger']

const width = 40,
  areaWidth = window.innerWidth - width,
  areaHeight = window.innerHeight - width * 2

curBlockData.value.allCount++

const xW = ref(curBlockData.value.arr.length * 40)
if (localStorage.getItem('xW')) {
  xW.value = +localStorage.getItem('xW')!
}

if (
  curBlockData.value.arr.length === 0 ||
  window.innerWidth !== JSON.parse(localStorage.getItem('innerWidth') || '0')
) {
  localStorage.setItem('innerWidth', JSON.stringify(window.innerWidth))

  const { arr, x } = generateArr(
    { width: areaWidth, height: areaHeight, targetWidth: width },
    btnType.slice(0, 1 + curBlockData.value.level)
  )
  curBlockData.value.arr.length = 0
  curBlockData.value.arr.push(...arr)

  xW.value = x * width
  localStorage.setItem('xW', JSON.stringify(xW.value))
  console.time('saveTime')
  saveLocalData()
  console.timeEnd('saveTime')
}

myWorker.onmessage = e => {
  console.timeEnd('worker communication')
  console.log(JSON.parse(e.data))
  failTipShow.value = !JSON.parse(e.data)
}

const blockPageContent = ref<HTMLDivElement | null>(null)

const passStatus = ref(false)

let enableClick = true
const btnClick = (x: number, y: number) => {
  if (!enableClick) {
    return
  }
  const tmpSet = new Set()
  let findArr: any = []
  let flatFirst = true,
    first: any = []
  const findOtherSame = (x: number, y: number, target: number) => {
    if (
      x < 0 ||
      y < 0 ||
      x >= curBlockData.value.arr.length ||
      y >= curBlockData.value.arr[x].length
    ) {
      return
    }
    if (flatFirst) {
      //记录点击的一个坐标
      flatFirst = false
      ;(first[0] = x), (first[1] = y)
    }
    if (tmpSet.has(x + '-' + y)) return
    if (curBlockData.value.arr[x][y].num === target) {
      tmpSet.add(x + '-' + y)
      if (tmpSet.size >= 2) {
        curBlockData.value.arr[first[0]][first[1]].type = 'danger'
        curBlockData.value.arr[x][y].type = 'danger'
      }
      if (!findArr[x]) findArr[x] = []
      findArr[x].push(y)
      findOtherSame(x + 1, y, target)
      findOtherSame(x, y + 1, target)
      findOtherSame(x - 1, y, target)
      findOtherSame(x, y - 1, target)
    }
  }
  const target = curBlockData.value.arr[x][y].num
  findOtherSame(x, y, target)
  findArr.forEach((item: any) => (item = item.sort((a: any, b: any) => b - a)))
  if (tmpSet.size >= 2) {
    enableClick = false
    setTimeout(() => {
      for (let i = findArr.length - 1; i >= 0; i--) {
        const item = findArr[i]
        if (item) {
          item.forEach((y: number) => {
            curBlockData.value.arr[i].splice(y, 1)
          })
          if (curBlockData.value.arr[i].length === 0) {
            setTimeout(() => {
              curBlockData.value.arr.splice(i, 1)
              enableClick = true
            }, 200)
          }
        }
      }
      setTimeout(() => {
        if (curBlockData.value.arr.length === 0) {
          const timeTmp =
            (new Date().getTime() - curBlockData.value.timeStart) / 1000
          if (
            curBlockData.value.timeCost > timeTmp ||
            curBlockData.value.timeCost === 0
          ) {
            curBlockData.value.timeCost = timeTmp
          }

          passStatus.value = true
          curBlockData.value.passCount++
        }
        enableClick = true
        if (curBlockData.value.arr.length !== 0) {
          console.time('worker communication')
          myWorker.postMessage(
            JSON.stringify({
              arr: curBlockData.value.arr
            })
          )
          console.time('saveTime')
          saveLocalData()
          console.timeEnd('saveTime')
        }
      }, 201)
    }, 300)
  } else {
    console.time('worker communication')
    myWorker.postMessage(
      JSON.stringify({
        arr: curBlockData.value.arr
      })
    )
  }
}

/** 通过/刷新 */
const refresh = (param?: string) => {
  curBlockData.value.allCount++
  curBlockData.value.timeStart = new Date().getTime()
  if (param === 'next') {
    curLevel.value++
    nextBlockData()
  }
  const { arr: newArr, x } = generateArr(
    {
      width: areaWidth,
      height: areaHeight,
      targetWidth: width
    },
    btnType.slice(0, 1 + curBlockData.value.level)
  )
  xW.value = x * width
  curBlockData.value.arr.length = 0
  curBlockData.value.arr.push(...newArr)
  console.time('worker communication')
  myWorker.postMessage(
    JSON.stringify({
      arr: curBlockData.value.arr,
      blockData: blockData,
      curLevel: curLevel.value
    })
  )
  saveLocalData()
  passStatus.value = false
}

const failTipShow = ref(false)
const confirm = () => {
  failTipShow.value = false
  refresh()
}
const mobile = ref(isMobile())

const controlShow = ref(false)
onMounted(() => {
  touchSwiper(document, () => (controlShow.value = true))
})

const addImagery = (index: number) => {
  if (curLevel.value === index) return
  curLevel.value = index
  curBlockData.value = blockData[index]
  controlShow.value = false
  refresh()
}
</script>
<template>
  <div class="header"><block-page-header></block-page-header></div>
  <div class="block-page-content" v-if="!passStatus">
    <div
      class="content"
      ref="blockPageContent"
      :style="{ 'min-width': xW + 'px' }"
    >
      <div
        class="content-column"
        v-for="(item, index1) of curBlockData.arr"
        :key="index1"
      >
        <el-button
          :type="childItem.type"
          style="width: 40px; height: 40px"
          :disabled="!childItem.show"
          v-for="(childItem, index2) of item"
          :key="childItem.x + '' + childItem.y"
          @click="btnClick(index1, index2)"
          >{{ childItem.num }}</el-button
        >
      </div>
    </div>
  </div>
  <div class="congratulation" v-else>
    <div class="box2">
      🎉成功通过第{{ curBlockData.level }}关, 此次耗时{{
        curBlockData.timeCost.toFixed(2)
      }}s
    </div>
    <div class="box2">继续尝试第{{ curBlockData.level }}关</div>
    <el-button type="primary" round size="large" @click="refresh()"
      >刷新</el-button
    >
    <div class="box2">或者进入下一关</div>
    <el-button type="primary" round size="large" @click="refresh('next')"
      >下一关</el-button
    >
  </div>

  <fail-tip
    @close="failTipShow = false"
    @confirm="confirm"
    v-if="failTipShow"
  ></fail-tip>

  <div class="bottom-tip" v-if="mobile">右滑选择关卡</div>
  <div v-else class="top-right" @click="controlShow = true">选择关卡</div>

  <el-drawer
    v-model="controlShow"
    title="I am the title"
    :with-header="false"
    size="160"
  >
    <div class="layer-btns">
      <div
        v-for="(item, index) of blockData"
        :key="item.level"
        @click="addImagery(index)"
        :class="{ selected: curLevel === index }"
      >
        {{ `第${index + 1}关` }}
      </div>
    </div>
  </el-drawer>
</template>

<style lang="less" scoped>
.layer-btns {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  background-color: rgba(8, 12, 15, 0.048);
  opacity: 0.75;
}

.layer-btns > div {
  height: 30px;
  width: 60px;
  text-align: center;
  background-color: rgba(250, 235, 215, 0.326);
  margin: 4px 10px;
  line-height: 30px;
  opacity: 0.9;
  border-radius: 10px;
  cursor: pointer;
  border: 1px solid #fff;
  color: #333333e9;
  font-family: PingFang SC-Medium, PingFang SC;
}

div.selected {
  border: 1px solid rgba(0, 255, 21, 0.847);
  color: rgb(177, 19, 51);
}
.congratulation {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  font-size: 22px;
  font-weight: 500;
  color: #333;
}
.top-right {
  position: absolute;
  top: 10px;
  right: 10px;
  border: 1px solid #333;
  border-radius: 4px;
  padding: 2px 5px;
  cursor: pointer;
}
.bottom-tip {
  position: absolute;
  bottom: 2px;
  right: 50%;
  min-width: 100px;
  transform: translateX(50%);
}
.box2 {
  margin: 20px 0;
  text-align: center;
}
.header {
  position: absolute;
  right: 0;
  left: 0;
}
//让页面上的元素首底部的引力
.block-page-content {
  display: flex;
  justify-content: center;
  width: 100vw;
  min-height: 100vh;
  transform: rotateX(180deg);

  .content {
    display: flex;
    flex-wrap: wrap;
    justify-content: start;
    transform-origin: 45vh 40vw;
    > button {
      margin: 0;
    }
  }
}
.content-column {
  display: flex;
  flex-direction: column;
  width: 40px;
  padding-top: 30px;
  > button {
    margin: 0;
    transform: rotateX(180deg);

    transition: all 0.3s linear;
  }
}
@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
