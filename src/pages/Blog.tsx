import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Tag, Sun, Moon, Copy, Check, Filter, ChevronDown } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Components } from 'react-markdown';
import { getMarkdownFilesWithMetadata } from '../lib/fileMetadata';

// Interface for blog post metadata
interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  slug: string;
  content: string;
  tags: string[];
  rawDate: Date;
}

// Sorting options
type SortOption = 'date-desc' | 'date-asc' | 'alpha-asc' | 'alpha-desc';

// Function to parse metadata from markdown content
const parseMetadata = (content: string) => {
  const lines = content.split('\n');
  const metadata: { [key: string]: string } = {};
  
  // Parse metadata lines at the top of the file
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Stop parsing metadata when we hit an empty line or content
    if (!line || line.startsWith('#')) {
      break;
    }
    
    // Parse key: value format
    const match = line.match(/^([^:]+):\s*(.+)$/);
    if (match) {
      const key = match[1].trim().toLowerCase();
      const value = match[2].trim();
      metadata[key] = value;
    }
  }
  
  return metadata;
};

// Function to extract metadata from markdown content using FileMetadata
const extractMetadata = (fileMetadata: any): BlogPost => {
  const { filename, content, readingTime } = fileMetadata;
  
  // Parse metadata from the top of the file
  const metadata = parseMetadata(content);
  
  const lines = content.split('\n');
  const title = lines.find(line => line.startsWith('# '))?.replace('# ', '') || filename;
  
  // Use metadata date if available, otherwise use file metadata
  let date: string;
  let rawDate: Date;
  if (metadata.date) {
    rawDate = new Date(metadata.date);
    date = rawDate.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  } else {
    rawDate = fileMetadata.creationDate;
    date = rawDate.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }
  
  // Parse tags
  const tags = metadata.tags ? metadata.tags.split(',').map(tag => tag.trim()) : [];
  
  // Remove metadata lines from content for rendering
  const cleanedLines = [];
  let metadataSectionEnded = false;
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // Skip metadata lines at the beginning
    if (!metadataSectionEnded) {
      // If we hit a title or empty line, metadata section has ended
      if (trimmedLine.startsWith('#') || (trimmedLine === '' && cleanedLines.length === 0)) {
        metadataSectionEnded = true;
      }
      // Skip lines that look like metadata (key: value)
      else if (trimmedLine.match(/^[^:]+:\s*.+$/)) {
        continue;
      }
    }
    
    // Add line to cleaned content once metadata section has ended
    if (metadataSectionEnded) {
      cleanedLines.push(line);
    }
  }
  
  const cleanedContent = cleanedLines.join('\n');
  
  // Extract excerpt from first paragraph after title
  const contentStart = cleanedLines.findIndex(line => line.startsWith('# ')) + 1;
  const firstParagraph = cleanedLines.slice(contentStart).find(line => 
    line.trim() && !line.startsWith('*') && !line.startsWith('#')
  );
  const excerpt = firstParagraph?.substring(0, 150) + '...' || 'No excerpt available';
  
  return {
    id: filename.replace('.md', ''),
    title,
    excerpt,
    date,
    readTime: readingTime,
    slug: filename.replace('.md', ''),
    content: cleanedContent,
    tags,
    rawDate
  };
};

// Function to load all markdown files from the md directory
const loadMarkdownFiles = async (): Promise<BlogPost[]> => {
  try {
    // Get all markdown files with metadata
    const filesWithMetadata = await getMarkdownFilesWithMetadata();
    
    // Convert to BlogPost format
    const posts = filesWithMetadata.map(file => extractMetadata(file));
    
    // Sort posts by date (newest first)
    return posts.sort((a, b) => b.rawDate.getTime() - a.rawDate.getTime());
  } catch (error) {
    console.error('Error loading markdown files:', error);
    return [];
  }
};

