function Lesson(props) {

    if (!props.lesson) {
        return (
            <div className='lesson-container'>Занятий нет</div>
        );
    }

    let lessonType;
    switch (props.lesson.type_id) {
        case 1:
            lessonType = 'Лекция';
            break;
        case 2:
            lessonType = 'Практика';
            break;
        case 3:
            lessonType = 'Лабораторная работа';
            break;
        default:
            lessonType = 'Другое'
    }

    return (
        <div className='lesson-container'>
            <div className='time-container'>
                <div className='lesson-time-start'>{props.lesson.start_time}</div>
                <div className='lesson-time-end'>{props.lesson.end_time}</div>
            </div>

            <div className='lesson-info-container'>
                <div className='lesson-info-row'>
                    <div className='lesson-name'>{props.lesson.name}</div>
                    <div className='lesson-teacher'>{props.lesson.teacher}</div>
                </div>
                <div className='lesson-room-and-type'>{props.lesson.room}, {lessonType}</div>
            </div>
        </div>
    );
}

export default Lesson;