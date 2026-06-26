import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Table } from '../components/Table';
import type { Column } from '../components/Table';
import EnrollmentForm from '../components/EnrollmentForm';
import { Search, PlusCircle } from 'lucide-react';

interface EnrollmentRow {
  enrollmentId: string;
  studentId: string;
  studentName: string;
  courseId: string;
  courseTitle: string;
  date: string;
}

export const Enrollments: React.FC = () => {
  const { enrollments, students, courses } = useApp();
  const [showModal, setShowModal] = useState(false);

  // URL state persistence via SearchParams
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get('search') || '';
  const sortKey = searchParams.get('sort') || 'enrollmentId';
  const sortOrder = (searchParams.get('order') as 'asc' | 'desc') || 'asc';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const pageSize = parseInt(searchParams.get('limit') || '5', 10);

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

  // Map enrollments to detailed rows
  let processed: EnrollmentRow[] = enrollments.map(e => {
    const student = students.find(s => s.studentId === e.studentId);
    const course = courses.find(c => c.courseId === e.courseId);
    return {
      enrollmentId: e.enrollmentId,
      studentId: e.studentId,
      studentName: student ? student.name : 'Unknown Student',
      courseId: e.courseId,
      courseTitle: course ? course.title : 'Unknown Course',
      date: e.date
    };
  });

  // Filter enrollments
  if (search) {
    processed = processed.filter(e =>
      e.studentId.includes(search) ||
      e.studentName.toLowerCase().includes(search.toLowerCase()) ||
      e.courseId.toLowerCase().includes(search.toLowerCase()) ||
      e.courseTitle.toLowerCase().includes(search.toLowerCase())
    );
  }

  // Sort enrollments
  if (sortKey) {
    processed.sort((a, b) => {
      const valA = a[sortKey as keyof EnrollmentRow] || '';
      const valB = b[sortKey as keyof EnrollmentRow] || '';

      if (typeof valA === 'string') {
        return sortOrder === 'asc'
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      } else {
        return sortOrder === 'asc' ? (valA as any) - (valB as any) : (valB as any) - (valA as any);
      }
    });
  }

  // Paginate enrollments
  const totalRecords = processed.length;
  const totalPages = Math.ceil(totalRecords / pageSize);
  const currentPage = Math.max(1, Math.min(page, totalPages || 1));
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = processed.slice(startIndex, startIndex + pageSize);

  // Table columns definition
  const columns: Column<EnrollmentRow>[] = [
    { key: 'enrollmentId', label: 'Enrollment ID', sortable: true },
    { key: 'studentId', label: 'Student ID', sortable: true },
    { key: 'studentName', label: 'Student Name', sortable: true },
    {
      key: 'courseId',
      label: 'Course Code',
      sortable: true,
      render: (e) => <span className="badge badge-purple">{e.courseId}</span>
    },
    { key: 'courseTitle', label: 'Course Title', sortable: true },
    {
      key: 'date',
      label: 'Enrollment Date',
      sortable: true,
      render: (e) => new Date(e.date).toLocaleDateString()
    }
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Course Enrollments</h1>
          <p className="subtitle">Enroll students in courses and track registry dates.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <PlusCircle size={18} />
          Enroll Student
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

      {showModal && <EnrollmentForm onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default Enrollments;