// Custom components for ReactMarkdown to ensure proper styling
const markdownComponents: Components = {
  h1: ({ children, ...props }) => (
    <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold mb-4 sm:mb-6 text-foreground" {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }) => (
    <h2 className="text-xl sm:text-2xl font-display font-semibold mb-3 sm:mb-4 mt-6 sm:mt-8 text-foreground" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3 className="text-lg sm:text-xl font-display font-semibold mb-2 sm:mb-3 mt-4 sm:mt-6 text-foreground" {...props}>
      {children}
    </h3>
  ),
  p: ({ children, ...props }) => (
    <p className="mb-3 sm:mb-4 text-sm sm:text-base text-muted-foreground leading-relaxed" {...props}>
      {children}
    </p>
  ),
  ul: ({ children, ...props }) => (
    <ul className="mb-3 sm:mb-4 ml-4 sm:ml-6 list-disc space-y-1 sm:space-y-2" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol className="mb-3 sm:mb-4 ml-4 sm:ml-6 list-decimal space-y-1 sm:space-y-2" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }) => (
    <li className="text-sm sm:text-base text-muted-foreground" {...props}>
      {children}
    </li>
  ),
  strong: ({ children, ...props }) => (
    <strong className="font-semibold text-foreground" {...props}>
      {children}
    </strong>
  ),
  em: ({ children, ...props }) => (
    <em className="italic text-muted-foreground" {...props}>
      {children}
    </em>
  ),
  code: ({ children, className, ...props }) => {
    const isInline = !className;
    if (isInline) {
      return (
        <code className="bg-muted px-1 sm:px-1.5 py-0.5 rounded text-xs sm:text-sm font-mono text-foreground" {...props}>
          {children}
        </code>
      );
    }
    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },
  pre: ({ children, ...props }) => {
    const [copied, setCopied] = useState(false);
    
    const copyToClipboard = async () => {
      try {
        // Extract text content from the code element
        const codeElement = (children as any)?.props?.children;
        const textContent = typeof codeElement === 'string' ? codeElement : codeElement?.toString() || '';
        
        await navigator.clipboard.writeText(textContent);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy text: ', err);
      }
    };

    return (
      <div className="relative group">
        <pre className="bg-muted border border-border rounded-lg p-3 sm:p-4 mb-3 sm:mb-4 overflow-x-auto text-xs sm:text-sm" {...props}>
          {children}
        </pre>
        <button
          onClick={copyToClipboard}
          className="absolute top-2 right-2 p-2 rounded-md bg-background/80 border border-border/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-background/90 hover:border-border"
          aria-label="Copy code"
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-500" />
          ) : (
            <Copy className="w-4 h-4 text-muted-foreground hover:text-foreground" />
          )}
        </button>
      </div>
    );
  },
  blockquote: ({ children, ...props }) => (
    <blockquote className="border-l-4 border-primary pl-3 sm:pl-4 my-3 sm:my-4 italic text-sm sm:text-base text-muted-foreground" {...props}>
      {children}
    </blockquote>
  ),
  hr: ({ ...props }) => (
    <hr className="my-6 sm:my-8 border-border" {...props} />
  ),
};

