export function safeJsonParse<T>(item: string | null, fallback: T): T {
  if (!item) return fallback
  try {
    return JSON.parse(item) as T
  } catch (error) {
    console.error('Failed to parse JSON:', error)
    return fallback
  }
}

export function safeLocalStorageSet(key: string, value: any): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(`Failed to save ${key} to localStorage:`, error)
  }
}

export function safeLocalStorageGet(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch (error) {
    console.error(`Failed to get ${key} from localStorage:`, error)
    return null
  }
}

export function safeLocalStorageRemove(key: string): void {
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error(`Failed to remove ${key} from localStorage:`, error)
  }
}