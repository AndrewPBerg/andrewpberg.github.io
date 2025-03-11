
import { useState } from 'react';
import { Beaker, Zap, Database, Code, Github } from 'lucide-react';

const Stack = () => {
  const [skills] = useState([
    {
      name: 'Languages',
      items: [
        { name: 'Python', icon: Beaker },
        { name: 'Java', icon: Beaker },
        { name: 'C', icon: Beaker },
        { name: 'JavaScript', icon: Zap },
        { name: 'TypeScript', icon: Zap },
        { name: 'HTML', icon: Code },
        { name: 'CSS', icon: Code },
      ],
    },
    {
      name: 'JS Frameworks',
      items: [
        { name: 'React', icon: Zap },
        { name: 'Next.js', icon: Zap },
        { name: 'Node.js', icon: Zap },
        { name: 'Vite', icon: Zap },
        { name: 'tailwindcss', icon: Code },
      ],
    },
    {
      name: 'Databases',
      items: [
        { name: 'MySQL', icon: Database },
      ],
    },
    {
      name: 'Python Frameworks',
      items: [
        { name: 'TensorFlow', icon: Beaker },
        { name: 'PyTorch', icon: Beaker },
        { name: 'Scikit-learn', icon: Beaker },
        { name: 'Pandas', icon: Beaker },
        { name: 'NumPy', icon: Beaker },
        { name: 'Pydantic', icon: Beaker },
        { name: 'WandB', icon: Beaker },
      ],
    },
    {
      name: 'DevOps',
      items: [
        { name: 'Docker', icon: Github },
        { name: 'GitHub', icon: Github },
      ],
    },
  ]);

  return (
    <div className="space-y-4 will-change-transform">
      {skills.map((skill) => (
        <div key={skill.name} className="pt-2">
          <h3 className="text-xs font-medium tracking-wide mb-2 text-foreground font-sans antialiased will-change-transform" 
              style={{ fontSmooth: 'always', textRendering: 'optimizeLegibility' }}>
            {skill.name}
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {skill.items.map((item) => (
              <span 
                key={item.name} 
                className="px-3 py-1 bg-secondary/60 text-secondary-foreground rounded-full text-[11px] font-medium tracking-wide antialiased transform-gpu"
                style={{ fontSmooth: 'always', textRendering: 'optimizeLegibility' }}
              >
                {item.name}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Stack;
