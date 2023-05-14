/*
 * @Author: huhaibiao
 * @Date: 2023-05-12 19:48:40
 */
export function formatTime(seconds: number, hasHours = false) {
  let hours: number | string = Math.floor(seconds / 3600)
  let minutes: number | string = Math.floor((seconds - hours * 3600) / 60)
  let remainingSeconds: number | string = seconds - hours * 3600 - minutes * 60
  remainingSeconds = Math.floor(remainingSeconds)

  if (remainingSeconds < 10) {
    remainingSeconds = '0' + remainingSeconds
  }
  if (minutes < 10) {
    minutes = '0' + minutes
  }

  if (!hasHours) {
    return minutes + ':' + remainingSeconds
  }

  if (hours < 10) {
    hours = '0' + hours
  }

  return hours + ':' + minutes + ':' + remainingSeconds
}

/**设备，移动还是pc */
export function isMobile() {
  const userAgent = navigator.userAgent.toLowerCase()
  const mobileKeywords = [
    'android',
    'iphone',
    'ipod',
    'ipad',
    'windows phone',
    'blackberry',
    'mobile'
  ]
  for (let i = 0; i < mobileKeywords.length; i++) {
    if (userAgent.indexOf(mobileKeywords[i]) !== -1) {
      return true
    }
  }
  return false
}

/**
 * 移动端触摸滑动功能
 */
export const touchSwiper = (
  element: HTMLBaseElement | any,
  callback: () => {}
) => {
  let startX: number | null, startY: number | null

  element.addEventListener('touchstart', function (event: TouchEvent) {
    startX = event.touches[0].clientX
    startY = event.touches[0].clientY
  })

  element.addEventListener('touchmove', function (event: TouchEvent) {
    const deltaX = event.touches[0].clientX - startX!
    const deltaY = event.touches[0].clientY - startY!

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // 横向滑动
      if (deltaX < -80) {
        // 向左滑动
        console.log('向左滑动')
        callback()
      } else {
        // 向右滑动
        console.log('向右滑动')
      }
    } else {
      // 纵向滑动
      if (deltaY < 0) {
        // 向上滑动
        console.log('向上滑动')
      } else {
        // 向下滑动
        console.log('向下滑动')
      }
    }
  })

  element.addEventListener('touchend', function (event: TouchEvent) {
    startX = null
    startY = null
  })
}
