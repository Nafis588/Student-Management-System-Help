import React from 'react';
import { useApp } from '../context/AppContext';
import { getStudentShift } from '../utils/validators';
import { Users, BookOpen, GraduationCap, Award, Compass } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { students, enrollments, grades, courses } = useApp();

  // Statistics
  const totalStudents = students.length;
  const totalEnrollments = enrollments.length;
  const totalCourses = courses.length;

  const averageGrade = grades.length > 0
    ? (grades.reduce((sum, g) => sum + g.grade, 0) / grades.length).toFixed(1)
    : 'N/A';

  // Shift breakdown
  const morningStudents = students.filter(s => getStudentShift(s.studentId) === 'Morning').length;
  const dayStudents = students.filter(s => getStudentShift(s.studentId) === 'Day').length;

  // Program Distribution
  const programCounts = students.reduce((acc, student) => {
    acc[student.program] = (acc[student.program] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const maxProgramCount = Math.max(...Object.values(programCounts), 1);

  // Average Grade per Course
  const courseGrades = grades.reduce((acc, g) => {
    if (!acc[g.courseId]) acc[g.courseId] = [];
    acc[g.courseId].push(g.grade);
    return acc;
  }, {} as Record<string, number[]>);

  const courseAverages = Object.entries(courseGrades).map(([courseId, list]) => {
    const avg = list.reduce((sum, val) => sum + val, 0) / list.length;
    return { courseId, average: parseFloat(avg.toFixed(1)) };
  }).sort((a, b) => b.average - a.average);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Department Dashboard</h1>
          <p className="subtitle">Overview and analytics for academic enrollment and grading performance.</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="glass-card stat-card">
          <div className="stat-icon-wrapper">
            <Users size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{totalStudents}</span>
            <span className="stat-label">Students Enrolled</span>
          </div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-icon-wrapper">
            <BookOpen size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{totalEnrollments}</span>
            <span className="stat-label">Active Enrollments</span>
          </div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-icon-wrapper">
            <GraduationCap size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{totalCourses}</span>
            <span className="stat-label">Available Courses</span>
          </div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-icon-wrapper">
            <Award size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{averageGrade}{averageGrade !== 'N/A' && '%'}</span>
            <span className="stat-label">Average Department Grade</span>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        {/* Student Program Distribution Chart */}
        <div className="glass-card">
          <h2>Program Distribution</h2>
          <p className="subtitle" style={{ marginBottom: '1rem' }}>Total students enrolled per program.</p>
          <div className="chart-bar-container">
            {Object.keys(programCounts).length > 0 ? (
              Object.entries(programCounts).map(([program, count]) => {
                const percentage = (count / maxProgramCount) * 100;
                return (
                  <div className="chart-row" key={program}>
                    <span className="chart-label">{program}</span>
                    <div className="chart-track">
                      <div className="chart-fill" style={{ width: `${percentage}%` }} />
                    </div>
                    <span className="chart-value">{count}</span>
                  </div>
                );
              })
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                No student data available to show.
              </div>
            )}
          </div>
        </div>

        {/* Grade Averages by Course Chart */}
        <div className="glass-card">
          <h2>Course Performance Averages</h2>
          <p className="subtitle" style={{ marginBottom: '1rem' }}>Average student grades earned in each course.</p>
          <div className="chart-bar-container">
            {courseAverages.length > 0 ? (
              courseAverages.map(({ courseId, average }) => {
                const courseName = courses.find(c => c.courseId === courseId)?.title || courseId;
                return (
                  <div className="chart-row" key={courseId} title={courseName}>
                    <span className="chart-label">{courseId}</span>
                    <div className="chart-track">
                      <div className="chart-fill" style={{ width: `${average}%` }} />
                    </div>
                    <span className="chart-value">{average}%</span>
                  </div>
                );
              })
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                No grade records available to calculate.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Shift Analysis Section */}
      <div className="glass-card" style={{ marginTop: '1.5rem' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Compass size={20} className="text-accent" />
          Shift Allocation Details
        </h2>
        <p className="subtitle">Visualizing division of morning vs. day shift students (inferred from Student ID digit 3).</p>
        
        <div style={{ display: 'flex', gap: '2rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '200px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
              <span>Morning Shift (Digit 3 = 1)</span>
              <span>{morningStudents} Students ({totalStudents > 0 ? ((morningStudents / totalStudents) * 100).toFixed(0) : 0}%)</span>
            </div>
            <div className="chart-track" style={{ height: '16px' }}>
              <div 
                className="chart-fill" 
                style={{ 
                  width: `${totalStudents > 0 ? (morningStudents / totalStudents) * 100 : 0}%`, 
                  background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)' 
                }} 
              />
            </div>
          </div>

          <div style={{ flex: 1, minWidth: '200px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
              <span>Day Shift (Digit 3 = 2)</span>
              <span>{dayStudents} Students ({totalStudents > 0 ? ((dayStudents / totalStudents) * 100).toFixed(0) : 0}%)</span>
            </div>
            <div className="chart-track" style={{ height: '16px' }}>
              <div 
                className="chart-fill" 
                style={{ 
                  width: `${totalStudents > 0 ? (dayStudents / totalStudents) * 100 : 0}%`, 
                  background: 'linear-gradient(135deg, #f472b6 0%, #ec4899 100%)' 
                }} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
