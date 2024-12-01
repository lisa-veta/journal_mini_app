import { AttendanceTable } from "components/index.jsx";
import { CustomInfo } from "components/index.jsx";
import { Layout } from "../index.jsx";
import "./AttendancePage.css"
import students, { openFullAttendance } from "../../services/api/send.js";
import { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import { ScheduleService } from "../../services/scheduleService/ScheduleService";

const AttendancePage = () => {
    const location = useLocation();
    const lesson = location.state?.lesson;
    const [attendance, setAttendance] = useState([]);
    const [studentsList, setStudentsList] = useState([]);
    const groupId = 5;
    console.debug(lesson)
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

    const schedulePair = [
        { id: 1, start_time: "08:00", end_time: "09:30", lesson: "1 пара" },
        { id: 2, start_time: "09:40", end_time: "11:10", lesson: "2 пара" },
        { id: 3, start_time: "11:20", end_time: "12:50", lesson: "3 пара" },
        { id: 4, start_time: "13:15", end_time: "14:50", lesson: "4 пара" },
        { id: 5, start_time: "15:00", end_time: "16:30", lesson: "5 пара" },
        { id: 5, start_time: "16:40", end_time: "18:10", lesson: "6 пара" },
        { id: 5, start_time: "18:20", end_time: "19:50", lesson: "7 пара" },
        { id: 5, start_time: "19:55", end_time: "21:25", lesson: "8 пара" },
    ];

    useEffect(() => {
        (async () => {
            try {
                const parsedData = await openFullAttendance(lesson.id);
                const attendanceData = JSON.parse(JSON.stringify(parsedData));
                console.debug('!!!!!посещаемость с сервера!!!', attendanceData);
                setAttendance(attendanceData);
            } catch (error) {
                console.error(error);
            }
        })();
    }, [lesson]);

    const scheduleService = new ScheduleService(studentsList, attendance, schedulePair);
    const attendStudents = scheduleService.getAttendStudents();

    console.log("attendStudents", attendStudents);

    let currentLessonId = 0;
    
    const currentMinutes = new Date().getHours() * 60 + new Date().getMinutes();
    if (currentMinutes >= (7 * 60 + 50) && currentMinutes <= (9 * 60 + 30)) {
        currentLessonId = 1;
    }
    else if (currentMinutes >= (9 * 60 + 30) && currentMinutes <= (11 * 60 + 10)) {
        currentLessonId = 2;
    }
    else if (currentMinutes >= (11 * 60 + 10) && currentMinutes <= (12 * 60 + 50)) {
        currentLessonId = 3;
    }
    else if (currentMinutes >= (12 * 60 + 50) && currentMinutes <= (14 * 60 + 45)) {
        currentLessonId = 4;
    }
    else if (currentMinutes >= (14 * 60 + 45) && currentMinutes <= (16 * 60 + 30)) {
        currentLessonId = 5;
    }
    else if (currentMinutes >= (16 * 60 + 30) && currentMinutes <= (18 * 60 + 10)) {
        currentLessonId = 6;
    }
    else if (currentMinutes >= (18 * 60 + 10) && currentMinutes <= (19 * 60 + 50)) {
        currentLessonId = 7;
    }
    else if (currentMinutes >= (19 * 60 + 50) && currentMinutes <= (21 * 60 + 25)) {
        currentLessonId = 8;
    }
    const schedule = scheduleService.getSchedule();
    console.debug("расписание", schedule);
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