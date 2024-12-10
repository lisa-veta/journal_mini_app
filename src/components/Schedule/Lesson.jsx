import { useNavigate } from "react-router-dom";
function Lesson(props) {
    const navigate = useNavigate();

    if (!props.lesson) {
        return (
            <div className='lesson-container' style={props.style}>
                Нет текущей пары
            </div>
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

    const handleSubjectClick = () => {
        console.log(JSON.stringify(props));
        console.debug("АЙДИ", props.lesson.id);
        navigate(`/attendance/${props.lesson.id}`, { state: { lesson: props.lesson } });
    };

    const style = props.lesson.style !== null ? props.lesson.style : { backgroundColor: '#F6F6F6' };
    return (
        <div className='lesson-container' style={style} onClick={() => handleSubjectClick()}>
            <div className='time-container'>
                <div className='lesson-time-start'>{props.lesson.start_time.slice(0, 5)}</div>
                <div className='lesson-time-end'>{props.lesson.end_time.slice(0, 5)}</div>
            </div>
            <div className='lesson-info-container'>
                <div className='lesson-name'>{props.lesson.name}</div>
                <div className='lesson-room-and-type'>{props.lesson.room}, {lessonType}</div>
            </div>
            <div className='lesson-teacher'>
                {props.lesson.teachers.map(t => t.lastname).join(', ')}
            </div>
        </div>
    );
}

export default Lesson;