import React, { useState, useEffect } from 'react';
import { X, MoreVertical, Check, Plus, Save } from 'lucide-react';
import { ObservationData, PerformanceLevel, RubricCriteria, Teacher } from '../types';
import { cn } from '../lib/utils';
import { Button } from '../components/ui';
import { useDatabase } from '../context/DatabaseContext';

const standardRubric: RubricCriteria[] = [
  {
    id: '3a',
    domain: 'Domain 3: Instruction',
    title: '3a: Communicating with Students',
    description: 'Expectations for learning, directions and procedures, explanations of content, use of oral and written language.',
    level: 'Unrated'
  },
  {
    id: '3b',
    domain: 'Domain 3: Instruction',
    title: '3b: Using Questioning and Discussion Techniques',
    description: 'Quality of questions, discussion techniques, student participation.',
    level: 'Unrated'
  },
  {
    id: '3c',
    domain: 'Domain 3: Instruction',
    title: '3c: Engaging Students in Learning',
    description: 'Activities and assignments, grouping of students, instructional materials and resources, structure and pacing.',
    level: 'Unrated'
  }
];

interface Props {
  teacherId: string;
  onClose: () => void;
}

export function ActiveObservationView({ teacherId, onClose }: Props) {
  const { teachers, addObservation } = useDatabase();
  const teacher = teachers.find(t => t.id === teacherId);
  const [activeTab, setActiveTab] = useState<'evidence' | 'rubric'>('evidence');
  
  const [evidenceLog, setEvidenceLog] = useState<{time: string, text: string}[]>([]);
  const [currentEvidence, setCurrentEvidence] = useState('');

  const [rubricRatings, setRubricRatings] = useState<Record<string, PerformanceLevel>>({});
  const [saving, setSaving] = useState(false);

  // Time tracking
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAddEvidence = (e: React.FormEvent) => {
    e.preventDefault();
    if(!currentEvidence.trim()) return;
    const now = new Date();
    setEvidenceLog(prev => [{ time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), text: currentEvidence }, ...prev]);
    setCurrentEvidence('');
  }

  const handleRatingSelect = (itemId: string, level: PerformanceLevel) => {
    setRubricRatings(prev => ({ ...prev, [itemId]: level }));
  };

  const handleSave = async () => {
    if(!teacher) return;
    setSaving(true);
    try {
       const rubricData = standardRubric.map(r => ({
          ...r,
          level: rubricRatings[r.id] || 'Unrated',
       }));

       // Simple calc for overall rating based on rubric
       const ratingCounts = rubricData.reduce((acc, curr) => {
          acc[curr.level] = (acc[curr.level] || 0) + 1;
          return acc;
       }, {} as Record<string, number>);
       
       let overall = 'Unrated';
       if(ratingCounts['Highly Effective'] && ratingCounts['Highly Effective'] > 0) overall = 'Highly Effective';
       else if(ratingCounts['Effective'] && ratingCounts['Effective'] > 0) overall = 'Effective';
       else if(ratingCounts['Developing'] && ratingCounts['Developing'] > 0) overall = 'Developing';
       else if(ratingCounts['Ineffective'] && ratingCounts['Ineffective'] > 0) overall = 'Ineffective';

       await addObservation({
         teacherId: teacher.id,
         teacherName: teacher.name,
         subject: teacher.subject,
         school: teacher.school,
         date: new Date().toLocaleDateString(),
         time: new Date().toLocaleTimeString(),
         overallRating: overall,
         commendations: [],
         refinements: [],
         rubric: rubricData,
         evidenceLog: evidenceLog,
       });
       onClose();
    } catch(err) {
       console.error(err);
       alert("Error saving observation");
    }
    setSaving(false);
  };

  if(!teacher) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#ffffff] flex flex-col md:relative md:h-full md:w-full md:z-auto max-w-lg mx-auto md:max-w-none md:border-l md:border-[#e7eeff]">
      {/* Header */}
      <div className="bg-[#f9f9ff] px-4 pt-4 pb-0 flex flex-col border-b border-[#e7eeff] shadow-sm relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={onClose} className="p-2 -ml-2 rounded hover:bg-[#e7eeff] text-[#111c2d]">
            <X className="w-6 h-6" />
          </button>
          <div className="text-xl font-bold text-[#111c2d]">
            Classroom Observation
          </div>
          <div className="flex-1" />
          <button className="p-2 -mr-2 rounded hover:bg-[#e7eeff] text-[#111c2d]">
            <MoreVertical className="w-6 h-6" />
          </button>
        </div>
        
        <div className="text-lg font-bold text-[#111c2d] mb-1">
          {teacher.name}
        </div>
        <div className="text-sm text-[#737780] mb-4">
          {teacher.subject} &bull; {teacher.school}
        </div>

        <div className="flex justify-between items-center mb-4">
          <div className="bg-[#f0f3ff] text-[#003262] px-3 py-1 rounded text-xs font-bold tracking-widest uppercase">
            Domain 3
          </div>
          <div className="text-[#003262] text-xs font-bold tracking-widest uppercase flex items-center gap-1 bg-[#f0f3ff] px-3 py-1 rounded">
            <span className="text-[#003262]">⏱</span> {Math.floor(elapsed / 60).toString().padStart(2, '0')}:{(elapsed % 60).toString().padStart(2, '0')}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex">
          <button 
            className={cn("flex-1 pb-3 text-sm font-semibold uppercase tracking-wider transition-colors border-b-2", activeTab === 'evidence' ? "text-[#003262] border-[#003262]" : "text-[#737780] border-transparent")}
            onClick={() => setActiveTab('evidence')}
          >
            Evidence Log ({evidenceLog.length})
          </button>
          <button 
            className={cn("flex-1 pb-3 text-sm font-semibold uppercase tracking-wider transition-colors border-b-2", activeTab === 'rubric' ? "text-[#003262] border-[#003262]" : "text-[#737780] border-transparent")}
            onClick={() => setActiveTab('rubric')}
          >
            Rubric
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto bg-[#ffffff] flex flex-col">
        {activeTab === 'evidence' ? (
          <div className="flex-1 flex flex-col">
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
                {evidenceLog.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center text-sm text-[#737780] italic">
                        No evidence logged yet. Type below to begin.
                    </div>
                ) : evidenceLog.map((log, idx) => (
                    <div key={idx} className="bg-[#f9f9ff] border text-sm border-[#e7eeff] rounded p-4 flex gap-4 shadow-sm items-start">
                        <div className="bg-[#003262] text-white font-mono font-bold px-2 py-1 rounded text-[10px] shrink-0 mt-0.5">
                        {log.time}
                        </div>
                        <p className="text-[#111c2d] flex-1 leading-relaxed">
                        {log.text}
                        </p>
                    </div>
                ))}
            </div>
            <div className="p-4 border-t border-[#e7eeff] bg-[#ffffff]">
                <form onSubmit={handleAddEvidence} className="flex gap-2">
                    <input 
                        type="text" 
                        title="Evidence"
                        placeholder="Type evidence here..." 
                        className="flex-1 p-4 rounded border border-[#e7eeff] bg-[#f9f9ff] outline-none focus:border-[#003262] focus:ring-1 focus:ring-[#003262] text-sm"
                        value={currentEvidence}
                        onChange={e => setCurrentEvidence(e.target.value)}
                    />
                    <Button type="submit" variant="primary" size="icon" className="shrink-0 h-auto px-6">
                        <Plus className="w-5 h-5 text-white" />
                    </Button>
                </form>
            </div>
          </div>
        ) : (
          <div className="p-4 flex flex-col gap-4">
            {standardRubric.map((item) => (
              <div key={item.id} className="bg-[#ffffff] text-[#111c2d] border border-[#e7eeff] rounded overflow-hidden shadow-sm">
                <div className="p-6">
                  <h3 className="text-lg font-bold mb-2 text-[#111c2d]">{item.title}</h3>
                  <p className="text-sm text-[#737780] leading-snug">{item.description}</p>
                </div>
                <div className="bg-[#f9f9ff] p-6 border-t border-[#e7eeff]">
                  <div className="text-[10px] font-bold text-[#737780] uppercase tracking-widest mb-4">Select Level</div>
                  <div className="grid grid-cols-2 gap-3">
                    <RatingButton 
                      level="Ineffective" 
                      selected={rubricRatings[item.id] === 'Ineffective'} 
                      onClick={() => handleRatingSelect(item.id, 'Ineffective')} 
                    />
                    <RatingButton 
                      level="Developing" 
                      selected={rubricRatings[item.id] === 'Developing'} 
                      onClick={() => handleRatingSelect(item.id, 'Developing')} 
                    />
                    <RatingButton 
                      level="Effective" 
                      selected={rubricRatings[item.id] === 'Effective'} 
                      onClick={() => handleRatingSelect(item.id, 'Effective')} 
                    />
                    <RatingButton 
                      level="Highly Effective" 
                      selected={rubricRatings[item.id] === 'Highly Effective'} 
                      onClick={() => handleRatingSelect(item.id, 'Highly Effective')} 
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 bg-white border-t border-[#e7eeff]">
        <Button variant="primary" size="lg" disabled={saving} className="w-full flex items-center justify-center gap-2 text-sm rounded bg-[#003262] text-white h-14" onClick={handleSave}>
          <Save className="w-5 h-5" />
          {saving ? 'Saving...' : 'End & Save Session'}
        </Button>
      </div>
    </div>
  );
}

function RatingButton({ level, selected, onClick }: { level: PerformanceLevel | string, selected: boolean, onClick: () => void }) {
  
  let styles = "relative overflow-hidden text-[10px] md:text-[11px] uppercase tracking-widest font-bold rounded min-h-[56px] flex items-center justify-center border transition-all duration-200 p-2 text-center leading-tight shadow-sm";
  
  if (level === 'Ineffective') {
    styles = cn(styles, selected ? "bg-[#ba1a1a] text-white border-[#ba1a1a]" : "bg-white text-[#ba1a1a] border-[#e7eeff] hover:border-[#ba1a1a] hover:bg-[#fff0f0]");
  } else if (level === 'Developing') {
    styles = cn(styles, selected ? "bg-[#8d4f00] text-white border-[#8d4f00]" : "bg-white text-[#8d4f00] border-[#e7eeff] hover:border-[#8d4f00] hover:bg-[#fff8f0]"); 
  } else if (level === 'Effective') {
    styles = cn(styles, selected ? "bg-[#386a20] text-white border-[#386a20]" : "bg-white text-[#386a20] border-[#e7eeff] hover:border-[#386a20] hover:bg-[#f3faf0]");
  } else if (level === 'Highly Effective') {
    styles = cn(styles, selected ? "bg-[#006782] text-white border-[#006782]" : "bg-white text-[#006782] border-[#e7eeff] hover:border-[#006782] hover:bg-[#f0f9ff]"); 
  }

  return (
    <button className={styles} onClick={onClick}>
      {selected ? (
        <span className="flex items-center gap-1.5"><Check className="w-4 h-4" strokeWidth={3} /> {level}</span>
      ) : (
        level
      )}
    </button>
  );
}
