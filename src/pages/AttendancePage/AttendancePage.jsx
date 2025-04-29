import { AttendanceTable } from "components/index.jsx";
import "./AttendancePage.css"
import students, { openFullAttendance } from "../../services/api/send.js";
import { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import { ScheduleService } from "../../services/scheduleService/ScheduleService";
import { schedulePair } from "./config"
const AttendancePage = (props) => {
    const date = props.date;
    const location = useLocation();
    const lesson = location.state?.lesson;
    const [attendance, setAttendance] = useState([]);
    const [studentsList, setStudentsList] = useState([]);
    const [schedule, setSchedule] = useState([]);
    const [currentLessonId, setCurrentLessonId] = useState(null);
    const timeTable = props.schedule;
    const isHeadman = props.isHeadman;
    const telegramId = props.telegramId;
    const groupId = props.groupId || lesson.group_id;

    console.log("timeTable", timeTable)

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
                setAttendance(attendanceData);
            } catch (error) {
                console.error(error);
            }
        })();
    }, [lesson]);
    useEffect(() => {
        const fetchSchedule = async () => {
            const scheduleService = new ScheduleService(studentsList, attendance, schedulePair, lesson, date, timeTable);
            if (studentsList.length > 0 && attendance.length > 0) {
                try {
                    const newSchedule = await scheduleService.getSchedule(groupId);
                    const ss = scheduleService.getSortSchedule(newSchedule)
                    setSchedule(ss);
                } catch (error) {
                    console.error("Ошибка при получении расписания:", error);
                }
                if (Array.isArray(schedule) && schedule.length > 0) {
                    const currentLesson = schedule.find((entry) => entry.isLessonCurrent === true);
                    setCurrentLessonId(currentLesson ? currentLesson.id : null);
                } else {
                    console.error("newSchedule не является массивом:", schedule);
                }
            }
            if (attendance.length <= 0) {
                try {
                    const newSchedule = await scheduleService.getEmptySchedule(groupId);
                    const ss = scheduleService.getSortSchedule(newSchedule)
                    setSchedule(ss);
                } catch (error) {
                    console.error("Ошибка при получении расписания:", error);
                }
                if (Array.isArray(schedule) && schedule.length > 0) {
                    const currentLesson = schedule.find((entry) => entry.isLessonCurrent === true);
                    console.debug(currentLesson, "currentLesson")
                    setCurrentLessonId(currentLesson ? currentLesson.id : null);
                } else {
                    console.error("newSchedule не является массивом:", schedule);
                }
            }

        };

        fetchSchedule();
    }, [studentsList, attendance]);


    const scheduleService = new ScheduleService(studentsList, attendance, schedulePair, lesson, date, timeTable);

    const attendStudents = scheduleService.getAttendStudents(schedule);
    return (
        <AttendanceTable lesson={lesson} students={studentsList} schedule={schedule} currentLessonId={currentLessonId} lessonId={lesson.id} attendStudents={attendStudents} isHeadman={isHeadman} telegramId={telegramId}/>
    );
};

export default AttendancePage;