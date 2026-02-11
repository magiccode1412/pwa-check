import { ref } from 'vue'
import html2canvas from 'html2canvas'
import { useUIStore } from '@/stores/ui'

export function useScreenshot() {
  const uiStore = useUIStore()
  
  // 使用 store 中的共享状态
  const screenshotDataUrl = ref<string>('')
  const isCapturing = ref(false)

  async function captureElement(element: HTMLElement): Promise<string | null> {
    isCapturing.value = true
    uiStore.setCapturing(true)
    
    try {
      // 等待字体加载完成
      await document.fonts.ready

      // 等待所有图片加载完成
      const images = element.querySelectorAll('img')
      await Promise.all(
        Array.from(images).map(img => {
          if (img.complete) return Promise.resolve()
          return new Promise((resolve) => {
            img.onload = resolve
            img.onerror = resolve
            setTimeout(resolve, 1000) // 超时处理
          })
        })
      )

      // 获取元素实际尺寸
      const rect = element.getBoundingClientRect()
      console.log('Screenshot target:', {
        width: rect.width,
        height: rect.height,
        element: element.className
      })

      // 添加优化类（在截图前添加，让 onclone 可以处理）
      element.classList.add('screenshot-optimization')

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: true,
        foreignObjectRendering: false,
        imageTimeout: 15000,
        onclone: (clonedDoc, clonedElement) => {
          // 强制所有元素 opacity 为 1，移除 transform
          const allElements = clonedElement.querySelectorAll('*')
          allElements.forEach(el => {
            const htmlEl = el as HTMLElement
            htmlEl.style.opacity = '1'
            htmlEl.style.transform = 'none'
            htmlEl.style.animation = 'none'
          })
          // 确保根元素也重置
          clonedElement.style.opacity = '1'
          clonedElement.style.transform = 'none'
          clonedElement.style.animation = 'none'
        }
      })

      console.log('Canvas generated:', canvas.width, 'x', canvas.height)

      // 检查 canvas 是否为空
      const ctx = canvas.getContext('2d')
      if (ctx) {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const hasContent = imageData.data.some((pixel, index) => index % 4 !== 3 && pixel !== 0)
        console.log('Canvas has content:', hasContent)
      }

      // Remove optimization class
      element.classList.remove('screenshot-optimization')

      const dataUrl = canvas.toDataURL('image/png')
      
      console.log('Generated dataUrl length:', dataUrl.length)
      console.log('DataUrl prefix:', dataUrl.substring(0, 50))
      
      // 保存到 store 共享
      uiStore.setScreenshotDataUrl(dataUrl)
      screenshotDataUrl.value = dataUrl
      
      console.log('Saved to store, store value length:', uiStore.screenshotDataUrl?.length || 0)
      
      return dataUrl
    } catch (error) {
      console.error('Screenshot capture failed:', error)
      return null
    } finally {
      isCapturing.value = false
      uiStore.setCapturing(false)
    }
  }

  function downloadScreenshot(filename = 'pwa-detection-result.png') {
    const url = uiStore.screenshotDataUrl || screenshotDataUrl.value
    if (!url) return

    const link = document.createElement('a')
    link.download = filename
    link.href = url
    link.click()
  }

  async function copyToClipboard(): Promise<boolean> {
    const url = uiStore.screenshotDataUrl || screenshotDataUrl.value
    if (!url) return false

    try {
      const response = await fetch(url)
      const blob = await response.blob()
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ])
      return true
    } catch (error) {
      console.error('Copy to clipboard failed:', error)
      return false
    }
  }

  function clearScreenshot() {
    screenshotDataUrl.value = ''
    uiStore.clearScreenshotData()
  }

  return {
    screenshotDataUrl,
    isCapturing,
    captureElement,
    downloadScreenshot,
    copyToClipboard,
    clearScreenshot
  }
}
