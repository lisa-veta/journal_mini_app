import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AttendancePage, SchedulePage } from "./pages/index.jsx"
import { useState, useEffect } from 'react';
import {authorizationTelegram, authTeacher, getTeacherTimetable, timeTable} from './services/api/send.js';
import { CurrentTime } from './services/api/timeApi.js';
import {useDispatch, useSelector} from "react-redux";
import {fetchUserRole, setGroupId, setIsHeadman} from "./services/store/appSlice";

function App(props) {
    const dispatch = useDispatch();
    const groupId = useSelector((state) => state.groupId);
    const isHeadman = useSelector((state) => state.isHeadman);
    const userRole = useSelector((state) => state.userRole);
    const [date, setDate] = useState({});
    const [schedule, setSchedule] = useState(null);
    useEffect(() => {
        (async () => {
            try {
                dispatch(fetchUserRole(props.telegramId));
            } catch (error) {
                console.error(error);
            }
        })();
    }, [props.telegramId]);
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
                } catch (e) {
                    console.log('Ошибка в получении даты: ', e.message);
                }
            })()
        }, []);
    useEffect(() => {
        if(!userRole) {
            return;
        }
        (async () => {
            try {
                if(userRole === 'student') {
                    const authData = await authorizationTelegram(props.telegramId);
                    const groupId = authData?.id_group ?? 5;
                    dispatch(setGroupId(groupId));
                    dispatch(setIsHeadman(true));
                    setSchedule(await timeTable(groupId));
                }
                else {
                    const teacherId = await authTeacher(props.telegramId);
                    dispatch(setIsHeadman(false));
                    setSchedule(await getTeacherTimetable(teacherId));
                }
            } catch (error) {
                console.error(error);
            }
        })();
    }, [userRole]);

    if(schedule === null) {
        return (<>Загрузка расписания...</>);
    }

    return (
      <Router>
          <Routes>
              <Route path="/"
                     element={<SchedulePage
                         groupId={groupId}
                         date={date}
                         schedule={schedule}
                         telegramId={props.telegramId} />}
              />
              <Route path="/attendance/:subjectId"
                     element={<AttendancePage
                         groupId={groupId}
                         date={date}
                         schedule={schedule}
                         isHeadman={isHeadman}
                         telegramId={props.telegramId} />}
              />
          </Routes>
      </Router>
  );
}

export default App;
