import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ThumbsUp, Wrench, Sparkles, TrendingUp } from 'lucide-react';
import { ObservationData } from '../types';
import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from '../components/ui';
import { cn } from '../lib/utils';

interface Props {
  data: ObservationData;
}

export function SummaryView({ data }: Props) {
  return (
    <div className="flex-1 overflow-auto bg-[#f9f9ff] p-4 lg:p-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row lg:items-start justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#111c2d] mb-2 tracking-tight">Observation Summary: {data.teacherName.split(' ')[0]}</h1>
          <div className="flex flex-wrap items-center text-sm text-[#737780] gap-x-6 gap-y-2 font-medium uppercase tracking-wider text-xs">
            <span className="flex items-center gap-2">
              <span className="w-6 h-6 rounded bg-[#003262] text-white flex items-center justify-center text-[10px]">10</span>
              {data.subject}
            </span>
            <span className="flex items-center gap-2">
              <span className="text-[#737780]">📅</span> {data.date}
            </span>
            <span className="flex items-center gap-2">
              <span className="text-[#737780]">⏱</span> {data.time}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-xs font-semibold text-[#737780] tracking-wider uppercase">Overall Rating</span>
          <div className="bg-[#003262] text-white px-6 py-2 rounded font-semibold uppercase tracking-widest text-xs flex items-center gap-2 shadow-sm">
            <span className="text-lg">★</span> {data.overallRating}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Growth Trend Chart */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#003262]" />
                <CardTitle>Growth Trend</CardTitle>
              </div>
              <Badge variant="default" className="bg-[#f0f3ff] text-[#003262]">Last 5 Observations</Badge>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e7eeff" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#737780' }} dy={10} />
                    <YAxis domain={[1, 4]} ticks={[1, 2, 3, 4]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#737780' }} />
                    <Tooltip cursor={{ stroke: '#e7eeff', strokeWidth: 1 }} />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      stroke="#003262" 
                      strokeWidth={3} 
                      dot={{ r: 6, fill: '#ffffff', stroke: '#003262', strokeWidth: 2 }} 
                      activeDot={{ r: 8, fill: '#003262' }}
                      strokeDasharray="4 4" // Simulate the dashed line in mockup
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Evidence & Rubric Analysis */}
          <Card>
            <CardHeader>
               <div className="flex items-center gap-2">
                <span className="font-mono text-[#003262] font-bold text-lg">=x</span>
                <CardTitle>Evidence & Rubric Analysis</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="bg-[#f0f3ff] text-[#003262] font-semibold tracking-wider uppercase px-4 py-2 rounded inline-block w-max text-[10px]">
                Domain 3: Instruction
              </div>

              {data.rubric.map((item) => (
                <div key={item.id} className="border border-[#e7eeff] rounded p-6 bg-[#ffffff]">
                  <div className="flex justify-between items-start gap-4 mb-3">
                    <h4 className="font-semibold text-lg text-[#111c2d] leading-tight">{item.title}</h4>
                    <Badge variant={item.level === 'Effective' || item.level === 'Proficient' ? 'proficient' : 'basic'} className="shrink-0 capitalize">
                      {item.level === 'Effective' ? 'Proficient' : item.level === 'Developing' ? 'Basic' : item.level}
                    </Badge>
                  </div>
                  {item.evidence && (
                    <div className="flex gap-3 text-[#737780] text-sm mt-3 bg-[#f9f9ff] p-4 rounded border border-[#e7eeff]">
                      <span className="font-serif text-3xl leading-none text-[#737780]">"</span>
                      <p className="pt-1 leading-relaxed">{item.evidence.replace(/"/g, '')}</p>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-6">
          
          {/* Commendations */}
          <Card className="border-t-4 border-t-[#003262]">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <ThumbsUp className="w-5 h-5 text-[#003262]" />
                <CardTitle>Commendations</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4 mt-2">
                {data.commendations.map((comm, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-[#111c2d] leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#003262] mt-2 shrink-0" />
                    <span>{comm.text}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Refinements */}
          <Card className="border-t-4 border-t-[#ba1a1a]">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Wrench className="w-5 h-5 text-[#ba1a1a]" />
                <CardTitle>Refinements</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4 mt-2">
                {data.refinements.map((ref, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-[#111c2d] leading-relaxed">
                    <span className="w-1.5 h-1.5 bg-[#ba1a1a] mt-2 shrink-0" />
                    <span>{ref}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="bg-[#f0f3ff] border-none shadow-none">
            <CardHeader className="pb-2">
              <CardTitle>Next Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[#111c2d] mb-6">
                Based on the refinements identified, create a focused coaching plan to develop questioning strategies.
              </p>
              <Button className="w-full flex items-center gap-2 justify-center h-12">
                <Sparkles className="w-4 h-4" />
                Generate Coaching Action Plan
              </Button>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
