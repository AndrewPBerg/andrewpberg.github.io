
import { useState } from 'react';
import { Beaker, Zap, Database, Code, Github } from 'lucide-react';

const Stack = () => {
  const [skills] = useState([
    {
      name: 'Languages',
      items: [
        { name: 'Python', icon: Beaker },
        { name: 'TypeScript', icon: Zap },
      ],
    },
    {
      name: 'Databases & Services',
      items: [
        { name: 'Redis', icon: Database },
        { name: 'PostgreSQL', icon: Database },
        { name: 'SQLite', icon: Database },
      ],
    },
    {
      name: 'Python Frameworks',
      items: [
        { name: 'PyTorch', icon: Beaker },
        { name: 'Scikit-learn', icon: Beaker },
        { name: 'Pandas', icon: Beaker },
        { name: 'NumPy', icon: Beaker },
        { name: 'Pydantic', icon: Beaker },
      ],
    },
    {
      name: 'DevOps',
      items: [
        { name: 'Docker', icon: Github },
        { name: 'GitLab', icon: Github },
        { name: 'AWS', icon: Github },
      ],
    },
  ]);

  return (
    <div className="space-y-4 will-change-transform antialiased">
      {skills.map((skill) => (
        <div key={skill.name} className="pt-2">
          <h3 className="text-base font-medium font-display mb-1  antialiased will-change-transform"
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
