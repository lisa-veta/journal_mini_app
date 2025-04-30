import { Lesson } from "components/index.jsx";

function Day(props) {

    let dayName;
    switch (props.day.day_number) {
        case 1:
            dayName = 'Понедельник';
            break;
        case 2:
            dayName = 'Вторник';
            break;
        case 3:
            dayName = 'Среда';
            break;
        case 4:
            dayName = 'Четверг';
            break;
        case 5:
            dayName = 'Пятница';
            break;
        default:
            dayName = 'Суббота';
    }

    const sortedLessons = [...props.day.subjects].sort((a, b) => a.start_time.localeCompare(b.start_time));
    return (
        <div className='day-container day-container_position'>
            <span className='day-container__day-name'>{dayName}</span>

            {sortedLessons.map(lesson => (
                <div key={lesson.id} className='lesson-wrapper'>
                    <Lesson lesson={lesson}/>
                </div>
            ))}

        </div>
    );
}

export default Day;