<!--
 * @Author: huhaibiao
 * @Date: 2023-05-13 18:31:54
-->
<script setup lang="ts">
import { ref } from 'vue'
const centerDialogVisible = ref(true)

const emit = defineEmits(['close', 'confirm'])
const exit = () => {
  emit('close')
  window.close()
}
</script>

<template>
  <el-dialog
    v-model="centerDialogVisible"
    title="提示"
    width="60%"
    :show-close="false"
    center
    top="50%"
    @close="emit('close')"
  >
    <span> 此局以无法继续了，重开？ </span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="exit">退出</el-button>
        <el-button type="primary" @click="emit('confirm')"> 重开 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style lang="less" scoped>
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>
