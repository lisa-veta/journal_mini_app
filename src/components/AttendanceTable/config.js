export const getCellText = (state) => {
    let text = '';

    switch (state) {
        case 0:
        case 1:
            text = '+';
            break;
        case 2:
            text = "н";
            break;
        case 3:
            text = "б";
            break;
        case 4:
            text = "уп";
            break;
        default:
            text = '+';
            break;
    }

    return text;
};

export  const getCellStyle = (state, isActive) => {
    let style = {};
    if (isActive) {
        switch (state) {
            case 1:
                style = { backgroundColor: "rgb(145,230,146)"};
                break;
            case 2:
                style = { backgroundColor: "rgba(230, 145, 145, 1)"};
                break;
            case 3:
                style = { backgroundColor: "rgba(255, 236, 152, 1)"};
                break;
            case 4:
                style = { backgroundColor: "rgba(170, 234, 255, 1)"};
                break;
            default:
                style = { backgroundColor: "rgb(255,255,255)", color: "rgb(255,255,255)"};
                break;
        }
        style.border = "2px solid rgb(112,112,112)"
        style.borderWidth = "2px";
    } else {
        switch (state) {
            case 1:
                style = { backgroundColor: "rgb(145,230,146, 0.5)"};
                break;
            case 2:
                style = { backgroundColor: "rgba(230, 145, 145, 0.5)" };
                break;
            case 3:
                style = { backgroundColor: "rgba(255, 236, 152, 0.5)" };
                break;
            case 4:
                style = { backgroundColor: "rgba(170, 234, 255, 0.5)" };
                break;
            default:
                style = { backgroundColor: "rgba(224, 224, 224, 0.5)", color: "rgba(224, 224, 224, 0.5)"};
                break;
        }
        // Дополнительный стиль для серого фона для неактивных ячеек
        style = { ...style, cursor: "not-allowed" };
    }
    style.textAlign = "center";
    style.verticalAlign = "middle";
    return style;
};