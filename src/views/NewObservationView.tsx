import React, { useState } from 'react';
import { useDatabase } from '../context/DatabaseContext';
import { Button, Card, CardContent, CardHeader, CardTitle } from '../components/ui';
import { Plus, Check, Play } from 'lucide-react';
import { Teacher } from '../types';

interface Props {
  onStart: (teacherId: string) => void;
  onCancel: () => void;
}

export function NewObservationView({ onStart, onCancel }: Props) {
  const { teachers, addTeacher } = useDatabase();
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>('');
  const [showNewTeacher, setShowNewTeacher] = useState(false);
  
  // New teacher form
  const [tName, setTName] = useState('');
  const [tSubject, setTSubject] = useState('');
  const [tSchool, setTSchool] = useState('');

  const [loading, setLoading] = useState(false);

  const handleAddTeacher = async () => {
    if(!tName || !tSubject || !tSchool) return;
    setLoading(true);
    try {
      const id = await addTeacher({
        name: tName,
        subject: tSubject,
        school: tSchool
      });
      setSelectedTeacherId(id);
      setShowNewTeacher(false);
      setTName(''); setTSubject(''); setTSchool('');
    } catch(err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleStart = () => {
    if(selectedTeacherId) {
      onStart(selectedTeacherId);
    }
  }

  return (
    <div className="flex-1 overflow-auto bg-[#f9f9ff] p-4 lg:p-8 flex items-center justify-center">
       <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-[#111c2d] tracking-tight normal-case">Setup New Observation</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
             <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-widest font-bold text-[#737780]">Select Teacher</label>
                {teachers.length > 0 ? (
                  <select 
                    title="Teacher"
                    className="p-3 rounded border border-[#e7eeff] bg-[#f9f9ff] text-[#111c2d] focus:outline-none focus:border-[#003262] focus:ring-1 focus:ring-[#003262]"
                    value={selectedTeacherId}
                    onChange={(e) => setSelectedTeacherId(e.target.value)}
                  >
                    <option value="" disabled>-- Choose a teacher --</option>
                    {teachers.map(t => (
                      <option key={t.id} value={t.id}>{t.name} ({t.subject})</option>
                    ))}
                  </select>
                ) : (
                  <p className="text-sm text-[#737780]">No teachers found. Add one below.</p>
                )}
             </div>

             {!showNewTeacher ? (
               <Button variant="outline" className="w-full gap-2 border-dashed border-[#737780]" onClick={() => setShowNewTeacher(true)}>
                 <Plus className="w-4 h-4" /> Add New Teacher
               </Button>
             ) : (
               <div className="bg-[#f0f3ff] p-4 rounded flex flex-col gap-4 border border-[#e7eeff]">
                  <h4 className="text-xs uppercase tracking-widest font-bold text-[#003262]">New Teacher Details</h4>
                  <input placeholder="Name" className="p-3 rounded border border-[#e7eeff] outline-none focus:border-[#003262]" value={tName} onChange={e => setTName(e.target.value)} />
                  <input placeholder="Subject/Grade" className="p-3 rounded border border-[#e7eeff] outline-none focus:border-[#003262]" value={tSubject} onChange={e => setTSubject(e.target.value)} />
                  <input placeholder="School" className="p-3 rounded border border-[#e7eeff] outline-none focus:border-[#003262]" value={tSchool} onChange={e => setTSchool(e.target.value)} />
                  <div className="flex gap-2">
                    <Button variant="primary" className="flex-1" onClick={handleAddTeacher} disabled={loading}>{loading ? 'Saving...' : 'Save Teacher'}</Button>
                    <Button variant="ghost" onClick={() => setShowNewTeacher(false)}>Cancel</Button>
                  </div>
               </div>
             )}

             <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-[#e7eeff]">
               <Button variant="ghost" onClick={onCancel}>Cancel</Button>
               <Button variant="primary" className="gap-2 bg-[#003262]" onClick={handleStart} disabled={!selectedTeacherId}>
                  Start Session <Play className="w-4 h-4" fill="currentColor" />
               </Button>
             </div>
          </CardContent>
       </Card>
    </div>
  )
}
