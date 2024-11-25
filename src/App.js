import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AttendancePage, SchedulePage, Layout } from "./pages/index.jsx"

function App() {
  return (
      <Router>
          <Layout>
              <Routes>
                  <Route path="/" element={<SchedulePage />} />
                  <Route path="/attendance/:subjectId" element={<AttendancePage />} />
              </Routes>
          </Layout>
      </Router>
  );
}

export default App;
