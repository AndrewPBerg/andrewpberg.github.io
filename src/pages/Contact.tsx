
import { useRef } from 'react';
import { Mail, MapPin, Github, Linkedin, Twitter } from 'lucide-react';

const Contact = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  
  return (
    <div className="space-y-3 max-w-[250px]">
      <div ref={contentRef}>
        <p className="text-xs text-muted-foreground mb-3 antialiased">
          Always looking for new projects. <br />
          Best way to reach me is email.
        </p>
        
        <div className="space-y-3 mb-3">
          <div className="flex items-start">
            <Mail className="w-3 h-3 mt-0.5 mr-2 text-muted-foreground" />
            <div>
              <div className="text-[10px] text-muted-foreground antialiased">Email</div>
              <a href="mailto:andberg9@gmail.com" className="text-xs hover:text-primary transition-colors font-medium antialiased">
                andberg9@gmail.com
              </a>
            </div>
          </div>
          
          <div className="flex items-start">
            <MapPin className="w-3 h-3 mt-0.5 mr-2 text-muted-foreground" />
            <div>
              <div className="text-[10px] text-muted-foreground antialiased">Location</div>
              <div className="text-xs font-medium antialiased">Southeastern US</div>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2 mb-2">
          <a 
            href="https://github.com/AndrewPBerg" 
            className="flex items-center justify-center w-6 h-6 rounded-full hover:text-primary transition-colors"
            aria-label="GitHub Profile"
          >
            <Github className="w-3 h-3" />
          </a>
          
          <a 
            href="https://www.linkedin.com/in/andrew-berg-0822132b2/" 
            className="flex items-center justify-center w-6 h-6 rounded-full hover:text-primary transition-colors"
            aria-label="LinkedIn Profile"
          >
            <Linkedin className="w-3 h-3" />
          </a>
          
          <a 
            href="https://x.com/andrewpberg" 
            className="flex items-center justify-center w-6 h-6 rounded-full hover:text-primary transition-colors"
            aria-label="Twitter Profile"
          >
            <Twitter className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Contact;
