import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Student, Course, Enrollment, Grade } from '../types';
import { SEED_STUDENTS, SEED_COURSES, SEED_ENROLLMENTS, SEED_GRADES } from '../utils/seedData';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextType {
  students: Student[];
  courses: Course[];
  enrollments: Enrollment[];
  grades: Grade[];
  toasts: ToastMessage[];
  registerStudent: (student: Omit<Student, 'createdAt'>) => { success: boolean; message: string };
  enrollStudent: (studentId: string, courseId: string) => { success: boolean; message: string };
  submitGrade: (studentId: string, courseId: string, grade: number, semester: string) => { success: boolean; message: string };
  resetToSeedData: () => void;
  addToast: (message: string, type: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Load initial data
  useEffect(() => {
    const storedStudents = localStorage.getItem('sms_students');
    const storedCourses = localStorage.getItem('sms_courses');
    const storedEnrollments = localStorage.getItem('sms_enrollments');
    const storedGrades = localStorage.getItem('sms_grades');

    if (storedStudents) {
      setStudents(JSON.parse(storedStudents));
    } else {
      localStorage.setItem('sms_students', JSON.stringify(SEED_STUDENTS));
      setStudents(SEED_STUDENTS);
    }

    if (storedCourses) {
      setCourses(JSON.parse(storedCourses));
    } else {
      localStorage.setItem('sms_courses', JSON.stringify(SEED_COURSES));
      setCourses(SEED_COURSES);
    }

    if (storedEnrollments) {
      setEnrollments(JSON.parse(storedEnrollments));
    } else {
      localStorage.setItem('sms_enrollments', JSON.stringify(SEED_ENROLLMENTS));
      setEnrollments(SEED_ENROLLMENTS);
    }

    if (storedGrades) {
      setGrades(JSON.parse(storedGrades));
    } else {
      localStorage.setItem('sms_grades', JSON.stringify(SEED_GRADES));
      setGrades(SEED_GRADES);
    }
  }, []);

  const addToast = (message: string, type: 'success' | 'error' | 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    
    // Auto-remove after 4 seconds
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const registerStudent = (newStudent: Omit<Student, 'createdAt'>) => {
    // Check if studentId already exists
    if (students.some(s => s.studentId === newStudent.studentId)) {
      addToast('Student ID already registered.', 'error');
      return { success: false, message: 'Student ID already registered.' };
    }
    // Check if email already exists
    if (students.some(s => s.email.toLowerCase() === newStudent.email.toLowerCase())) {
      addToast('Email already registered.', 'error');
      return { success: false, message: 'Email already registered.' };
    }

    const studentWithDate: Student = {
      ...newStudent,
      createdAt: new Date().toISOString()
    };

    const updatedStudents = [...students, studentWithDate];
    setStudents(updatedStudents);
    localStorage.setItem('sms_students', JSON.stringify(updatedStudents));
    addToast('Student registered successfully!', 'success');
    return { success: true, message: 'Student registered successfully!' };
  };

  const enrollStudent = (studentId: string, courseId: string) => {
    // Validate student exists
    if (!students.some(s => s.studentId === studentId)) {
      addToast('Student does not exist.', 'error');
      return { success: false, message: 'Student does not exist.' };
    }
    // Validate course exists
    if (!courses.some(c => c.courseId === courseId)) {
      addToast('Course does not exist.', 'error');
      return { success: false, message: 'Course does not exist.' };
    }
    // Validate duplicate enrollment
    const isAlreadyEnrolled = enrollments.some(
      e => e.studentId === studentId && e.courseId === courseId
    );
    if (isAlreadyEnrolled) {
      addToast('Student is already enrolled in this course.', 'error');
      return { success: false, message: 'Student is already enrolled in this course.' };
    }

    // Generate enrollment ID
    const enrollmentNums = enrollments
      .map(e => parseInt(e.enrollmentId.replace('E', ''), 10))
      .filter(num => !isNaN(num));
    const nextNum = enrollmentNums.length > 0 ? Math.max(...enrollmentNums) + 1 : 10001;
    const newEnrollmentId = `E${nextNum}`;

    const newEnrollment: Enrollment = {
      enrollmentId: newEnrollmentId,
      studentId,
      courseId,
      date: new Date().toISOString()
    };

    const updatedEnrollments = [...enrollments, newEnrollment];
    setEnrollments(updatedEnrollments);
    localStorage.setItem('sms_enrollments', JSON.stringify(updatedEnrollments));
    addToast('Student enrolled in course successfully!', 'success');
    return { success: true, message: 'Student enrolled in course successfully!' };
  };

  const submitGrade = (studentId: string, courseId: string, gradeValue: number, semester: string) => {
    // Validate student is enrolled in course
    const isEnrolled = enrollments.some(
      e => e.studentId === studentId && e.courseId === courseId
    );
    if (!isEnrolled) {
      addToast('Student is not enrolled in this course.', 'error');
      return { success: false, message: 'Student is not enrolled in this course.' };
    }

    // Check if grade already exists for this student/course/semester
    const existingGradeIndex = grades.findIndex(
      g => g.studentId === studentId && g.courseId === courseId && g.semester === semester
    );

    let updatedGrades = [...grades];
    let isUpdate = false;
    if (existingGradeIndex > -1) {
      // Update existing grade
      updatedGrades[existingGradeIndex] = {
        ...updatedGrades[existingGradeIndex],
        grade: gradeValue
      };
      isUpdate = true;
    } else {
      // Generate grade ID
      const gradeNums = grades
        .map(g => parseInt(g.gradeId.replace('G', ''), 10))
        .filter(num => !isNaN(num));
      const nextNum = gradeNums.length > 0 ? Math.max(...gradeNums) + 1 : 10001;
      const newGradeId = `G${nextNum}`;

      const newGrade: Grade = {
        gradeId: newGradeId,
        studentId,
        courseId,
        grade: gradeValue,
        semester
      };
      updatedGrades.push(newGrade);
    }

    setGrades(updatedGrades);
    localStorage.setItem('sms_grades', JSON.stringify(updatedGrades));
    addToast(isUpdate ? 'Grade updated successfully!' : 'Grade submitted successfully!', 'success');
    return { 
      success: true, 
      message: isUpdate ? 'Grade updated successfully!' : 'Grade submitted successfully!' 
    };
  };

  const resetToSeedData = () => {
    localStorage.setItem('sms_students', JSON.stringify(SEED_STUDENTS));
    localStorage.setItem('sms_courses', JSON.stringify(SEED_COURSES));
    localStorage.setItem('sms_enrollments', JSON.stringify(SEED_ENROLLMENTS));
    localStorage.setItem('sms_grades', JSON.stringify(SEED_GRADES));

    setStudents(SEED_STUDENTS);
    setCourses(SEED_COURSES);
    setEnrollments(SEED_ENROLLMENTS);
    setGrades(SEED_GRADES);
    addToast('Application reset to initial seed data.', 'info');
  };

  return (
    <AppContext.Provider value={{
      students,
      courses,
      enrollments,
      grades,
      toasts,
      registerStudent,
      enrollStudent,
      submitGrade,
      resetToSeedData,
      addToast,
      removeToast
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
