import React, { useState } from 'react';
import { DatabaseProvider, useDatabase } from './context/DatabaseContext';
import { DesktopLayout } from './components/Layout';
import { SummaryView } from './views/SummaryView';
import { ActiveObservationView } from './views/ActiveObservationView';
import { NewObservationView } from './views/NewObservationView';
import { Eye, Edit3, PieChart, Sparkles, LogOut, Key } from 'lucide-react';
import { cn } from './lib/utils';
import { Button } from './components/ui';

function AppContent() {
  const { user, login, logoutUser, teachers, observations, loading } = useDatabase();
  const [activeTeacherObsId, setActiveTeacherObsId] = useState<string | null>(null);
  const [isSettingUp, setIsSettingUp] = useState(false);
  const [mobileTab, setMobileTab] = useState<'observe' | 'log' | 'analytics' | 'coaching'>('coaching');

  if(loading) {
     return <div className="h-screen w-screen bg-[#F5F2ED] flex items-center justify-center font-serif italic text-lg text-[#3A3D32]">Loading details...</div>
  }

  if (!user) {
    return (
      <div className="h-screen w-screen bg-[#F5F2ED] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#FAF9F6] p-8 rounded-[24px] border border-[#D5DDC6] text-center shadow-lg">
          <h1 className="font-serif italic text-3xl text-[#3A3D32] mb-4">Admin Portal</h1>
          <p className="text-sm text-[#7A7D72] mb-8">Please log in to manage classroom observations and coaching plans securely.</p>
          <Button variant="primary" className="w-full" onClick={login}>
            <Key className="w-4 h-4 mr-2" /> Log In with Google
          </Button>
        </div>
      </div>
    );
  }

  const latestObservation = observations.length > 0 ? observations[observations.length - 1] : null;

  // Mobile Bottom Nav
  const BottomNav = () => (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#F5F2ED] border-t border-[#D5DDC6] flex justify-around px-2 py-2 pb-6 z-40">
      <NavButton icon={<Eye size={24} />} label="Observe" active={mobileTab === 'observe'} onClick={() => setMobileTab('observe')} />
      <NavButton icon={<Edit3 size={24} />} label="Log" active={mobileTab === 'log'} onClick={() => setMobileTab('log')} />
      <NavButton icon={<PieChart size={24} />} label="Analytics" active={mobileTab === 'analytics'} onClick={() => setMobileTab('analytics')} />
      <NavButton icon={<Sparkles size={24} />} label="Coaching" active={mobileTab === 'coaching'} onClick={() => setMobileTab('coaching')} />
    </div>
  );

  const NavButton = ({ icon, label, active, onClick }: any) => (
    <button onClick={onClick} className={cn("flex flex-col items-center gap-1 p-2 rounded-2xl w-20 transition-colors", active ? "bg-[#D5DDC6] text-[#3A3D32]" : "text-[#A5A58D] hover:text-[#7A7D72]")}>
      {icon}
      <span className="text-[10px] font-semibold">{label}</span>
    </button>
  );

  const renderContent = () => {
     if(activeTeacherObsId) {
        return <ActiveObservationView teacherId={activeTeacherObsId} onClose={() => { setActiveTeacherObsId(null); setIsSettingUp(false); }} />
     }
     if(isSettingUp) {
        return <NewObservationView onStart={(tid) => setActiveTeacherObsId(tid)} onCancel={() => setIsSettingUp(false)} />
     }
     if(latestObservation) {
        return <SummaryView data={latestObservation} />
     }
     return (
        <div className="flex-1 flex flex-col items-center justify-center bg-[#F5F2ED] p-8 text-center text-[#7A7D72]">
           <div className="w-16 h-16 bg-[#D5DDC6] rounded-full flex items-center justify-center mb-4">
             <Eye className="w-8 h-8 text-[#6B705C]" />
           </div>
           <h2 className="text-xl font-serif italic text-[#3A3D32] mb-2">No observations yet</h2>
           <p className="max-w-xs mb-6 mx-auto text-sm">Start a new observation or add a teacher to begin logging evidence.</p>
           <Button variant="primary" onClick={() => setIsSettingUp(true)}>New Observation</Button>
        </div>
     );
  }

  return (
    <>
      <div className="hidden md:block h-screen w-screen">
         <DesktopLayout onNewObservation={() => setIsSettingUp(true)}>
            {renderContent()}
         </DesktopLayout>
      </div>

      <div className="block md:hidden h-screen w-screen bg-[#F5F2ED] overflow-y-auto pb-24 relative">
        {activeTeacherObsId || mobileTab === 'observe' ? (
          activeTeacherObsId ? (
            <ActiveObservationView teacherId={activeTeacherObsId} onClose={() => { setActiveTeacherObsId(null); setMobileTab('coaching'); }} />
          ) : (
            <NewObservationView onStart={(tid) => setActiveTeacherObsId(tid)} onCancel={() => setMobileTab('coaching')} />
          )
        ) : (
          <>
             {latestObservation ? (
               <>
                 <div className="bg-[#F5F2ED] p-4 flex flex-col pt-8">
                   <h1 className="text-2xl font-bold text-[#3A3D32] mb-1 font-serif italic">Coaching: {latestObservation.teacherName}</h1>
                   <p className="text-sm text-[#7A7D72] uppercase tracking-wide">Post-observation synthesis & planning</p>
                 </div>
                 
                 <SummaryView data={latestObservation} />
                 
                 <div className="fixed bottom-[88px] left-0 right-0 p-4 shrink-0 z-40 bg-gradient-to-t from-[#F5F2ED] via-[#F5F2ED] to-transparent pt-12">
                    <Button className="w-full flex items-center gap-2 justify-center py-6 shadow-xl rounded-full bg-[#3A3D32]">
                      Generate Coaching Action Plan
                    </Button>
                 </div>
               </>
             ) : (
               <div className="flex flex-col items-center justify-center p-8 text-center pt-24">
                  <h2 className="text-xl font-serif italic text-[#3A3D32] mb-2">No observations</h2>
                  <Button variant="primary" onClick={() => setActiveTeacherObsId('new')}>Start One</Button>
               </div>
             )}
             <BottomNav />
          </>
        )}
      </div>
    </>
  );
}

export default function App() {
  return (
    <DatabaseProvider>
      <AppContent />
    </DatabaseProvider>
  )
}
