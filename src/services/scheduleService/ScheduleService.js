import {createAttendance, getIdAttendanceIfExist} from '../api/send.js';
export class ScheduleService {
    constructor(studentsList, attendance, schedulePair, lesson, date, schedule) {
        this.studentsList = studentsList;
        this.attendance = attendance;
        this.schedulePair = schedulePair;
        this.lesson = lesson;
        this.date = date;
        this.schedule = schedule;
        this.conditionMapping = {
            'Н': 1,
            'Б': 2,
            'УП': 3,
            '+': 0,
        };
    }

    // Метод для получения расписания на основе посещаемости
    async getSchedule(groupId) {
        const schedule = Array.from(
            new Set(this.attendance.map((entry) => entry.form_time_date))
        ).map((uniqueDateTime, index) => {
            const [fullDate, fullTime] = uniqueDateTime.split(" ");
            const [year, month, day] = fullDate.split("-");
            const formattedDate = `${day}.${month}`;
            const formattedTime = fullTime.slice(0, 5);
            const lesson = this.getPairNumber(formattedTime);

            return {
                id: index,
                isLessonCurrent: false,
                date: formattedDate,
                time: formattedTime,
                lesson,
            };
        });
        const now = new Date(this.date.year, this.date.month-1, this.date.day, this.date.hour, this.date.minute);

        let isCurrentLesson;
        try {
            isCurrentLesson = await this.IsLessonCurrent(this.lesson.id, groupId);

        } catch (error) {
            console.error("Ошибка при вызове IsLessonCurrent:", error);
        }
        isCurrentLesson = true;
        for (const pair of this.schedulePair) {
            const lessonStart = new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate(),
                ...pair.start_time.split(":").map(Number)
            );
            const lessonEnd = new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate(),
                ...pair.end_time.split(":").map(Number)
            );


