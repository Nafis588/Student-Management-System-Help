import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useApp } from '../context/AppContext';

const enrollmentSchema = z.object({
  studentId: z.string().min(1, 'Please select a student'),
  courseId: z.string().min(1, 'Please select a course')
});

type EnrollmentFormData = z.infer<typeof enrollmentSchema>;

interface EnrollmentFormProps {
  onClose: () => void;
}

export const EnrollmentForm: React.FC<EnrollmentFormProps> = ({ onClose }) => {
  const { students, courses, enrollStudent } = useApp();
  const { register, handleSubmit, formState: { errors } } = useForm<EnrollmentFormData>({
    resolver: zodResolver(enrollmentSchema)
  });

  const onSubmit = (data: EnrollmentFormData) => {
    const result = enrollStudent(data.studentId, data.courseId);
    if (result.success) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="glass-card modal-content">
        <h2 style={{ marginBottom: '1.5rem' }}>Enroll Student</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label className="form-label">Student</label>
            <select className="form-control" {...register('studentId')} defaultValue="">
              <option value="" disabled>-- Select Student --</option>
              {students.map(student => (
                <option key={student.studentId} value={student.studentId}>
                  {student.studentId} - {student.name} ({student.program})
                </option>
              ))}
            </select>
            {errors.studentId && <span className="form-error">{errors.studentId.message}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Course</label>
            <select className="form-control" {...register('courseId')} defaultValue="">
              <option value="" disabled>-- Select Course --</option>
              {courses.map(course => (
                <option key={course.courseId} value={course.courseId}>
                  {course.courseId} - {course.title} ({course.credits} Credits)
                </option>
              ))}
            </select>
            {errors.courseId && <span className="form-error">{errors.courseId.message}</span>}
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Enroll Student
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EnrollmentForm;
