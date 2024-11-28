import "./CustomInfo.css"

const CustomInfo = ({ caption, content }) => {
    return (
        <div className="сustomInfo">
            <div className="сustomInfo__caption">
                {caption}
            </div>
            <div className="сustomInfo__content">
                <p className="сustomInfo__text">{content}</p>
            </div>
        </div>
    );
};

export default CustomInfo;