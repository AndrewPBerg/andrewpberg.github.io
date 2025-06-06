// Utility function to calculate reading time based on word count
// Average reading speed: 200-250 words per minute for technical content
// We'll use 225 words per minute as a reasonable middle ground

export function calculateReadingTime(content: string): string {
  // Remove markdown syntax and get clean text for word counting
  const cleanText = content
    // Remove code blocks
    .replace(/```[\s\S]*?```/g, '')
    // Remove inline code
    .replace(/`[^`]*`/g, '')
    // Remove markdown headers
    .replace(/^#{1,6}\s+/gm, '')
    // Remove markdown links but keep the text
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    // Remove markdown emphasis
    .replace(/[*_]{1,2}([^*_]*)[*_]{1,2}/g, '$1')
    // Remove markdown list markers
    .replace(/^[-*+]\s+/gm, '')
    // Remove numbered list markers
    .replace(/^\d+\.\s+/gm, '')
    // Remove HTML tags
    .replace(/<[^>]*>/g, '')
    // Remove extra whitespace and normalize
    .replace(/\s+/g, ' ')
    .trim();

  // Count words (split by whitespace and filter out empty strings)
  const wordCount = cleanText.split(/\s+/).filter(word => word.length > 0).length;
  
  // Calculate reading time in minutes (225 words per minute)
  const readingTimeMinutes = Math.max(1, Math.round(wordCount / 225));
  
  // Return formatted string
  return `${readingTimeMinutes} min read`;
}

// Export for debugging purposes
export function getWordCount(content: string): number {
  const cleanText = content
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]*`/g, '')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[*_]{1,2}([^*_]*)[*_]{1,2}/g, '$1')
    .replace(/^[-*+]\s+/gm, '')
    .replace(/^\d+\.\s+/gm, '')
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
    
  return cleanText.split(/\s+/).filter(word => word.length > 0).length;
} 