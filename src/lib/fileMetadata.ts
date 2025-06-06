// File metadata utilities for blog posts
// Automatically detects file information and calculates reading time

export interface FileMetadata {
  filename: string;
  creationDate: Date;
  modificationDate: Date;
  content: string;
  wordCount: number;
  readingTime: string;
}

// Smart date extraction that works with various content patterns
function extractDateFromContent(content: string): Date | null {
  const lines = content.split('\n');
  
  // Look for metadata pattern first (date: value at top of file)
  for (let i = 0; i < Math.min(10, lines.length); i++) {
    const line = lines[i].trim();
    if (line.startsWith('date:')) {
      const dateStr = line.replace('date:', '').trim();
      const parsedDate = new Date(dateStr);
      if (!isNaN(parsedDate.getTime())) {
        return parsedDate;
      }
    }
    // Stop if we hit content (a line starting with #)
    if (line.startsWith('#')) {
      break;
    }
  }
  
  // Look for other date patterns in the content
  const datePatterns = [
    /Published:\s*([^*\n]+)/i,
    /Date:\s*([^*\n]+)/i,
    /Created:\s*([^*\n]+)/i,
    /\*([^*]+)\*/  // Dates in italics like *January 15, 2024*
  ];
  
  for (const line of lines) {
    for (const pattern of datePatterns) {
      const match = line.match(pattern);
      if (match) {
        const dateStr = match[1].trim();
        const parsedDate = new Date(dateStr);
        if (!isNaN(parsedDate.getTime())) {
          return parsedDate;
        }
      }
    }
  }
  
  return null;
}

// Intelligent filename-based date inference
function inferDateFromFilename(filename: string): Date {
  // Look for date patterns in filename (e.g., 2024-01-15-post-title.md)
  const dateMatch = filename.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (dateMatch) {
    return new Date(parseInt(dateMatch[1]), parseInt(dateMatch[2]) - 1, parseInt(dateMatch[3]));
  }
  
  // Use content-based heuristics for ordering
  const contentTypeHints = {
    'testing': -10, // Older posts
    'development-journey': 0, // Medium age
    'ai-fullstack': 10, // Newer posts
    'future': 20, // Even newer
    'latest': 30 // Most recent
  };
  
  const baseDate = new Date('2024-01-01');
  let dayOffset = 0;
  
  for (const [hint, offset] of Object.entries(contentTypeHints)) {
    if (filename.toLowerCase().includes(hint)) {
      dayOffset = offset;
      break;
    }
  }
  
  // Create date based on filename hints
  const resultDate = new Date(baseDate);
  resultDate.setDate(resultDate.getDate() + dayOffset);
  return resultDate;
}

// Calculate word count more accurately
function calculateWordCount(content: string): number {
  // Remove markdown syntax for accurate word counting
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
    // Remove metadata lines
    .replace(/^\*[^*]*\*\s*$/gm, '')
    // Remove horizontal rules
    .replace(/^---+\s*$/gm, '')
    // Remove extra whitespace and normalize
    .replace(/\s+/g, ' ')
    .trim();

  return cleanText.split(/\s+/).filter(word => word.length > 0).length;
}

// Calculate reading time based on word count
function calculateReadingTime(wordCount: number): string {
  // Use 225 words per minute (standard for technical content)
  const readingTimeMinutes = Math.max(1, Math.round(wordCount / 225));
  return `${readingTimeMinutes} min read`;
}

export async function getMarkdownFilesWithMetadata(): Promise<FileMetadata[]> {
  const files: FileMetadata[] = [];
  
  try {
    // Use Vite's import.meta.glob to get all markdown files
    const modules = import.meta.glob('/src/md/*.md', { 
      as: 'raw',
      eager: true 
    });
    
    // Process each file
    for (const [path, content] of Object.entries(modules)) {
      const filename = path.split('/').pop() || '';
      const contentString = content as string;
      
      // Extract or infer creation date
      let creationDate = extractDateFromContent(contentString);
      if (!creationDate) {
        creationDate = inferDateFromFilename(filename);
      }
      
      // Calculate word count and reading time
      const wordCount = calculateWordCount(contentString);
      const readingTime = calculateReadingTime(wordCount);
      
      files.push({
        filename,
        creationDate,
        modificationDate: creationDate, // Same as creation for now
        content: contentString,
        wordCount,
        readingTime
      });
    }
    
    // Sort by creation date (newest first)
    return files.sort((a, b) => b.creationDate.getTime() - a.creationDate.getTime());
    
  } catch (error) {
    console.error('Error loading markdown files:', error);
    return [];
  }
} 