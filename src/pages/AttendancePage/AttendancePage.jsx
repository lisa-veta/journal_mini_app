import { AttendanceTable } from "components/index.jsx";
import { CustomInfo } from "components/index.jsx";
import { Layout } from "../index.jsx";
import "./AttendancePage.css"
import students from "../../services/api/send.js";
import { useState } from "react";

const AttendancePage = () => {

    const [studentsList, setStudentsList] = useState([]);
    const groupId = 5;

    (async () => {
        try {
            const data = await students(groupId);

            const parsedData = JSON.parse(JSON.stringify(data));
            const tempStudents = parsedData.map(({ id, name }) => {
                return { id: id, name: name };
            });

            setStudentsList(tempStudents);
            console.log(studentsList);
        } catch (error) {
            console.error(error);
        }
    })();
    console.error(studentsList);

    const schedule = [
        { id: 1, date: "01.12.2024", lesson: "1 пара" },
        { id: 2, date: "02.12.2024", lesson: "2 пара" },
        { id: 3, date: "03.12.2024", lesson: "3 пара" },
        { id: 4, date: "04.12.2024", lesson: "4 пара" },
        { id: 5, date: "04.12.2024", lesson: "5 пара" },
        { id: 6, date: "04.12.2024", lesson: "6 пара" },
        { id: 7, date: "04.12.2024", lesson: "7 пара" },
        { id: 8, date: "04.12.2024", lesson: "8 пара" }
    ];

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
    //передаю группу, передаю айди предмета
    return (
        <Layout>
            <div className="attendancePage">
                <p className="attendancePage__subject-name">Английский язык</p>
                <div className="attendancePage__teacher">
                    <CustomInfo caption="Преподаватель" content="Лариса Гузеева"/>
                </div>
                <div className="attendancePage__table">
                    <AttendanceTable students={studentsList} schedule={schedule} currentLessonId={currentLessonId}/>
                </div>
            </div>
        </Layout>
    );
};

export default AttendancePage;