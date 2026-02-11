import { ref } from 'vue'
import type { BrowserInfo } from '@/types'

export function useDeviceInfo() {
  const browserInfo = ref<BrowserInfo>({
    name: 'Unknown',
    version: 'Unknown',
    engine: 'Unknown',
    isMobile: false,
    isHttps: false
  })

  function detectBrowser(): BrowserInfo {
    const ua = navigator.userAgent
    let name = 'Unknown'
    let version = 'Unknown'
    let engine = 'Unknown'

    // Detect browser name and version
    if (ua.indexOf('Chrome') > -1 && ua.indexOf('Edg') === -1 && ua.indexOf('OPR') === -1) {
      name = 'Chrome'
      const match = ua.match(/Chrome\/(\d+)/)
      version = match ? match[1] : 'Unknown'
      engine = 'Blink'
    } else if (ua.indexOf('Safari') > -1 && ua.indexOf('Chrome') === -1) {
      name = 'Safari'
      const match = ua.match(/Version\/(\d+)/)
      version = match ? match[1] : 'Unknown'
      engine = 'WebKit'
    } else if (ua.indexOf('Firefox') > -1) {
      name = 'Firefox'
      const match = ua.match(/Firefox\/(\d+)/)
      version = match ? match[1] : 'Unknown'
      engine = 'Gecko'
    } else if (ua.indexOf('Edg') > -1) {
      name = 'Edge'
      const match = ua.match(/Edg\/(\d+)/)
      version = match ? match[1] : 'Unknown'
      engine = 'Blink'
    } else if (ua.indexOf('OPR') > -1 || ua.indexOf('Opera') > -1) {
      name = 'Opera'
      const match = ua.match(/(?:OPR|Opera)\/(\d+)/)
      version = match ? match[1] : 'Unknown'
      engine = 'Blink'
    }

    // Detect mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)

    // Detect HTTPS
    const isHttps = window.location.protocol === 'https:' || window.location.hostname === 'localhost'

    browserInfo.value = {
      name,
      version,
      engine,
      isMobile,
      isHttps
    }

    return browserInfo.value
  }

  return {
    browserInfo,
    detectBrowser
  }
}
