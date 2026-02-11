import { ref, computed } from 'vue'

// 功能名称到 caniuse 特性 ID 的映射
// 注意：不是所有功能都有 caniuse 数据，没有的功能会回退到本地数据
const caniuseFeatureMap: Record<string, string> = {
  'Service Worker': 'serviceworkers',
  // 'HTTPS环境': null, // caniuse 没有 HTTPS 基础协议数据
  'Web App Manifest': 'web-app-manifest',
  '推送通知': 'push-api',
  '离线存储': 'indexeddb',
  '设备API': 'web-share',
  // '媒体控制': null, // caniuse 没有 Media Session API 数据
  '性能优化': 'webworkers',
  '后台同步': 'background-sync'
}

// caniuse 浏览器键名 -> 我们的格式
const browserKeyMap: Record<string, string> = {
  'chrome': 'chrome',
  'firefox': 'firefox',
  'safari': 'safari',
  'edge': 'edge'
}

export interface RealtimeCompatData {
  globalSupport: number
  minVersions: {
    chrome: string
    firefox: string
    safari: string
    edge: string
  }
  lastUpdated: string
  source: string
}

interface CaniuseData {
  title: string
  description: string
  stats: Record<string, Record<string, string>>
  usage_perc_y: number
  usage_perc_a: number
}

/**
 * 解析版本号，支持范围格式如 "15.2-15.3"
 * 返回起始版本号
 */
function parseVersion(version: string): string {
  if (version.includes('-')) {
    return version.split('-')[0]
  }
  return version
}

/**
 * 检查支持状态是否为支持（y）或部分支持（a）
 * 格式可能是 "y", "y #4", "a", "n d #2" 等
 */
function isSupported(status: string): boolean {
  return status.startsWith('y') || status.startsWith('a')
}

/**
 * 检查是否完全支持（y）
 */
function isFullySupported(status: string): boolean {
  return status.startsWith('y')
}

export function useCompatData() {
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const cachedData = ref<Record<string, RealtimeCompatData & { timestamp: number }>>({})
  
  // 缓存有效期：24小时
  const CACHE_TTL = 24 * 60 * 60 * 1000

  /**
   * 从 caniuse 获取特性数据
   */
  async function fetchFromCaniuse(featureId: string): Promise<RealtimeCompatData | null> {
    try {
      const response = await fetch(`https://raw.githubusercontent.com/Fyrd/caniuse/main/features-json/${featureId}.json`)
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const data: CaniuseData = await response.json()
      const stats = data.stats || {}
      
      // 全球支持率 = 完全支持 + 部分支持
      const globalSupport = Math.round((data.usage_perc_y || 0) + (data.usage_perc_a || 0))
      
      // 解析各浏览器最低支持版本
      const minVersions: Record<string, string> = {}
      
      Object.entries(browserKeyMap).forEach(([caniuseKey, ourKey]) => {
        const browserStats = stats[caniuseKey]
        
        if (browserStats) {
          // 获取所有版本并按版本号排序
          const versions = Object.keys(browserStats)
          
          // 版本排序函数
          const sortedVersions = versions.sort((a, b) => {
            const vA = parseVersion(a)
            const vB = parseVersion(b)
            // 尝试作为数字比较
            const numA = parseFloat(vA)
            const numB = parseFloat(vB)
            if (!isNaN(numA) && !isNaN(numB)) {
              return numA - numB
            }
            // 字符串比较
            return vA.localeCompare(vB)
          })
          
          // 找出第一个支持的版本
          let firstSupported: string | null = null
          
          for (const version of sortedVersions) {
            const status = browserStats[version]
            if (isFullySupported(status) && !firstSupported) {
              firstSupported = parseVersion(version)
              break
            }
          }
          
          // 如果没有完全支持，找部分支持
          if (!firstSupported) {
            for (const version of sortedVersions) {
              const status = browserStats[version]
              if (isSupported(status)) {
                firstSupported = parseVersion(version) + ' (部分)'
                break
              }
            }
          }
          
          minVersions[ourKey] = firstSupported || '未支持'
        } else {
          minVersions[ourKey] = '未知'
        }
      })

      return {
        globalSupport,
        minVersions: {
          chrome: minVersions.chrome || '未知',
          firefox: minVersions.firefox || '未知',
          safari: minVersions.safari || '未知',
          edge: minVersions.edge || '未知'
        },
        lastUpdated: new Date().toLocaleDateString('zh-CN'),
        source: 'caniuse.com'
      }
    } catch (err) {
      console.warn('Failed to fetch from caniuse:', err)
      return null
    }
  }

  /**
   * 获取功能的实时兼容性数据
   */
  async function fetchFeatureData(featureName: string): Promise<RealtimeCompatData | null> {
    // 检查该功能是否有 caniuse 数据
    if (!(featureName in caniuseFeatureMap)) {
      // 没有在线数据，返回 null 表示使用本地数据
      return null
    }
    
    const featureId = caniuseFeatureMap[featureName]
    if (!featureId) return null

    // 检查缓存
    const cached = cachedData.value[featureName]
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      const { timestamp, ...data } = cached
      return data
    }

    isLoading.value = true
    error.value = null

    try {
      const result = await fetchFromCaniuse(featureId)
      
      if (result) {
        cachedData.value[featureName] = {
          ...result,
          timestamp: Date.now()
        }
        return result
      }

      return null
    } catch (err) {
      error.value = err instanceof Error ? err.message : '获取数据失败'
      return null
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 合并静态数据和实时数据
   */
  async function getMergedData<T extends { globalSupport: number; minVersions: Record<string, string> }>(
    staticData: T,
    featureName: string
  ): Promise<T> {
    const realtimeData = await fetchFeatureData(featureName)
    
    if (!realtimeData) {
      return staticData
    }

    return {
      ...staticData,
      globalSupport: realtimeData.globalSupport,
      minVersions: realtimeData.minVersions
    }
  }

  /**
   * 清除缓存
   */
  function clearCache() {
    cachedData.value = {}
  }

  return {
    isLoading: computed(() => isLoading.value),
    error: computed(() => error.value),
    cachedData: computed(() => cachedData.value),
    fetchFeatureData,
    getMergedData,
    clearCache
  }
}
