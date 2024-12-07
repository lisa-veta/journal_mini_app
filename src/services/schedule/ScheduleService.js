import { timeTable } from '../api/send.js';
const groupId = 5;

export function GetWeekDayIndex(day_name) {
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

export function IsLessonCurrent(lessonId) {

    const IsNotCorrectDay = (now, targetLesson) => {

        return now.getDay() - 1 !== GetWeekDayIndex(targetLesson.week_day);
    };

    const IsNotCorrectTime = (now, targetLesson) => {

        let lessonMinutesStart = parseInt(targetLesson.lesson_start_time.split(':')[0]) * 60
            + parseInt(targetLesson.lesson_start_time.split(':')[1]);
        let lessonMinutesEnd = parseInt(targetLesson.lesson_end_time.split(':')[0]) * 60
            + parseInt(targetLesson.lesson_end_time.split(':')[1]);
        let nowMinutes = now.getHours() * 60 + now.getMinutes();

        return nowMinutes < lessonMinutesStart || nowMinutes > lessonMinutesEnd;
    };

    const IsNotCorrectWeek = (now, targetLesson) => {

        let septemberStart = new Date(new Date().getFullYear(), 8, 1, 23);

        const diffInMs = now - septemberStart;
        let weekInMs = 1000 * 60 * 60 * 24 * 7;
        const diffInWeeks = Math.floor(diffInMs / weekInMs);

        let isFirstWeekEducational = !(septemberStart.getDay() % 7 === 0);
        let weekType;
        if (isFirstWeekEducational) {
            weekType = (diffInWeeks % 2 === 0) ? 2 : 1;
        }
        else {
            weekType = (diffInWeeks % 2 !== 0) ? 2 : 1;
        }
        //console.log('1 неделя учебная:', isFirstWeekEducational);
        //console.log('неделя сейчас', weekType);

        return weekType !== targetLesson.number_week;
    };

    (async () => {
        try {
            const data = await timeTable(groupId);
            const parsedData = JSON.parse(JSON.stringify(data));

            let targetLesson = parsedData.find(parsedData => parsedData.id === lessonId);
            let now = new Date();
            //console.log('нужая пара', JSON.stringify(targetLesson));

            if (IsNotCorrectWeek(now, targetLesson)) {
                //console.log('не та неделя');
                return false;
            }

            if (IsNotCorrectDay(now, targetLesson)) {
                //console.log('не тот день');
                return false;
            }

            if (IsNotCorrectTime(now, targetLesson)) {
                //console.log('не то время');
                return false
            }

            //console.log('сейчас эта пара.');
            return true;
        } catch (error) {
            console.error(error);
        }
    })();
}