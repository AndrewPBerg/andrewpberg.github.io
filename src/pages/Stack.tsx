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
    <div className="space-y-4">
      {skills.map((skill) => (
        <div key={skill.name} className="pt-2">
          <h3 className="text-xs font-medium mb-2 text-foreground">{skill.name}</h3>
          <div className="flex flex-wrap gap-1">
            {skill.items.map((item) => (
              <span key={item.name} className="px-2 py-0.5 bg-secondary/50 text-secondary-foreground rounded-full text-[10px]">
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
