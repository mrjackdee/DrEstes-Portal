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
    <div className="fixed inset-0 z-50 bg-[#F5F2ED] flex flex-col md:relative md:h-full md:w-full md:z-auto max-w-lg mx-auto md:max-w-none md:border-l md:border-[#D5DDC6]">
      {/* Header */}
      <div className="bg-[#F5F2ED] px-4 pt-4 pb-0 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <button onClick={onClose} className="p-2 -ml-2 rounded-full hover:bg-[#D5DDC6] text-[#3A3D32]">
            <X className="w-6 h-6" />
          </button>
          <div className="text-center font-serif italic text-xl text-[#3A3D32]">
            Classroom Observation
          </div>
          <button className="p-2 -mr-2 rounded-full hover:bg-[#D5DDC6] text-[#3A3D32]">
            <MoreVertical className="w-6 h-6" />
          </button>
        </div>
        
        <div className="text-sm font-medium text-[#3A3D32] mb-1 font-serif">
          Teacher: {teacher.name}
        </div>
        <div className="text-sm text-[#7A7D72] mb-4 leading-snug">
          {teacher.subject} | {teacher.school}
        </div>

        <div className="flex justify-between mb-4">
          <div className="bg-[#D5DDC6] text-[#3A3D32] px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase">
            Domain 3
          </div>
          <div className="text-[#3A3D32] text-xs font-bold tracking-widest uppercase flex items-center gap-1 bg-[#E3D5CA] px-3 py-1 rounded-full">
            <span className="text-[#A5A58D]">⏱</span> {Math.floor(elapsed / 60).toString().padStart(2, '0')}:{(elapsed % 60).toString().padStart(2, '0')}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#D5DDC6]">
          <button 
            className={cn("flex-1 pb-3 text-xs font-bold uppercase tracking-wider transition-colors", activeTab === 'evidence' ? "text-[#3A3D32] border-b-2 border-[#6B705C]" : "text-[#A5A58D]")}
            onClick={() => setActiveTab('evidence')}
          >
            Evidence Log ({evidenceLog.length})
          </button>
          <button 
            className={cn("flex-1 pb-3 text-xs font-bold uppercase tracking-wider transition-colors", activeTab === 'rubric' ? "text-[#3A3D32] border-b-2 border-[#6B705C]" : "text-[#A5A58D]")}
            onClick={() => setActiveTab('rubric')}
          >
            Rubric
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto bg-white flex flex-col">
        {activeTab === 'evidence' ? (
          <div className="flex-1 flex flex-col">
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
                {evidenceLog.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center text-sm text-[#A5A58D] italic font-serif">
                        No evidence logged yet. Type below to begin.
                    </div>
                ) : evidenceLog.map((log, idx) => (
                    <div key={idx} className="bg-[#FAF9F6] border text-sm border-[#D5DDC6] rounded-[24px] p-6 flex gap-4 shadow-sm items-start">
                        <div className="bg-[#D5DDC6] text-[#3A3D32] font-mono font-bold px-2 py-1 rounded-full text-[10px] shrink-0 mt-0.5">
                        {log.time}
                        </div>
                        <p className="text-[#3A3D32] flex-1 leading-relaxed">
                        {log.text}
                        </p>
                    </div>
                ))}
            </div>
            <div className="p-4 border-t border-[#D5DDC6] bg-[#F5F2ED]">
                <form onSubmit={handleAddEvidence} className="flex gap-2">
                    <input 
                        type="text" 
                        title="Evidence"
                        placeholder="Type evidence here..." 
                        className="flex-1 p-4 rounded-full border border-[#D5DDC6] bg-white outline-none focus:border-[#6B705C] text-sm"
                        value={currentEvidence}
                        onChange={e => setCurrentEvidence(e.target.value)}
                    />
                    <Button type="submit" variant="primary" size="icon" className="rounded-full shrink-0">
                        <Plus className="w-5 h-5 text-white" />
                    </Button>
                </form>
            </div>
          </div>
        ) : (
          <div className="p-4 flex flex-col gap-4">
            {standardRubric.map((item) => (
              <div key={item.id} className="bg-[#FAF9F6] text-[#3A3D32] border border-[#D5DDC6] rounded-[24px] overflow-hidden shadow-sm">
                <div className="p-8">
                  <h3 className="text-lg font-serif italic mb-2 text-[#3A3D32]">{item.title}</h3>
                  <p className="text-sm text-[#7A7D72] leading-snug">{item.description}</p>
                </div>
                <div className="bg-white p-8 border-t border-[#D5DDC6]">
                  <div className="text-[10px] font-bold text-[#A5A58D] uppercase tracking-widest mb-4">Select Level</div>
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
      <div className="p-6 bg-white border-t border-[#D5DDC6]">
        <Button variant="primary" size="lg" disabled={saving} className="w-full flex items-center justify-center gap-2 text-sm rounded-full tracking-widest bg-[#3A3D32] text-white" onClick={handleSave}>
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'End & Save Session'}
        </Button>
      </div>
    </div>
  );
}

function RatingButton({ level, selected, onClick }: { level: PerformanceLevel | string, selected: boolean, onClick: () => void }) {
  
  let styles = "relative overflow-hidden text-[10px] uppercase tracking-widest font-bold rounded-xl min-h-[48px] flex items-center justify-center border transition-all duration-200 p-2 text-center leading-tight";
  
  if (level === 'Ineffective') {
    styles = cn(styles, selected ? "bg-[#3A3D32] text-white border-[#3A3D32]" : "bg-white text-[#3A3D32] border-[#D5DDC6] hover:border-[#3A3D32]");
  } else if (level === 'Developing') {
    styles = cn(styles, selected ? "bg-[#A5A58D] text-white border-[#A5A58D]" : "bg-white text-[#A5A58D] border-[#D5DDC6] hover:border-[#A5A58D]"); 
  } else if (level === 'Effective') {
    styles = cn(styles, selected ? "bg-[#6B705C] text-white border-2 border-[#6B705C]" : "bg-white text-[#6B705C] border-[#D5DDC6] hover:border-[#6B705C]");
  } else if (level === 'Highly Effective') {
    styles = cn(styles, selected ? "bg-[#B7B7A4] text-white border-[#B7B7A4]" : "bg-white text-[#B7B7A4] border-[#D5DDC6] hover:border-[#B7B7A4]"); 
  }

  return (
    <button className={styles} onClick={onClick}>
      {selected && level === 'Effective' ? (
        <span className="flex items-center gap-1.5"><Check className="w-3 h-3" strokeWidth={3} /> {level}</span>
      ) : (
        level
      )}
    </button>
  );
}
