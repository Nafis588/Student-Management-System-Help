import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import ToastList from './components/ToastList';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Enrollments from './pages/Enrollments';
import Grades from './pages/Grades';

function App() {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/students" element={<Students />} />
          <Route path="/enrollments" element={<Enrollments />} />
          <Route path="/grades" element={<Grades />} />
        </Routes>
      </main>
      <ToastList />
    </div>
  );
}

export default App;
