export const decode = (encodedString: string): string => {
  try {
    return decodeURIComponent(encodedString)
  } catch (error) {
    console.error('Failed to decode string:', error)
    return encodedString
  }
}

export const shuffle = <T,>(originalArray: T[]): T[] => {
  const shuffledArray = originalArray.slice()
  
  for (let currentIndex = shuffledArray.length - 1; currentIndex > 0; currentIndex--) {
    const randomIndex = Math.floor(Math.random() * (currentIndex + 1))
    
    ;[shuffledArray[currentIndex], shuffledArray[randomIndex]] = 
      [shuffledArray[randomIndex], shuffledArray[currentIndex]]
  }
  
  return shuffledArray
}

export const formatCategory = (rawCategory: string | undefined): string => {
  if (!rawCategory) return 'General'
  
  try {
    const decodedCategory = decodeURIComponent(rawCategory)
    return decodedCategory.replace(/^Entertainment:\s*/i, '')
  } catch (error) {
    console.error('Failed to format category:', error)
    return 'General'
  }
}