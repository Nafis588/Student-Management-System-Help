import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Table } from '../components/Table';
import type { Column } from '../components/Table';
import StudentForm from '../components/StudentForm';
import type { Student } from '../types';
import { getStudentShift } from '../utils/validators';
import { Search, UserPlus } from 'lucide-react';

export const Students: React.FC = () => {
  const { students } = useApp();
  const [showModal, setShowModal] = useState(false);

  // URL state persistence via SearchParams
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get('search') || '';
  const program = searchParams.get('program') || 'ALL';
  const sortKey = searchParams.get('sort') || 'studentId';
  const sortOrder = (searchParams.get('order') as 'asc' | 'desc') || 'asc';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const pageSize = parseInt(searchParams.get('limit') || '5', 10);

  // Helper to update search params
  const updateParams = (updates: Record<string, string | number>) => {
    const nextParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === '' || value === 'ALL') {
        nextParams.delete(key);
      } else {
        nextParams.set(key, String(value));
      }
    });
    setSearchParams(nextParams);
  };

  // Filter students
  let processed = [...students];

  if (search) {
    processed = processed.filter(s =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.studentId.includes(search) ||
      s.email.toLowerCase().includes(search.toLowerCase())
    );
  }

  if (program && program !== 'ALL') {
    processed = processed.filter(s => s.program === program);
  }

  // Sort students
  if (sortKey) {
    processed.sort((a, b) => {
      let valA: any = a[sortKey as keyof Student];
      let valB: any = b[sortKey as keyof Student];

      if (sortKey === 'shift') {
        valA = getStudentShift(a.studentId);
        valB = getStudentShift(b.studentId);
      }

      if (typeof valA === 'string') {
        return sortOrder === 'asc'
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      } else {
        return sortOrder === 'asc' ? valA - valB : valB - valA;
      }
    });
  }

  // Paginate students
  const totalRecords = processed.length;
  const totalPages = Math.ceil(totalRecords / pageSize);
  const currentPage = Math.max(1, Math.min(page, totalPages || 1));
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = processed.slice(startIndex, startIndex + pageSize);

  // Table columns definition
  const columns: Column<Student>[] = [
    { key: 'studentId', label: 'ID', sortable: true },
    { key: 'name', label: 'Full Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    {
      key: 'program',
      label: 'Program',
      sortable: true,
      render: (s) => (
        <span className={`badge ${s.program === 'CSE' ? 'badge-blue' : s.program === 'EEE' ? 'badge-purple' : 'badge-green'}`}>
          {s.program}
        </span>
      )
    },
    {
      key: 'year',
      label: 'Year',
      sortable: true,
      render: (s) => `${s.year}${s.year === 1 ? 'st' : s.year === 2 ? 'nd' : s.year === 3 ? 'rd' : 'th'} Year`
    },
    {
      key: 'shift',
      label: 'Shift',
      sortable: true,
      render: (s) => (
        <span className={`badge ${getStudentShift(s.studentId) === 'Morning' ? 'badge-blue' : 'badge-purple'}`} style={{ opacity: 0.85 }}>
          {getStudentShift(s.studentId)}
        </span>
      )
    },
    {
      key: 'createdAt',
      label: 'Reg. Date',
      sortable: true,
      render: (s) => new Date(s.createdAt).toLocaleDateString()
    }
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Student Directory</h1>
          <p className="subtitle">Manage department student records and shifts.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <UserPlus size={18} />
          Register Student
        </button>
      </div>

      <div className="filter-bar">
        <div className="form-group filter-input" style={{ marginBottom: 0 }}>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Search by name, ID or email..."
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

        <div className="form-group filter-select" style={{ marginBottom: 0 }}>
          <select
            className="form-control"
            value={program}
            onChange={(e) => updateParams({ program: e.target.value, page: 1 })}
          >
            <option value="ALL">All Programs</option>
            <option value="CSE">CSE</option>
            <option value="EEE">EEE</option>
            <option value="BBA">BBA</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Humanities">Humanities</option>
            <option value="English">English</option>
          </select>
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

      {showModal && <StudentForm onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default Students;