const Blog = () => {
  const [mounted, setMounted] = useState(false);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [blogTheme, setBlogTheme] = useState<'light' | 'dark'>('dark');
  const [sortBy, setSortBy] = useState<SortOption>('date-desc');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [availableTags, setAvailableTags] = useState<string[]>([]);

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('blog-theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setBlogTheme(savedTheme);
    }
  }, []);

  // Toggle theme function
  const toggleTheme = () => {
    const newTheme = blogTheme === 'dark' ? 'light' : 'dark';
    setBlogTheme(newTheme);
    localStorage.setItem('blog-theme', newTheme);
  };

  // Sort and filter posts
  useEffect(() => {
    let filtered = [...blogPosts];

    // Filter by tag
    if (selectedTag !== 'all') {
      filtered = filtered.filter(post => post.tags.includes(selectedTag));
    }

    // Sort posts
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return b.rawDate.getTime() - a.rawDate.getTime();
        case 'date-asc':
          return a.rawDate.getTime() - b.rawDate.getTime();
        case 'alpha-asc':
          return a.title.localeCompare(b.title);
        case 'alpha-desc':
          return b.title.localeCompare(a.title);
        default:
          return b.rawDate.getTime() - a.rawDate.getTime();
      }
    });

    setFilteredPosts(filtered);
  }, [blogPosts, sortBy, selectedTag]);

  // Extract available tags when posts are loaded
  useEffect(() => {
    const tags = new Set<string>();
    blogPosts.forEach(post => {
      post.tags.forEach(tag => tags.add(tag));
    });
    setAvailableTags(Array.from(tags).sort());
  }, [blogPosts]);

  useEffect(() => {
    // Clean up any existing VANTA effects when blog mounts
    const cleanupVanta = () => {
      if (typeof window !== 'undefined') {
        // Remove any existing VANTA canvases
        const vantaCanvases = document.querySelectorAll('.vanta-canvas');
        vantaCanvases.forEach(canvas => {
          canvas.remove();
        });
        
        // Cancel any animation frames that might be running
        if (window.requestAnimationFrame) {
          let id = window.requestAnimationFrame(() => {});
          for (let i = 0; i <= id; i++) {
            window.cancelAnimationFrame(i);
          }
        }
      }
    };

    cleanupVanta();
    setMounted(true);

    // Load markdown files
    loadMarkdownFiles().then(posts => {
      setBlogPosts(posts);
      setLoading(false);
    });

    // Cleanup on unmount
    return () => {
      cleanupVanta();
    };
  }, []);

  // Prevent any background animations or effects from running
  useEffect(() => {
    // Ensure no background animations are running
    document.body.style.overflow = 'auto'; // Allow scrolling on blog page
    
    return () => {
      // Reset overflow when leaving blog page
      document.body.style.overflow = 'hidden';
    };
  }, []);

  if (!mounted) {
    return <div className="min-h-screen bg-background"></div>;
  }

  // If a post is selected, show the full post view
  if (selectedPost) {
    return (
      <div className={`min-h-screen relative z-10 ${blogTheme === 'light' ? 'bg-white text-gray-900' : 'bg-background text-foreground'}`}>
        <div className={`fixed inset-0 -z-10 ${blogTheme === 'light' ? 'bg-white' : 'bg-background'}`} />
        
        {/* Header */}
        <header className={`border-b sticky top-0 z-50 backdrop-blur-sm ${
          blogTheme === 'light' 
            ? 'border-gray-200 bg-white/80' 
            : 'border-border/50 bg-background/80'
        }`}>
          <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
            <div className="flex items-center justify-between">
              <button 
                onClick={() => setSelectedPost(null)}
                className={`flex items-center gap-2 transition-colors ${
                  blogTheme === 'light'
                    ? 'text-gray-600 hover:text-gray-900'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm">Back to Blog</span>
              </button>
              <div className="flex items-center gap-3">
                <button
                  onClick={toggleTheme}
                  className={`p-2 rounded-full transition-colors ${
                    blogTheme === 'light'
                      ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                  aria-label="Toggle theme"
                >
                  {blogTheme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-6 h-6" />}
                </button>
                <Link 
                  to="/" 
                  className={`text-sm transition-colors ${
                    blogTheme === 'light'
                      ? 'text-gray-600 hover:text-gray-900'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Portfolio
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Post Content */}
        <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-12 relative z-10">
          <article className="max-w-none sm:max-w-3xl md:max-w-4xl mx-auto">
            {/* Post metadata */}
            <div className="mb-6 sm:mb-8">
              <div className={`flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm mb-4 ${
                blogTheme === 'light' ? 'text-gray-600' : 'text-muted-foreground'
              }`}>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{selectedPost.date}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{selectedPost.readTime}</span>
                </div>
              </div>
              {selectedPost.tags.length > 0 && (
                <div className="flex items-start gap-2 mb-4 sm:mb-6">
                  <Tag className={`w-4 h-4 mt-0.5 ${blogTheme === 'light' ? 'text-gray-600' : 'text-muted-foreground'}`} />
                  <div className="flex flex-wrap gap-2">
                    {selectedPost.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className={`px-2 py-1 rounded text-xs ${
                          blogTheme === 'light'
                            ? 'bg-gray-100 text-gray-600'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className={`prose prose-sm sm:prose-base md:prose-lg max-w-none prose-headings:font-display prose-headings:font-bold prose-h1:text-2xl sm:prose-h1:text-3xl md:prose-h1:text-4xl prose-h1:mb-4 sm:prose-h1:mb-6 prose-h2:text-xl sm:prose-h2:text-2xl prose-h2:mb-3 sm:prose-h2:mb-4 prose-h3:text-lg sm:prose-h3:text-xl prose-h3:mb-2 sm:prose-h3:mb-3 prose-p:mb-3 sm:prose-p:mb-4 prose-ul:mb-3 sm:prose-ul:mb-4 prose-ol:mb-3 sm:prose-ol:mb-4 prose-li:mb-1 prose-code:px-1 sm:prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-pre:text-xs sm:prose-pre:text-sm ${
              blogTheme === 'light' 
                ? 'prose-slate prose-headings:text-gray-900 prose-p:text-gray-700 prose-strong:text-gray-900 prose-em:text-gray-600 prose-code:bg-gray-100 prose-code:text-gray-800 prose-pre:bg-gray-100 prose-pre:border prose-pre:border-gray-200 prose-blockquote:border-l-gray-300 prose-blockquote:text-gray-600 prose-hr:border-gray-200'
                : 'prose-slate dark:prose-invert prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-em:text-muted-foreground prose-code:bg-muted prose-code:text-foreground prose-pre:bg-muted prose-pre:border prose-pre:border-border prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground prose-hr:border-border'
            }`}>
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                {selectedPost.content}
              </ReactMarkdown>
            </div>
          </article>
        </main>

        {/* Footer */}
        <footer className={`border-t mt-12 sm:mt-16 md:mt-20 relative z-10 ${
          blogTheme === 'light' ? 'border-gray-200' : 'border-border/50'
        }`}>
          <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
            <div className={`text-center text-sm ${
              blogTheme === 'light' ? 'text-gray-600' : 'text-muted-foreground'
            }`}>
              <p>&copy; 2024 Andrew P. Berg. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className={`min-h-screen relative z-10 ${blogTheme === 'light' ? 'bg-white text-gray-900' : 'bg-background text-foreground'}`}>
      {/* Ensure no background effects by adding a solid background overlay */}
      <div className={`fixed inset-0 -z-10 ${blogTheme === 'light' ? 'bg-white' : 'bg-background'}`} />
      
      {/* Header */}
      <header className={`border-b sticky top-0 z-50 backdrop-blur-sm ${
        blogTheme === 'light' 
          ? 'border-gray-200 bg-white/80' 
          : 'border-border/50 bg-background/80'
      }`}>
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <Link 
              to="/" 
              className={`flex items-center gap-2 transition-colors ${
                blogTheme === 'light'
                  ? 'text-gray-600 hover:text-gray-900'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Back to Portfolio</span>
            </Link>
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-colors ${
                blogTheme === 'light'
                  ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
              aria-label="Toggle theme"
            >
              {blogTheme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-10 md:py-12 relative z-10">
        {/* Hero Section */}
        <div className="max-w-3xl mx-auto text-center mb-10 sm:mb-12 md:mb-16">
          <h2 className={`text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-4 sm:mb-6 ${
            blogTheme === 'light' ? 'text-gray-900' : 'text-foreground'
          }`}>
            Andrew P. Berg's Blog
          </h2>
          <p className={`text-base sm:text-lg leading-relaxed px-2 sm:px-0 ${
            blogTheme === 'light' ? 'text-gray-600' : 'text-muted-foreground'
          }`}>
            Informal posts about what I am learning/working on. 
          </p>
        </div>

        {/* Filters */}
        {!loading && blogPosts.length > 0 && (
          <div className="max-w-4xl mx-auto mb-8 sm:mb-10">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className={`w-4 h-4 ${blogTheme === 'light' ? 'text-gray-600' : 'text-muted-foreground'}`} />
                <span className={`text-sm font-medium ${blogTheme === 'light' ? 'text-gray-900' : 'text-foreground'}`}>
                  Filters:
                </span>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                {/* Sort By Filter */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className={`appearance-none bg-transparent border rounded-md px-3 py-2 pr-8 text-sm cursor-pointer transition-colors ${
                      blogTheme === 'light'
                        ? 'border-gray-300 text-gray-900 hover:border-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20'
                        : 'border-border text-foreground hover:border-border/80 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'
                    }`}
                  >
                    <option value="date-desc">Newest First</option>
                    <option value="date-asc">Oldest First</option>
                    <option value="alpha-asc">A-Z</option>
                    <option value="alpha-desc">Z-A</option>
                  </select>
                  <ChevronDown className={`absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${
                    blogTheme === 'light' ? 'text-gray-600' : 'text-muted-foreground'
                  }`} />
                </div>

                {/* Tag Filter */}
                {availableTags.length > 0 && (
                  <div className="relative">
                    <select
                      value={selectedTag}
                      onChange={(e) => setSelectedTag(e.target.value)}
                      className={`appearance-none bg-transparent border rounded-md px-3 py-2 pr-8 text-sm cursor-pointer transition-colors min-w-[120px] ${
                        blogTheme === 'light'
                          ? 'border-gray-300 text-gray-900 hover:border-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20'
                          : 'border-border text-foreground hover:border-border/80 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'
                      }`}
                    >
                      <option value="all">All Tags</option>
                      {availableTags.map((tag) => (
                        <option key={tag} value={tag}>
                          {tag}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className={`absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${
                      blogTheme === 'light' ? 'text-gray-600' : 'text-muted-foreground'
                    }`} />
                  </div>
                )}
              </div>
            </div>

            {/* Results count */}
            <div className={`mt-4 text-sm ${blogTheme === 'light' ? 'text-gray-600' : 'text-muted-foreground'}`}>
              Showing {filteredPosts.length} of {blogPosts.length} post{blogPosts.length !== 1 ? 's' : ''}
              {selectedTag !== 'all' && (
                <span> • Filtered by tag: <span className="font-medium">{selectedTag}</span></span>
              )}
            </div>
          </div>
        )}

        {/* Blog Posts Grid */}
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="text-center py-8 sm:py-12">
              <p className={blogTheme === 'light' ? 'text-gray-600' : 'text-muted-foreground'}>Loading blog posts...</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:gap-8 md:gap-12">
              {filteredPosts.map((post) => (
                <article 
                  key={post.id}
                  className="group cursor-pointer"
                  onClick={() => setSelectedPost(post)}
                >
                  <div className={`border rounded-lg p-4 sm:p-6 md:p-8 transition-all duration-300 hover:shadow-lg backdrop-blur-sm ${
                    blogTheme === 'light'
                      ? 'border-gray-200 hover:border-gray-300 bg-white/60 hover:bg-white/80'
                      : 'border-border/50 hover:border-border bg-card/30'
                  }`}>
                    <div className="flex flex-col gap-3 sm:gap-4 mb-4">
                      <div className="flex-1">
                        <h3 className={`text-lg sm:text-xl md:text-2xl font-display font-semibold mb-2 sm:mb-3 transition-colors leading-tight ${
                          blogTheme === 'light'
                            ? 'text-gray-900 group-hover:text-blue-600'
                            : 'text-foreground group-hover:text-primary'
                        }`}>
                          {post.title}
                        </h3>
                        <p className={`text-sm sm:text-base leading-relaxed mb-3 sm:mb-4 ${
                          blogTheme === 'light' ? 'text-gray-600' : 'text-muted-foreground'
                        }`}>
                          {post.excerpt}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                      <div className={`flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm ${
                        blogTheme === 'light' ? 'text-gray-600' : 'text-muted-foreground'
                      }`}>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{post.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{post.readTime}</span>
                        </div>
                      </div>
                      
                      {post.tags.length > 0 && (
                        <div className="flex items-start gap-2">
                          <Tag className={`w-3 h-3 mt-0.5 sm:mt-0 ${
                            blogTheme === 'light' ? 'text-gray-600' : 'text-muted-foreground'
                          }`} />
                          <div className="flex flex-wrap gap-1">
                            {post.tags.slice(0, 3).map((tag, index) => (
                              <span 
                                key={index}
                                className={`px-2 py-0.5 rounded text-xs ${
                                  blogTheme === 'light'
                                    ? 'bg-gray-100 text-gray-600'
                                    : 'bg-muted/50 text-muted-foreground'
                                }`}
                              >
                                {tag}
                              </span>
                            ))}
                            {post.tags.length > 3 && (
                              <span className={`text-xs ${
                                blogTheme === 'light' ? 'text-gray-600' : 'text-muted-foreground'
                              }`}>
                                +{post.tags.length - 3}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Message if no posts match filters */}
          {!loading && filteredPosts.length === 0 && blogPosts.length > 0 && (
            <div className="mt-12 sm:mt-16 text-center">
              <div className={`border border-dashed rounded-lg p-6 sm:p-8 md:p-12 ${
                blogTheme === 'light' ? 'border-gray-300' : 'border-border/50'
              }`}>
                <h3 className={`text-lg sm:text-xl font-display font-medium mb-3 sm:mb-4 ${
                  blogTheme === 'light' ? 'text-gray-900' : 'text-foreground'
                }`}>No Posts Match Your Filters</h3>
                <p className={`text-sm sm:text-base mb-4 sm:mb-6 ${
                  blogTheme === 'light' ? 'text-gray-600' : 'text-muted-foreground'
                }`}>
                  Try adjusting your filters to see more posts.
                </p>
                <button
                  onClick={() => {
                    setSortBy('date-desc');
                    setSelectedTag('all');
                  }}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-md border transition-colors text-sm ${
                    blogTheme === 'light'
                      ? 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      : 'border-border text-muted-foreground hover:bg-muted'
                  }`}
                >
                  Reset Filters
                </button>
              </div>
            </div>
          )}

          {/* Message if no posts are loaded */}
          {!loading && blogPosts.length === 0 && (
            <div className="mt-12 sm:mt-16 text-center">
              <div className={`border border-dashed rounded-lg p-6 sm:p-8 md:p-12 ${
                blogTheme === 'light' ? 'border-gray-300' : 'border-border/50'
              }`}>
                <h3 className={`text-lg sm:text-xl font-display font-medium mb-3 sm:mb-4 ${
                  blogTheme === 'light' ? 'text-gray-900' : 'text-foreground'
                }`}>No Posts Found</h3>
                <p className={`text-sm sm:text-base mb-4 sm:mb-6 ${
                  blogTheme === 'light' ? 'text-gray-600' : 'text-muted-foreground'
                }`}>
                  No markdown files were found in the src/md directory.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className={`border-t mt-12 sm:mt-16 md:mt-20 relative z-10 ${
        blogTheme === 'light' ? 'border-gray-200' : 'border-border/50'
      }`}>
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className={`text-center text-sm ${
            blogTheme === 'light' ? 'text-gray-600' : 'text-muted-foreground'
          }`}>
            <p>&copy; 2024 Andrew P. Berg. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Blog; 