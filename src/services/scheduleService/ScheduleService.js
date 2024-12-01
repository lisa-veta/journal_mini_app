export class ScheduleService {
    constructor(studentsList, attendance, schedulePair) {
        this.studentsList = studentsList;
        this.attendance = attendance;
        this.schedulePair = schedulePair;
        this.conditionMapping = {
            'Н': 1,
            'Б': 2,
            'УП': 3,
            '+': 0,
        };
    }

    // Метод для получения расписания на основе посещаемости
    getSchedule() {
        return Array.from(
            new Set(this.attendance.map((entry) => entry.form_time_date))
        ).map((uniqueDateTime, index) => {
            const [fullDate, fullTime] = uniqueDateTime.split(" ");
            const [year, month, day] = fullDate.split("-");
            const formattedDate = `${day}.${month}`;
            const formattedTime = fullTime.slice(0, 5);
            const lesson = this.getLesson(formattedTime);

            return {
                id: index, // Уникальный ID
                date: formattedDate,
                time: formattedTime,
                lesson,
            };
        });
    }

    // Метод для поиска занятия по времени
    getLesson(time) {
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
    getAttendStudents() {
        const schedule = this.getSchedule();

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
            const result = `${day}.${month}`;
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

        const uniqueAttendStudents = [];
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
}
