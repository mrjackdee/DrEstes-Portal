import React from 'react';
import { LayoutDashboard, Eye, Users, TrendingUp, Settings, HelpCircle, Plus } from 'lucide-react';
import { cn } from '../lib/utils';
import { Button } from '../components/ui';

interface LayoutProps {
  children: React.ReactNode;
  onNewObservation: () => void;
}

export function DesktopLayout({ children, onNewObservation }: LayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#F5F2ED] font-sans antialiased text-[#4A4A3F]">
      {/* Sidebar - Desktop Only */}
      <aside className="hidden md:flex w-64 flex-col border-r border-[#D5DDC6] bg-[#F5F2ED]">
        <div className="p-6 pb-2 shrink-0">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 bg-[#6B705C] text-white rounded-full flex items-center justify-center font-bold font-serif italic">
               B
            </div>
            <div>
              <h1 className="font-bold text-sm text-[#3A3D32] leading-tight font-serif italic">Clarence W. Bailey<br/>Elementary &<br/>Bramlette STEAM<br/>Academy</h1>
              <p className="text-[#A5A58D] text-[10px] uppercase tracking-wider mt-1 font-semibold">Admin Portal</p>
            </div>
          </div>
          
          <Button onClick={onNewObservation} className="w-full justify-start gap-2 mb-8 bg-[#6B705C] hover:bg-[#5A5E4D] text-[#F5F2ED] rounded-full">
            <Plus className="w-5 h-5" />
            New Observation
          </Button>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" />
          <NavItem icon={<Eye size={20} />} label="Observations" active />
          <NavItem icon={<Users size={20} />} label="Teachers" />
          <NavItem icon={<TrendingUp size={20} />} label="Growth Reports" />
          <NavItem icon={<Settings size={20} />} label="Settings" />
        </nav>

        <div className="p-4 shrink-0">
          <NavItem icon={<HelpCircle size={20} />} label="Help Center" className="hover:bg-transparent hover:text-[#001d3d]" />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden flex flex-col relative w-full">
        {children}
      </main>
    </div>
  );
}

function NavItem({ icon, label, active, className }: { icon: React.ReactNode, label: string, active?: boolean, className?: string }) {
  return (
    <button
      className={cn(
        "flex w-full items-center gap-3 px-4 py-3 rounded-full text-[11px] uppercase tracking-wider font-semibold transition-colors duration-200",
        active 
          ? "bg-[#6B705C] text-[#F5F2ED] shadow-sm" // Slightly lighter navy for active state vs main button
          : "text-[#7A7D72] hover:bg-[#D5DDC6] hover:text-[#3A3D32]",
        className
      )}
    >
      {icon}
      {label}
    </button>
  );
}
