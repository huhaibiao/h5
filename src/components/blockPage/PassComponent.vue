<!--
 * @Author: huhaibiao
 * @Date: 2023-05-15 15:19:34
-->
<script setup lang="ts">
import { curBlockData } from '../../store/blockPage'

const emit = defineEmits(['close', 'refresh'])
</script>

<template>
  <div class="congratulation">
    <div class="box2">
      🎉成功通过第{{ curBlockData.level }}关, 此次耗时{{
        curBlockData.timeCost.toFixed(2)
      }}s
    </div>
    <div class="box2">继续尝试第{{ curBlockData.level }}关</div>
    <el-button type="primary" round size="large" @click="emit('refresh')"
      >刷新</el-button
    >
    <div class="box2">或者进入下一关</div>
    <el-button
      type="primary"
      round
      size="large"
      @click="emit('refresh', 'next')"
      >下一关</el-button
    >
  </div>
</template>

<style lang="less" scoped>
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
</style>
