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
                const parsedData = await openFullAttendance(lesson.id);
                const attendanceData = JSON.parse(JSON.stringify(parsedData));
                //console.debug('!!!!!посещаемость с сервера!!!', attendanceData);
                setAttendance(attendanceData);
            } catch (error) {
                console.error(error);
            }
        })();
    }, [lesson]);

    const scheduleService = new ScheduleService(studentsList, attendance, schedulePair);
    const schedule = scheduleService.getSchedule(lesson.id, groupId);
    const attendStudents = scheduleService.getAttendStudents(schedule);

    //console.log("attendStudents", attendStudents);
    const currentLesson = schedule.find((entry) => entry.isLessonCurrent === true);
    const currentLessonId = currentLesson ? currentLesson.id : null;
    //console.debug("расписание", schedule);
    return (
        <Layout>
            <div className="attendancePage">
                <p className="attendancePage__subject-name">{lesson.name}</p>
                <div className="attendancePage__teacher">
                    <CustomInfo caption="Преподаватель" content={lesson.teacher}/>
                </div>
                <div className="attendancePage__table">
                    <AttendanceTable students={studentsList} schedule={schedule} currentLessonId={currentLessonId} lessonId={lesson.id} attendStudents={attendStudents}/>
                </div>
            </div>
        </Layout>
    );
};

export default AttendancePage;