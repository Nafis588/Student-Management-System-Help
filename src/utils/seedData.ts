import type { Student, Course, Enrollment, Grade } from '../types';

export const SEED_COURSES: Course[] = [
  { courseId: 'CSE101', title: 'Introduction to Computer Science', credits: 3, department: 'CSE' },
  { courseId: 'CSE202', title: 'Data Structures and Algorithms', credits: 4, department: 'CSE' },
  { courseId: 'EEE201', title: 'Circuit Analysis', credits: 4, department: 'EEE' },
  { courseId: 'MTH101', title: 'Calculus I', credits: 3, department: 'Mathematics' },
  { courseId: 'ENG102', title: 'English Composition', credits: 2, department: 'Humanities' },
  { courseId: 'BBA101', title: 'Principles of Management', credits: 3, department: 'BBA' }
];

export const SEED_STUDENTS: Student[] = [
  {
    studentId: '2610001',
    name: 'Ayesha Rahman',
    email: 'ayesha.rahman@university.edu',
    program: 'CSE',
    year: 1,
    createdAt: new Date('2026-01-15T09:00:00Z').toISOString()
  },
  {
    studentId: '2620002',
    name: 'Tanvir Hossain',
    email: 'tanvir.hossain@university.edu',
    program: 'EEE',
    year: 2,
    createdAt: new Date('2026-01-20T10:30:00Z').toISOString()
  },
  {
    studentId: '2610003',
    name: 'Nafis Ahmed',
    email: 'nafis.ahmed@university.edu',
    program: 'CSE',
    year: 1,
    createdAt: new Date('2026-02-05T14:15:00Z').toISOString()
  },
  {
    studentId: '2620004',
    name: 'Fariha Islam',
    email: 'fariha.islam@university.edu',
    program: 'BBA',
    year: 3,
    createdAt: new Date('2026-02-10T11:00:00Z').toISOString()
  },
  {
    studentId: '2610005',
    name: 'Sajid Mahmud',
    email: 'sajid.mahmud@university.edu',
    program: 'CSE',
    year: 1,
    createdAt: new Date('2026-02-12T16:45:00Z').toISOString()
  }
];

export const SEED_ENROLLMENTS: Enrollment[] = [
  { enrollmentId: 'E10001', studentId: '2610001', courseId: 'CSE101', date: new Date('2026-02-01').toISOString() },
  { enrollmentId: 'E10002', studentId: '2610001', courseId: 'MTH101', date: new Date('2026-02-02').toISOString() },
  { enrollmentId: 'E10003', studentId: '2620002', courseId: 'EEE201', date: new Date('2026-02-01').toISOString() },
  { enrollmentId: 'E10004', studentId: '2610003', courseId: 'CSE101', date: new Date('2026-02-06').toISOString() },
  { enrollmentId: 'E10005', studentId: '2620004', courseId: 'BBA101', date: new Date('2026-02-11').toISOString() }
];

export const SEED_GRADES: Grade[] = [
  { gradeId: 'G10001', studentId: '2610001', courseId: 'CSE101', grade: 85, semester: 'Spring 2026' },
  { gradeId: 'G10002', studentId: '2610001', courseId: 'MTH101', grade: 78, semester: 'Spring 2026' },
  { gradeId: 'G10003', studentId: '2620002', courseId: 'EEE201', grade: 92, semester: 'Spring 2026' }
];
