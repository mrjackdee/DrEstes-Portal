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
  const { user, login, logoutUser, teachers, observations, loading, loginAsGuest } = useDatabase();
  const [activeTeacherObsId, setActiveTeacherObsId] = useState<string | null>(null);
  const [isSettingUp, setIsSettingUp] = useState(false);
  const [mobileTab, setMobileTab] = useState<'observe' | 'log' | 'analytics' | 'coaching'>('coaching');

  if(loading) {
     return <div className="h-screen w-screen bg-[#f9f9ff] flex items-center justify-center text-lg text-[#111c2d]">Loading details...</div>
  }

  if (!user) {
    return (
      <div className="h-screen w-screen bg-[#f9f9ff] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded border border-[#e7eeff] text-center shadow-lg">
          <h1 className="font-bold text-3xl text-[#111c2d] mb-4">Admin Portal</h1>
          <p className="text-sm text-[#737780] mb-8">Test the full experience safely without logging in, or use Google to save data securely over time.</p>
          <div className="flex flex-col gap-3">
             <Button variant="secondary" className="w-full bg-[#f0f3ff] text-[#003262] hover:bg-[#e7eeff]" onClick={loginAsGuest}>
               Continue as Guest (Test Mode)
             </Button>
             <Button variant="primary" className="w-full" onClick={login}>
               <Key className="w-4 h-4 mr-2" /> Log In with Google
             </Button>
          </div>
        </div>
      </div>
    );
  }

  const latestObservation = observations.length > 0 ? observations[observations.length - 1] : null;

  // Mobile Bottom Nav
  const BottomNav = () => (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#ffffff] border-t border-[#e7eeff] flex justify-around px-2 py-2 pb-6 z-40">
      <NavButton icon={<Eye size={24} />} label="Observe" active={mobileTab === 'observe'} onClick={() => setMobileTab('observe')} />
      <NavButton icon={<Edit3 size={24} />} label="Log" active={mobileTab === 'log'} onClick={() => setMobileTab('log')} />
      <NavButton icon={<PieChart size={24} />} label="Analytics" active={mobileTab === 'analytics'} onClick={() => setMobileTab('analytics')} />
      <NavButton icon={<Sparkles size={24} />} label="Coaching" active={mobileTab === 'coaching'} onClick={() => setMobileTab('coaching')} />
    </div>
  );

  const NavButton = ({ icon, label, active, onClick }: any) => (
    <button onClick={onClick} className={cn("flex flex-col items-center gap-1 p-2 rounded w-20 transition-colors", active ? "bg-[#f0f3ff] text-[#003262]" : "text-[#737780] hover:text-[#111c2d]")}>
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
        <div className="flex-1 flex flex-col items-center justify-center bg-[#f9f9ff] p-8 text-center text-[#737780]">
           <div className="w-16 h-16 bg-[#e7eeff] rounded-full flex items-center justify-center mb-4">
             <Eye className="w-8 h-8 text-[#003262]" />
           </div>
           <h2 className="text-xl font-bold text-[#111c2d] mb-2">No observations yet</h2>
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

      <div className="block md:hidden h-screen w-screen bg-[#f9f9ff] overflow-y-auto pb-24 relative">
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
                 <div className="bg-[#ffffff] border-b border-[#e7eeff] p-4 flex flex-col pt-8">
                   <h1 className="text-2xl font-bold text-[#111c2d] mb-1">Coaching: {latestObservation.teacherName}</h1>
                   <p className="text-sm text-[#737780] uppercase tracking-wide">Post-observation synthesis & planning</p>
                 </div>
                 
                 <SummaryView data={latestObservation} />
                 
                 <div className="fixed bottom-[88px] left-0 right-0 p-4 shrink-0 z-40 bg-gradient-to-t from-[#f9f9ff] via-[#f9f9ff] to-transparent pt-12">
                    <Button className="w-full flex items-center gap-2 justify-center py-6 shadow-xl rounded bg-[#003262] text-white">
                      Generate Coaching Action Plan
                    </Button>
                 </div>
               </>
             ) : (
               <div className="flex flex-col items-center justify-center p-8 text-center pt-24">
                  <h2 className="text-xl font-bold text-[#111c2d] mb-2">No observations</h2>
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

const GlobalOverlays = () => (
  <>
    <div className="fixed inset-0 pointer-events-none z-[9999] flex items-center justify-center overflow-hidden">
      <span className="text-[150px] md:text-[250px] font-black text-[#111c2d] opacity-[0.04] transform -rotate-45 select-none tracking-widest leading-none">
        DRAFT
      </span>
    </div>
    <div className="fixed bottom-[84px] md:bottom-4 right-2 md:right-4 z-[10000] text-[10px] md:text-xs text-[#737780] bg-white/90 backdrop-blur px-3 py-1.5 rounded pointer-events-auto border border-[#e7eeff] shadow-sm">
      &copy; 2026 Digital Presence by <a href="http://www.DonOraGlobal.com/" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#003262] font-semibold transition-colors">DonOra Global</a>
    </div>
  </>
);

export default function App() {
  return (
    <DatabaseProvider>
      <GlobalOverlays />
      <AppContent />
    </DatabaseProvider>
  )
}
