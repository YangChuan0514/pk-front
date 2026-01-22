import axios from 'axios'
import type {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios'


/**
 * 约定后端统一返回结构（结合 mock/test.ts）
 * 你可以按需扩展：message、success、timestamp 等
 */
export type ApiResponse<T = unknown> = {
  code: number
  data: T
  message?: string
}

export type TokenGetter = () => string | undefined | null
export type HttpErrorHandler = (error: unknown) => void

let getToken: TokenGetter | undefined
let onHttpError: HttpErrorHandler = (error) => {
  // 默认只输出到控制台；业务里可通过 setHttpErrorHandler 接入 Toast/ElMessage
  console.error(error)
}

export function setTokenGetter(getter: TokenGetter) {
  getToken = getter
}

export function setHttpErrorHandler(handler: HttpErrorHandler) {
  onHttpError = handler
}

export type RequestOptions = {
  /** 是否跳过业务 code 校验（直接返回 response.data） */
  raw?: boolean
  /** 是否自动带上 token（默认 true） */
  withAuth?: boolean
}

function isBlobLikeResponse(config?: AxiosRequestConfig) {
  const rt = config?.responseType
  return rt === 'blob' || rt === 'arraybuffer'
}

function pickErrorMessage(err: unknown) {
  if (axios.isAxiosError(err)) {
    const respData = err.response?.data
    const messageFromBody =
      respData && typeof respData === 'object' && 'message' in respData
        ? String((respData as { message?: unknown }).message ?? '')
        : ''
    return (
      messageFromBody ||
      err.response?.statusText ||
      err.message ||
      '请求失败'
    )
  }
  if (err instanceof Error) return err.message
  return '请求失败'
}

type InternalConfig = InternalAxiosRequestConfig & {
  __withAuth?: boolean
  __raw?: boolean
}

function isApiResponse(value: unknown): value is ApiResponse<unknown> {
  return (
    !!value &&
    typeof value === 'object' &&
    'code' in value &&
    typeof (value as { code: unknown }).code === 'number' &&
    'data' in value
  )
}

const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL || '',
  timeout: 1500000000,
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
  },
})

// 请求拦截器：自动注入 token、统一处理 config
service.interceptors.request.use(
  (config: InternalConfig) => {
    const withAuth = config.__withAuth !== false
    if (withAuth) {
      const token = getToken?.() ?? localStorage.getItem('token')
      if (token) {
        config.headers = config.headers ?? {}
        if (!config.headers.Authorization) {
          config.headers.Authorization = token.startsWith('Bearer ')
            ? token
            : `Bearer ${token}`
        }
      }
    }
    return config
  },
  (error) => {
    onHttpError(error)
    return Promise.reject(error)
  },
)

// 响应拦截器：统一处理业务 code、错误兜底
service.interceptors.response.use(
  (response: AxiosResponse) => {
    // blob/arraybuffer 等二进制直接返回
    if (isBlobLikeResponse(response.config)) return response

    // 调用方显式要求 raw：直接返回 response.data（不做业务 code 判断）
    const raw = (response.config as InternalConfig).__raw === true
    if (raw) return response.data

    const data = response.data as unknown
    if (isApiResponse(data)) {
      const { code, message } = data
      // 这里按你的 mock 约定：code === 0 表示成功
      if (code === 0 || code === 200) return data

      const err = new Error(message || `业务错误(code: ${code})`)
      onHttpError(err)
      return Promise.reject(err)
    }

    // 非统一结构：原样返回
    return data
  },
  (error: AxiosError) => {
    const msg = pickErrorMessage(error)
    const err = new Error(msg)
    onHttpError(err)
    return Promise.reject(err)
  },
)

/**
 * 接口获取器：统一的 request 方法（带泛型）
 *
 * 默认：
 * - 会校验业务 code（code === 0 才返回 data）
 * - 自动携带 token（可通过 options.withAuth = false 关闭）
 */
export async function request<T = unknown>(
  config: AxiosRequestConfig,
  options: RequestOptions = {},
): Promise<T> {
  const { raw = false, withAuth = true } = options

  // 透传给拦截器的内部开关（不影响 axios 真实请求字段）
  const mergedConfig = { ...config } as AxiosRequestConfig & {
    __withAuth?: boolean
    __raw?: boolean
  }
  mergedConfig.__withAuth = withAuth
  mergedConfig.__raw = raw

  // 由于响应拦截器已把响应解包为 data，这里把 axios 的返回类型显式声明为 T
  const resp = await service.request<T, T>(mergedConfig)

  // 二进制：直接把 AxiosResponse 丢给调用方（T 需自行声明）
  if (isBlobLikeResponse(mergedConfig)) return resp as unknown as T

  // 默认（raw=false）时，响应拦截器已把 ApiResponse 解包为 data
  return resp as T
}

/**
 * 暴露 http 对象，方便业务侧使用
 * @param url 请求 URL
 * @param params 请求参数
 * @param config 请求配置
 * @param options 请求选项
 * @returns 请求结果
 */
export const http = {
  instance: service,
  request,
  get: <T = unknown>(url: string, params?: unknown, config?: AxiosRequestConfig, options?: RequestOptions) =>
    request<T>({ ...(config || {}), url, method: 'GET', params }, options),
  post: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig, options?: RequestOptions) =>
    request<T>({ ...(config || {}), url, method: 'POST', data }, options),
  put: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig, options?: RequestOptions) =>
    request<T>({ ...(config || {}), url, method: 'PUT', data }, options),
  delete: <T = unknown>(url: string, params?: unknown, config?: AxiosRequestConfig, options?: RequestOptions) =>
    request<T>({ ...(config || {}), url, method: 'DELETE', params }, options),
  patch: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig, options?: RequestOptions) =>
    request<T>({ ...(config || {}), url, method: 'PATCH', data }, options),
}

// 额外暴露：方便业务侧自定义拦截器
export function addRequestInterceptor(
  onFulfilled: (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig>,
  onRejected?: (error: unknown) => unknown,
) {
  return service.interceptors.request.use(onFulfilled, onRejected)
}
/**
 * 添加响应拦截器
 * @param onFulfilled 成功回调
 * @param onRejected 失败回调
 * @returns 拦截器 ID
 */
export function addResponseInterceptor(
  onFulfilled: (response: AxiosResponse) => AxiosResponse | Promise<AxiosResponse>,
  onRejected?: (error: unknown) => unknown,
) {
  return service.interceptors.response.use(onFulfilled, onRejected)
}
/**
 * 移除请求拦截器
 * @param id 拦截器 ID
 * @returns 移除的拦截器
 */
export function ejectRequestInterceptor(id: number) {
  service.interceptors.request.eject(id)
}

/**
 * 移除响应拦截器
 * @param id 拦截器 ID
 * @returns 移除的拦截器
 */
export function ejectResponseInterceptor(id: number) {
  service.interceptors.response.eject(id)
}

export default service
