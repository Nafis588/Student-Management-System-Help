import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useApp } from '../context/AppContext';
import { validateStudentId } from '../utils/validators';

const studentSchema = z.object({
  studentId: z.string()
    .min(1, 'Student ID is required')
    .refine(val => validateStudentId(val).isValid, {
      message: 'Invalid ID. Must start with 26, third digit 1 or 2, and contain 7 digits total.'
    }),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  program: z.string().min(1, 'Program is required'),
  year: z.string().min(1, 'Year must be selected')
});

type StudentFormData = z.infer<typeof studentSchema>;

interface StudentFormProps {
  onClose: () => void;
}

export const StudentForm: React.FC<StudentFormProps> = ({ onClose }) => {
  const { registerStudent } = useApp();
  const { register, handleSubmit, watch, formState: { errors } } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      studentId: '',
      name: '',
      email: '',
      program: 'CSE',
      year: '1'
    }
  });

  const watchedId = watch('studentId');
  const idAnalysis = validateStudentId(watchedId);

  const onSubmit = (data: StudentFormData) => {
    const result = registerStudent({
      ...data,
      year: parseInt(data.year, 10)
    });
    if (result.success) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="glass-card modal-content">
        <h2 style={{ marginBottom: '1.5rem' }}>Register Student</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label className="form-label">Student ID</label>
            <input
              type="text"
              placeholder="e.g., 2610012"
              className="form-control"
              {...register('studentId')}
            />
            {errors.studentId && <span className="form-error">{errors.studentId.message}</span>}
            {idAnalysis.isValid && idAnalysis.details && (
              <div style={{ fontSize: '0.8rem', color: 'var(--success)', marginTop: '0.25rem' }}>
                ✓ Parsed ID: {idAnalysis.details.year} Intake, {idAnalysis.details.shift} Shift (Serial: {idAnalysis.details.serial})
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              placeholder="Enter student's full name"
              className="form-control"
              {...register('name')}
            />
            {errors.name && <span className="form-error">{errors.name.message}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">University Email</label>
            <input
              type="email"
              placeholder="e.g., name@university.edu"
              className="form-control"
              {...register('email')}
            />
            {errors.email && <span className="form-error">{errors.email.message}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Program / Department</label>
            <select className="form-control" {...register('program')}>
              <option value="CSE">Computer Science & Engineering (CSE)</option>
              <option value="EEE">Electrical & Electronic Engineering (EEE)</option>
              <option value="BBA">Business Administration (BBA)</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Humanities">Humanities</option>
              <option value="English">English</option>
            </select>
            {errors.program && <span className="form-error">{errors.program.message}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Academic Year</label>
            <select className="form-control" {...register('year')}>
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">4th Year</option>
            </select>
            {errors.year && <span className="form-error">{errors.year.message}</span>}
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Register Student
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentForm;
