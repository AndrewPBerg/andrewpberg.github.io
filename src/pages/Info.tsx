import { useRef } from 'react';

const Info = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  
  return (
    <div className="space-y-4 antialiased will-change-transform">
      <div ref={contentRef} className="space-y-4">

        <h2 className="text-base font-large font-display  mb-1 antialiased will-change-transform">
          AI & Full-Stack Developer
        </h2>
        
        <p className="text-xs text-muted-foreground">
          Building the future of intelligent applications.
        </p>
        
        <p className="text-xs text-muted-foreground">
          Born in 2004 in New York. Currently in the Southeastern US. Looking to travel the world, then change it.
        </p>
        
        {/* <div className="pt-2"> */}
          {/* <h3 className="text-xs font-medium mb-2 text-foreground">Lorem Ipsum</h3> */}
          {/* <div className="flex flex-wrap gap-1">
            {['Lorem', 'Ipsum', 'Dolor', 'Sit', 'Amet', 'Consectetur', 'Adipiscing', 'Elit', 'Nulla'].map((skill) => (
              <span key={skill} className="px-2 py-0.5 bg-secondary/50 text-secondary-foreground rounded-full text-[10px]">
                {skill}
              </span>
            ))}
          </div> */}
        {/* </div> */}
      </div>
    </div>
  );
};

export default Info;
