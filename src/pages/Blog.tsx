import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Components } from 'react-markdown';

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

// Markdown content as constants
const MARKDOWN_POSTS = {
  testing: `# Testing Blog Post

This is a test blog post to demonstrate the markdown-based blog system.

## Introduction

Welcome to this test post! This demonstrates how markdown files can be rendered in our React blog.

## Features

- **Markdown rendering**: Convert \`.md\` files to HTML
- **Dynamic loading**: Load posts from the \`src/md\` directory
- **Modern styling**: Beautiful typography with Tailwind CSS

## Code Example

\`\`\`javascript
const greeting = "Hello, World!";
console.log(greeting);
\`\`\`

## Conclusion

This is just a sample post to test the markdown rendering functionality.

---

*Published: January 2024*`,

  aiFullstack: `# Building the Future: AI and Full-Stack Development

*Published: January 15, 2024 • 5 min read*

Artificial intelligence is fundamentally transforming how we approach full-stack development, creating new paradigms and opportunities that were unimaginable just a few years ago.

## The AI Revolution in Development

The integration of AI tools into the development workflow has become more than just a trend—it's a fundamental shift in how we build software. From code generation to automated testing, AI is reshaping every aspect of the development lifecycle.

### Key Areas of Impact

1. **Code Generation**: AI-powered tools can now generate entire components and functions
2. **Debugging Assistance**: Intelligent error detection and solution suggestions
3. **Performance Optimization**: Automated analysis and improvement recommendations
4. **Testing Automation**: Smart test case generation and execution

## Modern Full-Stack Architecture

Today's full-stack developers must navigate an increasingly complex landscape of technologies:

\`\`\`typescript
// Example: AI-assisted React component
const AIComponent: React.FC<Props> = ({ data }) => {
  const [insights, setInsights] = useState<AIInsights>();
  
  useEffect(() => {
    analyzeData(data).then(setInsights);
  }, [data]);
  
  return (
    <div className="ai-component">
      {insights && <InsightDisplay insights={insights} />}
    </div>
  );
};
\`\`\`

## The Future Landscape

As we look ahead, several trends are emerging:

- **No-Code/Low-Code Evolution**: AI making development accessible to non-programmers
- **Intelligent DevOps**: Automated deployment and scaling decisions
- **Predictive Development**: AI anticipating and preventing issues before they occur

## Conclusion

The fusion of AI and full-stack development isn't just changing how we code—it's redefining what it means to be a developer in the modern era. Embracing these changes while maintaining core engineering principles will be key to success.

---

*Tags: AI, Full-Stack, Development, Future Tech*`,

  developmentJourney: `# From Concept to Code: My Development Journey

*Published: January 10, 2024 • 7 min read*

Every developer has a unique story of how they arrived at their current skills and perspective. This is mine—a journey through challenges, breakthroughs, and continuous learning.

## The Beginning

My journey into development started not with code, but with curiosity. Like many developers, I was drawn to the idea of creating something from nothing, of building digital solutions to real-world problems.

### First Steps

The early days were marked by:

- **Trial and Error**: Learning by breaking things and fixing them
- **Documentation Deep Dives**: Spending hours reading MDN and Stack Overflow
- **Project-Based Learning**: Building small projects to understand concepts

## The Learning Curve

### Frontend Foundations

Starting with HTML, CSS, and JavaScript felt like learning a new language—which, of course, it was. The progression was gradual but rewarding:

\`\`\`html
<!-- My first "Hello World" -->
<!DOCTYPE html>
<html>
<head>
    <title>My First Page</title>
</head>
<body>
    <h1>Hello, World!</h1>
    <script>
        console.log("I'm a developer now!");
    </script>
</body>
</html>
\`\`\`

### Backend Adventures

Moving to backend development opened up new possibilities and challenges:

- **Server Logic**: Understanding request-response cycles
- **Database Design**: Learning relational and NoSQL concepts
- **API Development**: Building robust, scalable endpoints

## Key Milestones

### The Framework Discovery

Discovering React changed everything. The component-based architecture made sense, and suddenly complex UIs became manageable:

\`\`\`jsx
// The moment it clicked
const MyFirstComponent = () => {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
};
\`\`\`

### Full-Stack Integration

Learning to connect frontend and backend was like solving a complex puzzle. Each successful API call felt like a small victory.

## Challenges and Growth

### Common Obstacles

1. **Impostor Syndrome**: Feeling like I didn't belong in the tech community
2. **Technology Overload**: Too many frameworks, too little time
3. **Debugging Nightmares**: Spending days on seemingly simple bugs

### Lessons Learned

- **Fundamentals Matter**: Strong basics make learning new technologies easier
- **Community is Key**: Other developers are your greatest resource
- **Practice, Practice, Practice**: There's no substitute for hands-on experience

## Current Focus

Today, my interests center around:

- **Modern JavaScript/TypeScript**: Leveraging type safety and modern features
- **React Ecosystem**: Exploring Next.js, state management, and testing
- **AI Integration**: Incorporating AI tools to enhance development workflow

## Looking Forward

The journey continues with exciting developments on the horizon:

- **Web3 Technologies**: Exploring blockchain and decentralized applications
- **Edge Computing**: Understanding distributed systems and serverless architectures
- **Developer Experience**: Building tools that make other developers' lives easier

## Advice for New Developers

If you're starting your journey, remember:

1. **Be Patient**: Progress isn't always linear
2. **Build Projects**: Portfolio beats certificates every time
3. **Stay Curious**: Technology evolves rapidly—keep learning
4. **Find Your Community**: Connect with other developers online and offline

## Conclusion

Development is more than just writing code—it's about solving problems, continuous learning, and building the future one line at a time. The journey is challenging but incredibly rewarding.

---

*Tags: Career, Learning, Development, Personal Growth*`
};

// Function to load markdown files using direct content
const loadMarkdownFiles = async (): Promise<BlogPost[]> => {
  const posts: BlogPost[] = [];
  
  const markdownFiles = [
    { content: MARKDOWN_POSTS.testing, filename: 'testing.md' },
    { content: MARKDOWN_POSTS.aiFullstack, filename: 'ai-fullstack-development.md' },
    { content: MARKDOWN_POSTS.developmentJourney, filename: 'development-journey.md' }
  ];
  
  for (const { content, filename } of markdownFiles) {
    const post = extractMetadata(content, filename);
    posts.push(post);
  }
  
  // Sort posts by date (newest first)
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
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