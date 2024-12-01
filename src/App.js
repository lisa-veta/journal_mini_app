import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AttendancePage, SchedulePage } from "./pages/index.jsx"
import { Navigation } from './components';

function App() {
  return (
      <Router>
          <Routes>
              <Route path="/" element={<SchedulePage />} />
              <Route path="/attendance/:subjectId" element={<AttendancePage />} />
          </Routes>
      </Router>
  );
}

export default App;
