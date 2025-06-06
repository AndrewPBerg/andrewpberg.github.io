import { useRef } from 'react';
import { Mail, MapPin, Github, Linkedin, Phone } from 'lucide-react';

// Custom X logo component
const XLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    fill="currentColor"
    {...props}
  >
    <path d="M13.3174 10.7749L19.1457 4H17.7646L12.7852 9.88168L8.80681 4H4L10.0307 13.3081L4 20.2963H5.38119L10.5613 14.2006L14.6948 20.2963H19.5016L13.3171 10.7749H13.3174ZM11.1995 13.3732L10.5015 12.3368L5.96067 5.70258H7.76743L11.399 11.0999L12.097 12.1362L16.8349 19.0301H15.0281L11.1995 13.3735V13.3732Z" />
  </svg>
);

const Contact = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  
  return (
    <div className="space-y-4 antialiased will-change-transform max-w-[250px]">
      <div ref={contentRef}>
        <p className="text-xs text-muted-foreground mb-3">
          Always looking for new projects. <br />
          Best way to reach me is email. <br />
          Email for CV or business inquiries.
        </p>
        
        <div className="space-y-3 mb-3">
          <div className="flex items-start">
            <Mail className="w-3 h-3 mt-0.5 mr-2 text-muted-foreground" />
            <div>
              <div className="text-[10px] text-muted-foreground">Email</div>
              <a href="mailto:andberg9@gmail.com" className="text-xs hover:text-primary transition-colors font-medium">
                andberg9@gmail.com
              </a>
            </div>
          </div>
        
          
          <div className="flex items-start">
            <MapPin className="w-3 h-3 mt-0.5 mr-2 text-muted-foreground" />
            <div>
              <div className="text-[10px] text-muted-foreground">Location</div>
              <div className="text-xs font-medium">Southeastern US</div>
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
            aria-label="X Profile"
          >
            <XLogo className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Contact;
