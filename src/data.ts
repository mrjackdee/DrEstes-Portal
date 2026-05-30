import { ObservationData } from './types';

export const mockObservation: ObservationData = {
  teacherName: 'Sarah Miller',
  subject: '10th Grade Biology',
  school: 'Clarence W. Bailey Elementary & Bramlette STEAM Academy',
  date: 'Oct 24, 2023',
  time: '10:15 AM - 11:00 AM',
  overallRating: 'Proficient', // 'Effective' equivalent in some contexts, but image says "Proficient"
  trendData: [
    { date: 'Sep 12', score: 2.3 },
    { date: 'Sep 28', score: 2.5 },
    { date: 'Oct 10', score: 2.9 },
    { date: 'Oct 18', score: 2.8 },
    { date: 'Oct 24', score: 3.0 },
  ],
  commendations: [
    { text: 'Clear communication of learning objectives aligned to state standards.', domain: 'Domain 1c' },
    { text: 'High level of student engagement during hands-on lab activities.', domain: 'Domain 2b' },
    { text: 'Effective classroom management and smooth transitions between lecture and lab.' },
  ],
  refinements: [
    'Increase use of higher-order, open-ended questioning to promote deeper critical thinking.',
    'Implement more peer-to-peer discussion structures prior to sharing out to the whole group.',
  ],
  rubric: [
    {
      id: '3a',
      domain: 'Domain 3: Instruction',
      title: '3a: Communicating with Students',
      description: 'Expectations for learning, directions and procedures, explanations of content, use of oral and written language.',
      level: 'Effective', // Or Proficient based on image
      evidence: '"Teacher explicitly stated the learning goal regarding cellular respiration at the start of the lesson and referenced it again before the independent lab work."'
    },
    {
      id: '3b',
      domain: 'Domain 3: Instruction',
      title: '3b: Using Questioning and Discussion Techniques',
      description: 'Quality of questions, discussion techniques, student participation.',
      level: 'Developing', // Assuming 'Basic' from image maps to Developing or is custom
      evidence: '"Most questions asked were recall-level (e.g., \'What is the powerhouse of the cell?\'). Few open-ended questions were posed to stimulate broader discussion among peers."'
    },
    {
      id: '3c',
      domain: 'Domain 3: Instruction',
      title: '3c: Engaging Students in Learning',
      description: 'Activities and assignments, grouping of students, instructional materials and resources, structure and pacing.',
      level: 'Effective',
      evidence: '"Students were actively using microscopes during the lab phase. Pacing was appropriate, allowing all groups to complete the slide preparation."'
    }
  ],
  evidenceLog: [
    { time: '10:05 AM', text: 'Teacher asks open-ended question about photosynthesis, prompting a 3-minute student-led discussion.' },
    { time: '10:12 AM', text: 'Students are grouped into pairs to analyze leaf stomata under microscopes. Clear instructions provided via visual aid on smartboard.' },
    { time: '10:18 AM', text: 'Teacher circulates room, stopping at group 3 to redirect off-task behavior calmly.' }
  ]
};
