import { ref } from 'vue'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import type { DetectionResult, BrowserInfo } from '@/types'

export function usePdfExport() {
  const isExporting = ref(false)

  function generateReport(
    result: DetectionResult,
    browserInfo: BrowserInfo,
    supportRate: number
  ): string {
    const lines: string[] = []
    lines.push('PWA 检测结果报告')
    lines.push('=' .repeat(40))
    lines.push('')
    lines.push(`检测时间: ${new Date().toLocaleString('zh-CN')}`)
    lines.push(`浏览器: ${browserInfo.name} ${browserInfo.version}`)
    lines.push(`引擎: ${browserInfo.engine}`)
    lines.push(`设备类型: ${browserInfo.isMobile ? '移动设备' : '桌面设备'}`)
    lines.push(`连接方式: ${browserInfo.isHttps ? 'HTTPS' : 'HTTP'}`)
    lines.push('')
    lines.push(`整体支持率: ${supportRate}%`)
    lines.push('')
    lines.push('功能检测详情:')
    lines.push('-'.repeat(40))

    Object.values(result).forEach(feature => {
      const status = feature.supported ? '✓ 支持' : '✗ 不支持'
      lines.push(`${feature.name}: ${status}`)
      if (feature.details) {
        lines.push(`  ${feature.details}`)
      }
    })

    lines.push('')
    lines.push('-'.repeat(40))
    lines.push('由 PWA 检测工具生成')

    return lines.join('\n')
  }

  async function exportToPdf(
    element: HTMLElement,
    filename = 'pwa-detection-report.pdf'
  ): Promise<boolean> {
    isExporting.value = true
    try {
      // 使用 html2canvas 截图
      const canvas = await html2canvas(element, {
        scale: 2, // 高分辨率
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false
      })

      const imgData = canvas.toDataURL('image/png')
      
      // 计算 PDF 尺寸
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
      
      const imgWidth = canvas.width
      const imgHeight = canvas.height
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)
      
      const imgX = (pdfWidth - imgWidth * ratio) / 2
      let imgY = 10 // 顶部留白
      
      const scaledWidth = imgWidth * ratio
      const scaledHeight = imgHeight * ratio
      
      // 如果内容超出一页，需要分页
      let heightLeft = scaledHeight
      let position = imgY
      
      // 第一页
      pdf.addImage(imgData, 'PNG', imgX, position, scaledWidth, scaledHeight)
      heightLeft -= (pdfHeight - imgY)
      
      // 添加更多页面（如果内容超出）
      while (heightLeft > 0) {
        position = heightLeft - scaledHeight + imgY
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', imgX, position, scaledWidth, scaledHeight)
        heightLeft -= pdfHeight
      }
      
      pdf.save(filename)
      return true
    } catch (error) {
      console.error('PDF export failed:', error)
      return false
    } finally {
      isExporting.value = false
    }
  }

  return {
    isExporting,
    generateReport,
    exportToPdf
  }
}
