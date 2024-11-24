//import { ArrowIcon } from "#assets/images/icons"; -- пока алиасы не хотят работать
import { ArrowIcon } from "../../assets/images/icons/index.jsx";
const SchedulePage = ({ students = [], days =[] }) => {
    return (
        <div className="">
            <div className="">
                Привет
                {ArrowIcon}
            </div>
            <div className="">
                Пока
            </div>
        </div>
    );
};

export default SchedulePage;