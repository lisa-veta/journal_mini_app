import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AttendancePage, SchedulePage } from "./pages/index.jsx"
import { useState, useEffect } from 'react';
import { timeTable } from './services/api/send.js';
import { CurrentTime } from './services/api/timeApi.js';
function App(props) {
    const [date, setDate] = useState({});
    const [schedule, setSchedule] = useState(null);
    useEffect(() => {
        (async () => {
            try {
                const data = await timeTable(props.groupId);
                const parsedData = JSON.parse(JSON.stringify(data));
                setSchedule(parsedData);
                //IsLessonCurrent(7);
            } catch (error) {
                console.error(error);
            }
        })();
    }, [props.groupId]);
    useEffect(
        () => {
            (async () => {
                try {
                    const data = await CurrentTime();
                    const parsedData = JSON.parse(JSON.stringify(data));
                    const date = {
                        year: parseInt(parsedData.currentLocalTime.split('-')[0]),
                        month: parseInt(parsedData.currentLocalTime.split('-')[1]),
                        day: parseInt(parsedData.currentLocalTime.split('T')[0].split('-')[2]),
                        hour: parseInt(parsedData.currentLocalTime.split('T')[1].split(':')[0]),
                        minute: parseInt(parsedData.currentLocalTime.split('T')[1].split(':')[1])
                    };
                    setDate(date);
                    console.log("date",JSON.stringify(date));
                } catch (e) {
                    console.log('Ошибка в получении даты: ', e.message);
                }
            })()
        }, []);

    return (
      <Router>
          <Routes>
                <Route path="/"
                    element={<SchedulePage
                        groupId={props.groupId}
                        date={date}
                        schedule={schedule} />}
                />
                <Route path="/attendance/:subjectId"
                    element={<AttendancePage
                        groupId={props.groupId}
                        date={date}
                        schedule={schedule}
                        isHeadman={props.isHeadman} />}
                />
          </Routes>
      </Router>
  );
}

export default App;
