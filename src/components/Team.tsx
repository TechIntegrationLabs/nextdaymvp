import { useInView } from '../hooks/useInView';

const team = [
  {
    name: 'Alex Chen',
    role: 'Founder & CEO',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    bio: 'Former Tech Lead at Google, specialized in AI and scalable systems.',
  },
  {
    name: 'Sarah Johnson',
    role: 'Head of Product',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400',
    bio: 'Product veteran with 10+ years experience in SaaS and mobile apps.',
  },
  {
    name: 'Michael Torres',
    role: 'Lead Developer',
    image: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&q=80&w=400',
    bio: 'Full-stack expert specialized in React and Node.js ecosystems.',
  },
  {
    name: 'Emily Zhang',
    role: 'AI Engineer',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=400',
    bio: 'PhD in Machine Learning, focused on practical AI applications.',
  },
];

export function Team() {
  const [ref, isVisible] = useInView({ threshold: 0.1 });

  return (
    <section ref={ref} className="min-h-screen py-24 relative">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className={`text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-16 transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}>
          Our Team
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <div
              key={member.name}
              className={`group relative transition-all duration-[2000ms] ease-out ${
                isVisible
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-20 opacity-0'
              }`}
              style={{ transitionDelay: `${index * 400}ms` }}
            >
              <div className="relative overflow-hidden rounded-2xl aspect-square mb-4">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 ease-out flex items-end p-6">
                  <p className="text-white text-sm">{member.bio}</p>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                {member.name}
              </h3>
              <p className="text-slate-600 dark:text-slate-300">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}