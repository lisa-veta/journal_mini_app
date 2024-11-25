import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AttendancePage, SchedulePage } from "./pages/index.jsx"
import { Navigation } from './components';

function App() {
  return (
      <Router>
          <Routes>
              <Route path="/schedule" element={<SchedulePage/>}/>
              <Route path="/attendance/:subjectId" element={<AttendancePage />} />
              <Route path="/" element={<Navigation />} />
          </Routes>
      </Router>
  );
}

export default App;
