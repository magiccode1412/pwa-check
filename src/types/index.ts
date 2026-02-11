// 检测结果状态
export type DetectionStatus = 'pending' | 'detecting' | 'completed' | 'error'

// 功能支持状态
export type SupportStatus = 'supported' | 'unsupported' | 'partial'

// 检测步骤
export interface DetectionStep {
  id: number
  name: string
  status: 'pending' | 'checking' | 'completed'
}

// 浏览器信息
export interface BrowserInfo {
  name: string
  version: string
  engine: string
  isMobile: boolean
  isHttps: boolean
}

// 功能检测结果
export interface FeatureResult {
  name: string
  supported: boolean
  icon: string
  details?: string
}

// PWA 检测结果
export interface DetectionResult {
  serviceWorker: FeatureResult
  https: FeatureResult
  manifest: FeatureResult
  pushNotification: FeatureResult
  offlineStorage: FeatureResult
  deviceAPI: FeatureResult
  mediaControl: FeatureResult
  performance: FeatureResult
}

// 浏览器兼容性信息
export interface BrowserCompatibility {
  name: string
  icon: string
  supportRate: string
  minVersion: string
  marketShare: string
  features: string[]
  limitations: string
}

// 使用建议
export interface Recommendation {
  type: 'success' | 'warning' | 'error'
  title: string
  content: string
}

// 用户设置
export interface UserSettings {
  cacheEnabled: boolean
  analyticsEnabled: boolean
  errorReportingEnabled: boolean
}

// 检测结果缓存
export interface CachedResult {
  timestamp: number
  result: DetectionResult
  browserInfo: BrowserInfo
}

// 分享选项
export interface ShareOptions {
  title: string
  text: string
  url?: string
  files?: File[]
}

// 对话框类型
export type DialogType = 'screenshot' | 'compatibility' | 'privacy' | 'dataSettings' | null

// 通知类型
export interface Notification {
  id: string
  type: 'success' | 'error' | 'info'
  message: string
}
