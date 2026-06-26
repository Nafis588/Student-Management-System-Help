import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Table } from '../components/Table';
import type { Column } from '../components/Table';
import GradeForm from '../components/GradeForm';
import { Search, Award } from 'lucide-react';

interface GradeRow {
  gradeId: string;
  studentId: string;
  studentName: string;
  courseId: string;
  courseTitle: string;
  grade: number;
  semester: string;
  letterGrade: string;
}

export const Grades: React.FC = () => {
  const { grades, students, courses } = useApp();
  const [showModal, setShowModal] = useState(false);

  // URL state persistence via SearchParams
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get('search') || '';
  const sortKey = searchParams.get('sort') || 'gradeId';
  const sortOrder = (searchParams.get('order') as 'asc' | 'desc') || 'asc';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const pageSize = parseInt(searchParams.get('limit') || '5', 10);

  // Helper to calculate letter grades
  const getLetterGrade = (gradeValue: number): string => {
    if (gradeValue >= 90) return 'A';
    if (gradeValue >= 80) return 'B';
    if (gradeValue >= 70) return 'C';
    if (gradeValue >= 60) return 'D';
    return 'F';
  };

  // Helper to update search params
  const updateParams = (updates: Record<string, string | number>) => {
    const nextParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === '') {
        nextParams.delete(key);
      } else {
        nextParams.set(key, String(value));
      }
    });
    setSearchParams(nextParams);
  };

  // Map grades to detailed rows
  let processed: GradeRow[] = grades.map(g => {
    const student = students.find(s => s.studentId === g.studentId);
    const course = courses.find(c => c.courseId === g.courseId);
    return {
      gradeId: g.gradeId,
      studentId: g.studentId,
      studentName: student ? student.name : 'Unknown Student',
      courseId: g.courseId,
      courseTitle: course ? course.title : 'Unknown Course',
      grade: g.grade,
      semester: g.semester,
      letterGrade: getLetterGrade(g.grade)
    };
  });

  // Filter grades
  if (search) {
    processed = processed.filter(g =>
      g.studentId.includes(search) ||
      g.studentName.toLowerCase().includes(search.toLowerCase()) ||
      g.courseId.toLowerCase().includes(search.toLowerCase()) ||
      g.courseTitle.toLowerCase().includes(search.toLowerCase()) ||
      g.semester.toLowerCase().includes(search.toLowerCase())
    );
  }

  // Sort grades
  if (sortKey) {
    processed.sort((a, b) => {
      const valA = a[sortKey as keyof GradeRow];
      const valB = b[sortKey as keyof GradeRow];

      if (typeof valA === 'string') {
        const strB = (valB as string) || '';
        return sortOrder === 'asc'
          ? valA.localeCompare(strB)
          : strB.localeCompare(valA);
      } else {
        const numA = (valA as number) || 0;
        const numB = (valB as number) || 0;
        return sortOrder === 'asc' ? numA - numB : numB - numA;
      }
    });
  }

  // Paginate grades
  const totalRecords = processed.length;
  const totalPages = Math.ceil(totalRecords / pageSize);
  const currentPage = Math.max(1, Math.min(page, totalPages || 1));
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = processed.slice(startIndex, startIndex + pageSize);

  // Table columns definition
  const columns: Column<GradeRow>[] = [
    { key: 'gradeId', label: 'Grade ID', sortable: true },
    { key: 'studentId', label: 'Student ID', sortable: true },
    { key: 'studentName', label: 'Student Name', sortable: true },
    {
      key: 'courseId',
      label: 'Course Code',
      sortable: true,
      render: (g) => <span className="badge badge-purple">{g.courseId}</span>
    },
    { key: 'courseTitle', label: 'Course Title', sortable: true },
    { key: 'semester', label: 'Semester', sortable: true },
    {
      key: 'grade',
      label: 'Numeric Grade',
      sortable: true,
      render: (g) => <strong style={{ color: 'var(--text-primary)' }}>{g.grade}%</strong>
    },
    {
      key: 'letterGrade',
      label: 'Letter Grade',
      sortable: true,
      render: (g) => {
        let badgeClass = 'badge-blue';
        if (g.letterGrade === 'A') badgeClass = 'badge-green';
        if (g.letterGrade === 'F') badgeClass = 'badge-red';
        return <span className={`badge ${badgeClass}`}>{g.letterGrade}</span>;
      }
    }
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Student Grades</h1>
          <p className="subtitle">Submit, update and review academic grading details.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Award size={18} />
          Submit Grade
        </button>
      </div>

      <div className="filter-bar">
        <div className="form-group filter-input" style={{ marginBottom: 0 }}>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Search by student ID, name or course code..."
              className="form-control"
              style={{ paddingLeft: '2.5rem', width: '100%' }}
              value={search}
              onChange={(e) => updateParams({ search: e.target.value, page: 1 })}
            />
            <Search 
              size={18} 
              style={{ 
                position: 'absolute', 
                left: '0.85rem', 
                top: '50%', 
                transform: 'translateY(-50%)', 
                color: 'var(--text-muted)' 
              }} 
            />
          </div>
        </div>
      </div>

      <Table
        columns={columns}
        data={paginatedData}
        sortKey={sortKey}
        sortOrder={sortOrder}
        onSort={(key) => {
          const isAsc = sortKey === key && sortOrder === 'asc';
          updateParams({ sort: key, order: isAsc ? 'desc' : 'asc' });
        }}
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        totalRecords={totalRecords}
        onPageChange={(nextPage) => updateParams({ page: nextPage })}
        onPageSizeChange={(nextSize) => updateParams({ limit: nextSize, page: 1 })}
      />

      {showModal && <GradeForm onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default Grades;
