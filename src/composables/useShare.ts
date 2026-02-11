import { ref } from 'vue'
import type { ShareOptions } from '@/types'

export function useShare() {
  const isSharing = ref(false)
  const shareSupported = ref('share' in navigator)

  async function shareText(title: string, text: string, url?: string): Promise<boolean> {
    if (!shareSupported.value) return false

    isSharing.value = true
    try {
      await navigator.share({
        title,
        text,
        url: url || window.location.href
      })
      return true
    } catch (error) {
      // User cancelled or share failed
      console.error('Share failed:', error)
      return false
    } finally {
      isSharing.value = false
    }
  }

  async function shareImage(imageDataUrl: string, filename = 'pwa-detection-result.png'): Promise<boolean> {
    if (!shareSupported.value) return false

    isSharing.value = true
    try {
      const response = await fetch(imageDataUrl)
      const blob = await response.blob()
      const file = new File([blob], filename, { type: 'image/png' })

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'PWA 检测结果',
          text: '查看我的浏览器 PWA 支持情况',
          files: [file]
        })
        return true
      }
      return false
    } catch (error) {
      console.error('Image share failed:', error)
      return false
    } finally {
      isSharing.value = false
    }
  }

  async function copyText(text: string): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch (error) {
      console.error('Copy text failed:', error)
      return false
    }
  }

  return {
    isSharing,
    shareSupported,
    shareText,
    shareImage,
    copyText
  }
}
