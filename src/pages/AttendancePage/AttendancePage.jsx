import { AttendanceTable } from "components/index.jsx";
import { CustomInfo } from "components/index.jsx";
import { Layout } from "../index.jsx";
import "./AttendancePage.css"
import students, { openFullAttendance } from "../../services/api/send.js";
import { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import { ScheduleService } from "../../services/scheduleService/ScheduleService";
import { schedulePair } from "./config"
const AttendancePage = () => {
    const location = useLocation();
    const lesson = location.state?.lesson;
    const [attendance, setAttendance] = useState([]);
    const [studentsList, setStudentsList] = useState([]);
    const [schedule, setSchedule] = useState([]);
    const [currentLessonId, setCurrentLessonId] = useState(null);
    const groupId = 5;
    console.debug("lesson",lesson)
    // Однократное заполнение студентиков
    useEffect(() => {
        (async () => {
            try {
                const data = await students(groupId);

                const parsedData = JSON.parse(JSON.stringify(data));
                const tempStudents = parsedData.map(({ id, name, lastname, patronymic }) => {
                    return { id: id, name: name, lastname: lastname, patronymic: patronymic };
                });

                setStudentsList(tempStudents);
            } catch (error) {
                console.error(error);
            }
        })();
    }, []);

    useEffect(() => {
        (async () => {
            try {
                const parsedData = await openFullAttendance(lesson.id_lesson);
                const attendanceData = JSON.parse(JSON.stringify(parsedData));
                //console.debug('!!!!!посещаемость с сервера!!!', attendanceData);
                setAttendance(attendanceData);
            } catch (error) {
                console.error(error);
            }
        })();
    }, [lesson]);
    useEffect(() => {
        const fetchSchedule = async () => {
            if (studentsList.length > 0 && attendance.length > 0) {
                const scheduleService = new ScheduleService(studentsList, attendance, schedulePair, lesson);
                try {
                    const newSchedule = await scheduleService.getSchedule(groupId);
                    setSchedule(newSchedule);

                    console.debug("newSchedule", newSchedule);

                    if (Array.isArray(newSchedule) && newSchedule.length > 0) {
                        const currentLesson = newSchedule.find((entry) => entry.isLessonCurrent === true);
                        setCurrentLessonId(currentLesson ? currentLesson.id : null);
                    } else {
                        console.error("newSchedule не является массивом:", newSchedule);
                    }
                } catch (error) {
                    console.error("Ошибка при получении расписания:", error);
                }
            }
        };

        fetchSchedule();  // Вызываем асинхронную функцию
    }, [studentsList, attendance]);

    const scheduleService = new ScheduleService(studentsList, attendance, schedulePair, lesson);
    //const schedule = scheduleService.getSchedule(groupId);
    const attendStudents = scheduleService.getAttendStudents(schedule);

    //console.log("attendStudents", attendStudents);
    console.log("attendStudents", attendance);
    //const currentLesson = schedule.find((entry) => entry.isLessonCurrent === true);
    //const currentLessonId = currentLesson ? currentLesson.id : null;
    console.debug("currentLessonId!!!!!!!!!!!!!!!!!!", currentLessonId);
    return (
        <Layout>
            <div className="attendancePage">
                <p className="attendancePage__subject-name">{lesson.name}</p>
                <div className="attendancePage__teacher">
                    <CustomInfo caption="Преподаватель" content={lesson.teacher}/>
                </div>
                <div className="attendancePage__table">
                    <AttendanceTable lesson={lesson} students={studentsList} schedule={schedule} currentLessonId={currentLessonId} lessonId={lesson.id} attendStudents={attendStudents}/>
                </div>
            </div>
        </Layout>
    );
};

export default AttendancePage;