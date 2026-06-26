import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useApp } from '../context/AppContext';

const gradeSchema = z.object({
  studentId: z.string().min(1, 'Please select a student'),
  courseId: z.string().min(1, 'Please select a course'),
  grade: z.string().regex(/^(100|[1-9]?\d)$/, 'Grade must be a number between 0 and 100'),
  semester: z.string().min(1, 'Semester is required')
});

type GradeFormData = z.infer<typeof gradeSchema>;

interface GradeFormProps {
  onClose: () => void;
}

export const GradeForm: React.FC<GradeFormProps> = ({ onClose }) => {
  const { students, courses, enrollments, submitGrade } = useApp();
  const { register, handleSubmit, watch, formState: { errors } } = useForm<GradeFormData>({
    resolver: zodResolver(gradeSchema),
    defaultValues: {
      studentId: '',
      courseId: '',
      grade: '80',
      semester: 'Spring 2026'
    }
  });

  const watchedStudentId = watch('studentId');
  
  // Filter courses based on active enrollments of the selected student
  const studentEnrollments = enrollments.filter(e => e.studentId === watchedStudentId);
  const enrolledCourses = courses.filter(c => 
    studentEnrollments.some(e => e.courseId === c.courseId)
  );

  const onSubmit = (data: GradeFormData) => {
    const result = submitGrade(data.studentId, data.courseId, parseInt(data.grade, 10), data.semester);
    if (result.success) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="glass-card modal-content">
        <h2 style={{ marginBottom: '1.5rem' }}>Submit Grade</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label className="form-label">Student</label>
            <select className="form-control" {...register('studentId')}>
              <option value="">-- Select Student --</option>
              {students.map(student => (
                <option key={student.studentId} value={student.studentId}>
                  {student.studentId} - {student.name}
                </option>
              ))}
            </select>
            {errors.studentId && <span className="form-error">{errors.studentId.message}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Course</label>
            <select 
              className="form-control" 
              {...register('courseId')} 
              disabled={!watchedStudentId || enrolledCourses.length === 0}
            >
              <option value="">-- Select Course --</option>
              {enrolledCourses.map(course => (
                <option key={course.courseId} value={course.courseId}>
                  {course.courseId} - {course.title}
                </option>
              ))}
            </select>
            {errors.courseId && <span className="form-error">{errors.courseId.message}</span>}
            
            {watchedStudentId && enrolledCourses.length === 0 && (
              <span className="form-error" style={{ color: 'var(--warning)', marginTop: '0.25rem' }}>
                ⚠ Student is not enrolled in any courses. Please enroll them first!
              </span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Grade (0 - 100)</label>
            <input
              type="number"
              placeholder="e.g., 85"
              className="form-control"
              {...register('grade')}
            />
            {errors.grade && <span className="form-error">{errors.grade.message}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Semester</label>
            <select className="form-control" {...register('semester')}>
              <option value="Spring 2026">Spring 2026</option>
              <option value="Summer 2026">Summer 2026</option>
              <option value="Fall 2026">Fall 2026</option>
            </select>
            {errors.semester && <span className="form-error">{errors.semester.message}</span>}
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={!watchedStudentId || enrolledCourses.length === 0}
            >
              Submit Grade
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GradeForm;
