import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AttendancePage, SchedulePage } from "./pages/index.jsx"
import { Navigation } from './components';

function App(props) {
  return (
      <Router>
          <Routes>
              <Route path="/" element={<SchedulePage groupId={props.groupId} />} />
              <Route path="/attendance/:subjectId" element={<AttendancePage groupId={props.groupId} />} />
          </Routes>
      </Router>
  );
}

export default App;
