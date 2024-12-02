export const getCellText = (state) => {
    let text = '';

    switch (state) {
        case 1:
            text = "н"; // Неявка
            break;
        case 2:
            text = "б"; // Больничный
            break;
        case 3:
            text = "уп"; // Упражнение
            break;
        default:
            text = ''; // Пустое состояние
            break;
    }

    return text;
};

export  const getCellStyle = (state, isActive) => {
    let style = {};

    if (isActive) {
        // Для активных ячеек
        switch (state) {
            case 1:
                style = { backgroundColor: "rgba(230, 145, 145, 1)" }; // Яркий красный для неявки
                break;
            case 2:
                style = { backgroundColor: "rgba(255, 236, 152, 1)" }; // Яркий желтый для больничного
                break;
            case 3:
                style = { backgroundColor: "rgba(170, 234, 255, 1)" }; // Яркий голубой для упражнения
                break;
            default:
                break;
        }
    } else {
        // Для неактивных ячеек
        switch (state) {
            case 1:
                style = { backgroundColor: "rgba(230, 145, 145, 0.5)" }; // Полупрозрачный красный
                break;
            case 2:
                style = { backgroundColor: "rgba(255, 236, 152, 0.5)" }; // Полупрозрачный желтый
                break;
            case 3:
                style = { backgroundColor: "rgba(170, 234, 255, 0.5)" }; // Полупрозрачный голубой
                break;
            default:
                style = { backgroundColor: "rgba(224, 224, 224, 0.5)" }; // Полупрозрачный стандартный фон
                break;
        }

        // Дополнительный стиль для серого фона для неактивных ячеек
        style = { ...style, cursor: "not-allowed" };
    }

    return style;
};