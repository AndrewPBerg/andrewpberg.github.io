import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Tag } from 'lucide-react';
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
  
  // Extract excerpt from first paragraph after title and metadata
  const contentStart = lines.findIndex(line => line.startsWith('# ')) + 1;
  const firstParagraph = lines.slice(contentStart).find(line => 
    line.trim() && !line.startsWith('*') && !line.startsWith('#') && !line.includes(':')
  );
  const excerpt = firstParagraph?.substring(0, 150) + '...' || 'No excerpt available';
  
  return {
    id: filename.replace('.md', ''),
    title,
    excerpt,
    date,
    readTime: readingTime,
    slug: filename.replace('.md', ''),
    content,
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
    <h1 className="text-4xl font-display font-bold mb-6 text-foreground" {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }) => (
    <h2 className="text-2xl font-display font-semibold mb-4 mt-8 text-foreground" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3 className="text-xl font-display font-semibold mb-3 mt-6 text-foreground" {...props}>
      {children}
    </h3>
  ),
  p: ({ children, ...props }) => (
    <p className="mb-4 text-muted-foreground leading-relaxed" {...props}>
      {children}
    </p>
  ),
  ul: ({ children, ...props }) => (
    <ul className="mb-4 ml-6 list-disc space-y-2" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol className="mb-4 ml-6 list-decimal space-y-2" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }) => (
    <li className="text-muted-foreground" {...props}>
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
        <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-foreground" {...props}>
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
  pre: ({ children, ...props }) => (
    <pre className="bg-muted border border-border rounded-lg p-4 mb-4 overflow-x-auto" {...props}>
      {children}
    </pre>
  ),
  blockquote: ({ children, ...props }) => (
    <blockquote className="border-l-4 border-primary pl-4 my-4 italic text-muted-foreground" {...props}>
      {children}
    </blockquote>
  ),
  hr: ({ ...props }) => (
    <hr className="my-8 border-border" {...props} />
  ),
};

const Blog = () => {
  const [mounted, setMounted] = useState(false);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

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
      <div className="min-h-screen bg-background relative z-10">
        <div className="fixed inset-0 bg-background -z-10" />
        
        {/* Header */}
        <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <button 
                onClick={() => setSelectedPost(null)}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm">Back to Blog</span>
              </button>
              <Link 
                to="/" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Portfolio
              </Link>
            </div>
          </div>
        </header>

        {/* Post Content */}
        <main className="container mx-auto px-6 py-12 relative z-10">
          <article className="max-w-4xl mx-auto">
            {/* Post metadata */}
            <div className="mb-8">
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
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
                <div className="flex items-center gap-2 mb-6">
                  <Tag className="w-4 h-4 text-muted-foreground" />
                  <div className="flex flex-wrap gap-2">
                    {selectedPost.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="bg-muted px-2 py-1 rounded text-xs text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="prose prose-lg prose-slate dark:prose-invert max-w-none prose-headings:font-display prose-headings:font-bold prose-h1:text-4xl prose-h1:mb-6 prose-h2:text-2xl prose-h2:mb-4 prose-h3:text-xl prose-h3:mb-3 prose-p:mb-4 prose-ul:mb-4 prose-ol:mb-4 prose-li:mb-1 prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-muted prose-pre:border prose-pre:border-border">
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                {selectedPost.content}
              </ReactMarkdown>
            </div>
          </article>
        </main>

        {/* Footer */}
        <footer className="border-t border-border/50 mt-20 relative z-10">
          <div className="container mx-auto px-6 py-8">
            <div className="text-center text-sm text-muted-foreground">
              <p>&copy; 2024 Andrew P. Berg. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative z-10">
      {/* Ensure no background effects by adding a solid background overlay */}
      <div className="fixed inset-0 bg-background -z-10" />
      
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link 
              to="/" 
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Back to Portfolio</span>
            </Link>
            <div className="w-20"></div> {/* Spacer for center alignment */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12 relative z-10">
        {/* Hero Section */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            Andrew P. Berg's Blog
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Informal posts about what I am learning/working on. 
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading blog posts...</p>
            </div>
          ) : (
            <div className="grid gap-8 md:gap-12">
              {blogPosts.map((post) => (
                <article 
                  key={post.id}
                  className="group cursor-pointer"
                  onClick={() => setSelectedPost(post)}
                >
                  <div className="border border-border/50 rounded-lg p-6 md:p-8 hover:border-border transition-all duration-300 hover:shadow-lg bg-card/30 backdrop-blur-sm">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl md:text-2xl font-display font-semibold mb-3 group-hover:text-primary transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                          {post.excerpt}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
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
                        <div className="flex items-center gap-2">
                          <Tag className="w-3 h-3 text-muted-foreground" />
                          <div className="flex flex-wrap gap-1">
                            {post.tags.slice(0, 3).map((tag, index) => (
                              <span 
                                key={index}
                                className="bg-muted/50 px-2 py-0.5 rounded text-xs text-muted-foreground"
                              >
                                {tag}
                              </span>
                            ))}
                            {post.tags.length > 3 && (
                              <span className="text-xs text-muted-foreground">
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

          {/* Message if no posts are loaded */}
          {!loading && blogPosts.length === 0 && (
            <div className="mt-16 text-center">
              <div className="border border-dashed border-border/50 rounded-lg p-8 md:p-12">
                <h3 className="text-xl font-display font-medium mb-4">No Posts Found</h3>
                <p className="text-muted-foreground mb-6">
                  No markdown files were found in the src/md directory.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-20 relative z-10">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>&copy; 2024 Andrew P. Berg. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Blog; 