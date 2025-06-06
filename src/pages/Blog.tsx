import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Interface for blog post metadata
interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  slug: string;
  content: string;
}

// Function to extract metadata from markdown content
const extractMetadata = (content: string, filename: string): BlogPost => {
  const lines = content.split('\n');
  const title = lines.find(line => line.startsWith('# '))?.replace('# ', '') || filename;
  
  // Extract date and read time from the second line if it follows the pattern
  const metaLine = lines.find(line => line.includes('Published:') && line.includes('min read'));
  const dateMatch = metaLine?.match(/Published: ([^•]+)/);
  const readTimeMatch = metaLine?.match(/(\d+ min read)/);
  
  const date = dateMatch ? dateMatch[1].trim() : new Date().toLocaleDateString();
  const readTime = readTimeMatch ? readTimeMatch[1] : '5 min read';
  
  // Extract excerpt from first paragraph after title
  const contentStart = lines.findIndex(line => line.startsWith('# ')) + 1;
  const firstParagraph = lines.slice(contentStart).find(line => 
    line.trim() && !line.startsWith('*') && !line.startsWith('#')
  );
  const excerpt = firstParagraph?.substring(0, 150) + '...' || 'No excerpt available';
  
  return {
    id: filename.replace('.md', ''),
    title,
    excerpt,
    date,
    readTime,
    slug: filename.replace('.md', ''),
    content
  };
};

// Function to load markdown files using dynamic imports
const loadMarkdownFiles = async (): Promise<BlogPost[]> => {
  const posts: BlogPost[] = [];
  

    // Import markdown files directly
    const testingMd = await import('../md/testing.md?raw');
    const aiMd = await import('../md/ai-fullstack-development.md?raw');
    const journeyMd = await import('../md/development-journey.md?raw');
    
    const markdownFiles = [
      { content: testingMd.default, filename: 'testing.md' },
      { content: aiMd.default, filename: 'ai-fullstack-development.md' },
      { content: journeyMd.default, filename: 'development-journey.md' }
    ];
    
    for (const { content, filename } of markdownFiles) {
      const post = extractMetadata(content, filename);
      posts.push(post);
    }
 
  
  // Sort posts by date (newest first)
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
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
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
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
                  Markdown files could not be loaded. Make sure the files are accessible in the src/md directory.
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