/*
 * @Author: huhaibiao
 * @Date: 2023-05-12 21:42:06
 */
let myWorker: Worker
if (window.Worker) {
  myWorker = new Worker('./worker/blockWorker.js')
  myWorker.postMessage('hello')
  //   myWorker.onmessage = function (e) {
  //     console.log('🚀 ~ file: BlockPage.vue:13 ~ e.data:', e.data)
  //     console.log('Message received from worker')
  //   }
  //   myWorker.terminate()

  myWorker.onerror = err => {
    console.log(err)
  }
}

export { myWorker }
