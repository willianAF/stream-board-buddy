import { MessageSquare, Briefcase } from 'lucide-react';
import { NavLink } from '@/components/NavLink';

export function Sidebar() {
  const navItems = [
    { icon: MessageSquare, label: 'Mensagens', to: '/' },
    { icon: Briefcase, label: 'Vagas', to: '/vagas' }
  ];

  return (
    <aside className="w-32 bg-sidebar-background border-r-2 border-sidebar-border/40 flex flex-col items-center py-8 gap-8 transition-colors duration-300">
      <div className="flex flex-col gap-4 flex-1 px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className="flex flex-col items-center justify-center gap-2 px-4 py-5 rounded-xl text-[hsl(var(--sidebar-primary))] hover:text-sidebar-foreground hover:bg-sidebar-accent transition-all duration-200 min-h-[88px] w-full"
            activeClassName="bg-[hsl(var(--sidebar-active))] text-sidebar-foreground shadow-lg"
          >
            <item.icon className="w-7 h-7" />
            <span className="text-xs font-semibold text-center leading-tight whitespace-nowrap">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </aside>
  );
}
