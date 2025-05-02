import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AttendancePage, SchedulePage } from "./pages/index.jsx"
import { useState, useEffect } from 'react';
import {
    authorizationTelegram,
    authTeacher,
    getTeacherDisciplinesGroups,
    getTeacherTimetable,
    timeTable
} from './services/api/send.js';
import { CurrentTime } from './services/api/timeApi.js';
import {useDispatch, useSelector} from "react-redux";
import {fetchUserRole, setGroupId, setIsHeadman, setTeacherId} from "./services/store/appSlice";
import {ScheduleService} from "./services/scheduleService/ScheduleService";

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
                    const date = {
                        year: parseInt(data.year),
                        month: parseInt(data.month),
                        day: parseInt(data.day),
                        hour: parseInt(data.hour),
                        minute: parseInt(data.minute)
                    };
                    // тест отметок
                    // date.month = 4;
                    // date.day = 28;
                    // date.hour = 18;
                    // date.minute = 50;
                    // console.log(date);
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
                    const authData = await authTeacher(props.telegramId);
                    const teacherId = authData.teacher_id;
                    dispatch(setTeacherId(teacherId));
                    dispatch(setIsHeadman(true));

                    const teacherSchedule = await getTeacherTimetable(teacherId);
                    for (let i = 0; i < teacherSchedule.length; i++) {
                        teacherSchedule[i].lesson = teacherSchedule[i].discipline_name;                    schedule[i].id_lesson = teacherLessons[j].discipline_id;
                        schedule[i].id_lesson = teacherSchedule[i].discipline_id;
                        delete teacherSchedule[i].discipline_name;
                        teacherSchedule[i].id = teacherSchedule[i].class_id;
                    }
                    console.log(userRole, teacherSchedule)
                    setSchedule(teacherSchedule);
                }
            } catch (error) {
                console.error(error);
            }
        })();
    }, [userRole]);

    if(schedule === null) {
        return <div>Загрузка расписания</div>;
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
