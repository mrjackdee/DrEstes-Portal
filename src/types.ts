export type PerformanceLevel = 
  | 'Ineffective' 
  | 'Developing' 
  | 'Effective' 
  | 'Highly Effective'
  | 'Unrated';

export interface RubricCriteria {
  id: string;
  domain: string;
  title: string;
  description: string;
  level: PerformanceLevel;
  evidence?: string;
}

export interface Teacher {
  id: string;
  adminId: string;
  name: string;
  subject: string;
  school: string;
  createdAt: number;
}

export interface ObservationData {
  id: string;
  adminId: string;
  teacherId: string;
  teacherName: string;
  subject: string;
  date: string;
  time: string;
  school: string;
  overallRating: PerformanceLevel | string;
  trendData: { date: string; score: number }[];
  commendations: { text: string; domain?: string }[];
  refinements: string[];
  rubric: RubricCriteria[];
  evidenceLog: { time: string; text: string }[];
  createdAt: number;
}
