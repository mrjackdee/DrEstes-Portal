import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { db, auth, loginWithGoogle, logout } from '../lib/firebase';
import { collection, query, where, onSnapshot, addDoc, doc, updateDoc, Timestamp } from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';
import { handleFirestoreError, OperationType } from '../lib/firebase-error';
import { Teacher, ObservationData } from '../types';

interface DatabaseContextType {
  user: User | null;
  loading: boolean;
  teachers: Teacher[];
  observations: ObservationData[];
  addTeacher: (teacher: Omit<Teacher, 'id' | 'adminId' | 'createdAt'>) => Promise<string>;
  addObservation: (observation: Omit<ObservationData, 'id' | 'adminId' | 'createdAt' | 'trendData'>) => Promise<string>;
  login: () => Promise<void>;
  logoutUser: () => Promise<void>;
}

const DatabaseContext = createContext<DatabaseContextType>({} as DatabaseContextType);

export function DatabaseProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [observations, setObservations] = useState<ObservationData[]>([]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!user) {
      setTeachers([]);
      setObservations([]);
      return;
    }

    const qTeachers = query(collection(db, 'teachers'), where('adminId', '==', user.uid));
    const unsubTeachers = onSnapshot(qTeachers, (snapshot) => {
      const t = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Teacher));
      setTeachers(t);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'teachers');
    });

    const qObs = query(collection(db, 'observations'), where('adminId', '==', user.uid));
    const unsubObs = onSnapshot(qObs, (snapshot) => {
      const arr: ObservationData[] = [];
      snapshot.docs.forEach(doc => {
         const data = doc.data();
         arr.push({
           id: doc.id,
           adminId: data.adminId,
           teacherId: data.teacherId,
           teacherName: data.teacherName,
           subject: data.subject,
           school: data.school,
           date: data.date,
           time: data.time,
           overallRating: data.overallRating,
           commendations: JSON.parse(data.commendations || '[]'),
           refinements: JSON.parse(data.refinements || '[]'),
           rubric: JSON.parse(data.rubric || '[]'),
           evidenceLog: JSON.parse(data.evidenceLog || '[]'),
           createdAt: data.createdAt?.toMillis ? data.createdAt.toMillis() : Date.now(),
           trendData: [] // Mock or calculate client side
         });
      });
      setObservations(arr);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'observations');
    });

    return () => {
      unsubTeachers();
      unsubObs();
    };
  }, [user]);

  const addTeacher = async (teacher: Omit<Teacher, 'id' | 'adminId' | 'createdAt'>) => {
    if (!user) throw new Error('Not authenticated');
    try {
      const ref = await addDoc(collection(db, 'teachers'), {
        ...teacher,
        adminId: user.uid,
        createdAt: Timestamp.now()
      });
      return ref.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'teachers');
      throw error;
    }
  };

  const addObservation = async (obs: Omit<ObservationData, 'id' | 'adminId' | 'createdAt' | 'trendData'>) => {
    if (!user) throw new Error('Not authenticated');
    try {
      const payload = {
         adminId: user.uid,
         teacherId: obs.teacherId,
         teacherName: obs.teacherName,
         subject: obs.subject,
         school: obs.school,
         date: obs.date,
         time: obs.time,
         overallRating: obs.overallRating,
         commendations: JSON.stringify(obs.commendations),
         refinements: JSON.stringify(obs.refinements),
         rubric: JSON.stringify(obs.rubric),
         evidenceLog: JSON.stringify(obs.evidenceLog),
         createdAt: Timestamp.now()
      };
      const ref = await addDoc(collection(db, 'observations'), payload);
      return ref.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'observations');
      throw error;
    }
  };

  const login = async () => {
    await loginWithGoogle();
  };

  const logoutUser = async () => {
    await logout();
  };

  return (
    <DatabaseContext.Provider value={{
      user, loading, teachers, observations, addTeacher, addObservation, login, logoutUser
    }}>
      {children}
    </DatabaseContext.Provider>
  );
}

export const useDatabase = () => useContext(DatabaseContext);
