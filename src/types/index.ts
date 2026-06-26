export interface Student {
  studentId: string;
  name: string;
  email: string;
  program: string;
  year: number;
  createdAt: string;
}

export interface Course {
  courseId: string;
  title: string;
  credits: number;
  department: string;
}

export interface Enrollment {
  enrollmentId: string;
  studentId: string;
  courseId: string;
  date: string;
}

export interface Grade {
  gradeId: string;
  studentId: string;
  courseId: string;
  grade: number;
  semester: string;
}
