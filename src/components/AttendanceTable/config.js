export const getCellText = (state) => {
    let text = '';

    switch (state) {
        case 1:
            text = "н";
            break;
        case 2:
            text = "б";
            break;
        case 3:
            text = "уп";
            break;
        case 4:
            text = '';
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
                style = { backgroundColor: "rgba(230, 145, 145, 1)" };
                break;
            case 2:
                style = { backgroundColor: "rgba(255, 236, 152, 1)" };
                break;
            case 3:
                style = { backgroundColor: "rgba(170, 234, 255, 1)" };
                break;
            default:
                break;
        }
    } else {
        // Для неактивных ячеек
        switch (state) {
            case 1:
                style = { backgroundColor: "rgba(230, 145, 145, 0.5)" };
                break;
            case 2:
                style = { backgroundColor: "rgba(255, 236, 152, 0.5)" };
                break;
            case 3:
                style = { backgroundColor: "rgba(170, 234, 255, 0.5)" };
                break;
            default:
                style = { backgroundColor: "rgba(224, 224, 224, 0.5)" };
                break;
        }

        // Дополнительный стиль для серого фона для неактивных ячеек
        style = { ...style, cursor: "not-allowed" };
    }

    return style;
};