            const currentDate = `${String(now.getDate()).padStart(2, "0")}.${String(now.getMonth() + 1).padStart(2, "0")}`;
            if (isCurrentLesson) {
                for (const entry of schedule) {
                    if (entry.date === currentDate && entry.time === this.formatTime(lessonStart)) {
                         if (now >= lessonStart && now <= lessonEnd) {
                            entry.isLessonCurrent = true;
                            return schedule;
                        }
                    }
                }
            }
            console.debug(now, lessonStart, lessonEnd)
            if (now >= lessonStart && now <= lessonEnd) {
                //if (isCurrentLesson && (this.lesson.id === 7 || this.lesson.id === 8)) {

                if (isCurrentLesson) {
                    const newEntry = {
                        id: schedule.length,
                        isLessonCurrent: true,
                        date: `${String(now.getDate()).padStart(2, "0")}.${String(
                            now.getMonth() + 1
                        ).padStart(2, "0")}`,
                        time: pair.start_time,
                        lesson: pair.lesson,
                    };

                    if(schedule) {
                        schedule.push(newEntry);
                    }
                    else {
                        return newEntry;
                    }
                }
        }
        }

        return schedule;
    }

    formatTime(date) {
        if (!(date instanceof Date)) {
            console.error("lessonStart is not a Date object:", date);
            return null; // Or handle the error in a more suitable way for your application
        }
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    getSortSchedule(schedule) {
        schedule.sort((a, b) => {
            const [dayA, monthA] = a.date.split('.').map(Number);
            const [dayB, monthB] = b.date.split('.').map(Number);

            const dateA = new Date(this.date.year, monthA - 1, dayA);
            const dateB = new Date(this.date.year, monthB - 1, dayB);

            if (dateA - dateB !== 0) {
                return dateA - dateB;
            }

            const lessonNumberA = parseInt(a.lesson.match(/\d+/));
            const lessonNumberB = parseInt(b.lesson.match(/\d+/));

            return lessonNumberA - lessonNumberB;
        });
        return schedule;
    }

    // Метод для поиска занятия по времени
    getPairNumber(time) {
        const [hours, minutes] = time.split(":").map(Number);
        const currentTime = new Date(0, 0, 0, hours, minutes);

        for (const item of this.schedulePair) {
            const [startHours, startMinutes] = item.start_time.split(":").map(Number);
            const [endHours, endMinutes] = item.end_time.split(":").map(Number);

            const startTime = new Date(0, 0, 0, startHours, startMinutes);
            const endTime = new Date(0, 0, 0, endHours, endMinutes);

            if (currentTime >= startTime && currentTime <= endTime) {
                return item.lesson;
            }
        }

        return null;
    }

    // Метод для получения посещаемости студентов
    getAttendStudents(schedule) {
        const attendstudents = this.attendance.map((entry) => {
            const student = this.studentsList.find(
                (student) => student.lastname === entry.lastname
            );

            if (!student) {
                console.error(`Student not found: ${entry.lastname}`);
                return null;
            }

            const [entryDate, entryTime] = entry.form_time_date.split(" ");
            const formattedTime = entryTime.slice(0, 5);
            const [year, month, day] = entryDate.split('-');
            const scheduleEntry = schedule.find(
                (sched) => sched.date === `${day}.${month}` &&
                    sched.time === formattedTime
            );

            if (!scheduleEntry) {
                console.error(`Schedule not found for time: ${entry.form_time_date}`);
                return null;
            }

            return {
                studentId: student.id,
                scheduleId: scheduleEntry.id,
                condition: this.conditionMapping[entry.condition] || 0,
            };
        }).filter(Boolean);
        const seen = new Map();

        attendstudents.forEach((entry) => {
            const key = `${entry.studentId}-${entry.scheduleId}`;
            if (seen.has(key)) {
                seen.set(key, entry);
            } else {
                seen.set(key, entry);
            }
        });

        return Array.from(seen.values());
    }

    GetWeekDayIndex(day_name) {
        switch (day_name) {
            case "Понедельник":
                return 0;
            case "Вторник":
                return 1;
            case "Среда":
                return 2;
            case "Четверг":
                return 3;
            case "Пятница":
                return 4;
            default:
                return 5;
        }
    }

    IsNotCorrectDay(now, targetLesson) {
        return now.getDay() - 1 !== this.GetWeekDayIndex(targetLesson.week_day);
    }

    IsNotCorrectTime(now, targetLesson) {
        const lessonMinutesStart =
            parseInt(targetLesson.lesson_start_time.split(":")[0]) * 60 +
            parseInt(targetLesson.lesson_start_time.split(":")[1]);
        const lessonMinutesEnd =
            parseInt(targetLesson.lesson_end_time.split(":")[0]) * 60 +
            parseInt(targetLesson.lesson_end_time.split(":")[1]);
        const nowMinutes = now.getHours() * 60 + now.getMinutes();

        return nowMinutes < lessonMinutesStart || nowMinutes > lessonMinutesEnd;
    }

    IsNotCorrectWeek(now, targetLesson) {
        const septemberStart = new Date(now.getFullYear(), 8, 1, 23);
        const diffInMs = now - septemberStart;
        const weekInMs = 1000 * 60 * 60 * 24 * 7;
        const diffInWeeks = Math.floor(diffInMs / weekInMs);

        const isFirstWeekEducational = !(septemberStart.getDay() % 7 === 0);
        const weekType = isFirstWeekEducational
            ? diffInWeeks % 2 === 0
                ? 2
                : 1
            : diffInWeeks % 2 !== 0
                ? 2
                : 1;

        return weekType !== targetLesson.number_week;
    }

    async IsLessonCurrent(lessonId, groupId) {
        // Найти занятие по ID
        const parsedData = this.schedule;

        let targetLesson = parsedData.find(parsedData => parsedData.id === lessonId);
        let now = new Date(this.date.year, this.date.month-1, this.date.day, this.date.hour, this.date.minute);
        //console.debug("fff", targetLesson)

        if (!targetLesson) {
            console.error(`Lesson with ID ${lessonId} not found`);
            return false;
        }

        return this.IsCurrentLesson(now, targetLesson);
    }

    IsCurrentLesson(now, targetLesson) {
        if (this.IsNotCorrectWeek(now, targetLesson)) {
            return false;
        }

        if (this.IsNotCorrectDay(now, targetLesson)) {
            return false;
        }

        if (this.IsNotCorrectTime(now, targetLesson)) {
            return false;
        }

        return true;
    }


    async FindCurrentLesson(groupId) {
        const parsedData = this.schedule;

        const now = new Date(this.date.year, this.date.month - 1, this.date.day, this.date.hour, this.date.minute);
        for (let i = 0; i < parsedData.length; i++) {
            if (this.IsCurrentLesson(now, parsedData[i])) {
                return parsedData[i];
            }
        }

        return null;
    }

    async getAttendanceId(schedule, classLessonId){
        const currentLesson = schedule.find((schedule) => schedule.isLessonCurrent === true);
        console.log(schedule, "schedule", currentLesson)
        if(currentLesson) {
            const [day, month] = currentLesson.date.split('.');
            const [hour, minute] = currentLesson.time.split(':');

            const currentYear = new Date().getFullYear();
            const timedate = `${currentYear}-${month}-${day} ${hour}:${minute}:00`;
            console.log(timedate)
            try {
                return await getIdAttendanceIfExist(classLessonId, timedate);
            } catch (error) {
                return await createAttendance(classLessonId, timedate);
            }
        }
    }

    GetCurrentWeekNumber(now) {
        const septemberStart = new Date(now.getFullYear(), 8, 1, 23);
        const diffInMs = now - septemberStart;
        const weekInMs = 1000 * 60 * 60 * 24 * 7;
        const diffInWeeks = Math.floor(diffInMs / weekInMs);

        const isFirstWeekEducational = !(septemberStart.getDay() % 7 === 0);
        return isFirstWeekEducational
            ? diffInWeeks % 2 === 0
                ? 2
                : 1
            : diffInWeeks % 2 !== 0
                ? 2
                : 1;
    }
}
