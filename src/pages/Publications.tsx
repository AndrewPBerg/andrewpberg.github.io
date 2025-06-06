import { useRef } from 'react';
import { FileText, ExternalLink } from 'lucide-react';

const Publications = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  
  const publications = [
    {
      title: "Advanced Machine Learning Techniques",
      authors: "Berg, Zhang, Wang",
      venue: "Intl. Conf. on  DATA Science, Technology, and Applications",
      year: "2025",
      link: "https://arxiv.org/abs/2505.23782",
    },
   
  ];
  
  return (
    <div className="space-y-4 antialiased will-change-transform">
      <div ref={contentRef} className="space-y-4">
        <h2 className="text-base font-large font-display mb-1 antialiased will-change-transform">
          Publications & Writing
        </h2>
        
        <p className="text-xs text-muted-foreground">
          Research papers, articles, and technical writing hosted elsewhere.
        </p>
        
        <div className="space-y-3 pt-2">
          {publications.map((pub, index) => (
            <div key={index} className="border-l-2 border-primary/20 pl-3 space-y-1">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-xs font-medium text-foreground leading-relaxed">
                  {pub.title}
                </h3>
                <a 
                  href={pub.link}
                  className="text-primary hover:text-primary/80 transition-colors flex-shrink-0"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink size={12} />
                </a>
              </div>
              <p className="text-[10px] text-muted-foreground">
                {pub.authors}
              </p>
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                <span>{pub.venue} • {pub.year}</span>
              </div>
            </div>
          ))}
        </div>
        
      </div>
    </div>
  );
};

export default Publications; 