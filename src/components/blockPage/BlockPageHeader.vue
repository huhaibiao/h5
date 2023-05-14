<!--
 * @Author: huhaibiao
 * @Date: 2023-05-12 17:27:44
-->
<script setup lang="ts">
import { curBlockData } from '../../store/blockPage'
import { formatTime } from '../../utils'
</script>

<template>
  <div class="header">
    <div class="header-title">数字方块消消</div>
    <span class="box1">第{{ curBlockData.level }}关</span>
    <span class="box1">通过次数:{{ curBlockData.passCount }}次</span>
    <span class="box1"
      >最快用时:{{ formatTime(curBlockData.timeCost) || '-' }}</span
    >
  </div>
</template>

<style lang="less" scoped>
.header {
  width: 100%;
  text-align: center;
}
.box1 {
  margin: 2px 10px;
}
.header-title {
  font-size: 22px;
  font-weight: 500;
  color: #333;
}
</style>
