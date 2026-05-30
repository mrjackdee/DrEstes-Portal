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
    <div className="flex-1 overflow-auto bg-[#F5F2ED] p-4 lg:p-8 flex items-center justify-center">
       <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle className="text-xl normal-case font-serif tracking-normal text-[#3A3D32]">Setup New Observation</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
             <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-widest font-bold text-[#A5A58D]">Select Teacher</label>
                {teachers.length > 0 ? (
                  <select 
                    title="Teacher"
                    className="p-3 rounded-xl border border-[#D5DDC6] bg-[#FAF9F6] text-[#3A3D32] focus:outline-none focus:border-[#6B705C]"
                    value={selectedTeacherId}
                    onChange={(e) => setSelectedTeacherId(e.target.value)}
                  >
                    <option value="" disabled>-- Choose a teacher --</option>
                    {teachers.map(t => (
                      <option key={t.id} value={t.id}>{t.name} ({t.subject})</option>
                    ))}
                  </select>
                ) : (
                  <p className="text-sm text-[#7A7D72]">No teachers found. Add one below.</p>
                )}
             </div>

             {!showNewTeacher ? (
               <Button variant="outline" className="w-full gap-2 border-dashed" onClick={() => setShowNewTeacher(true)}>
                 <Plus className="w-4 h-4" /> Add New Teacher
               </Button>
             ) : (
               <div className="bg-[#E3D5CA] p-4 rounded-2xl flex flex-col gap-4">
                  <h4 className="text-xs uppercase tracking-widest font-bold text-[#4A4A3F]">New Teacher Details</h4>
                  <input placeholder="Name" className="p-3 rounded-xl border-none outline-none" value={tName} onChange={e => setTName(e.target.value)} />
                  <input placeholder="Subject/Grade" className="p-3 rounded-xl border-none outline-none" value={tSubject} onChange={e => setTSubject(e.target.value)} />
                  <input placeholder="School" className="p-3 rounded-xl border-none outline-none" value={tSchool} onChange={e => setTSchool(e.target.value)} />
                  <div className="flex gap-2">
                    <Button variant="primary" className="flex-1" onClick={handleAddTeacher} disabled={loading}>{loading ? 'Saving...' : 'Save Teacher'}</Button>
                    <Button variant="ghost" onClick={() => setShowNewTeacher(false)}>Cancel</Button>
                  </div>
               </div>
             )}

             <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-[#D5DDC6]">
               <Button variant="ghost" onClick={onCancel}>Cancel</Button>
               <Button variant="primary" className="gap-2 bg-[#3A3D32]" onClick={handleStart} disabled={!selectedTeacherId}>
                  Start Session <Play className="w-4 h-4" fill="currentColor" />
               </Button>
             </div>
          </CardContent>
       </Card>
    </div>
  )
}
