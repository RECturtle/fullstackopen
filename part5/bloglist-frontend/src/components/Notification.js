const Notification = ({ message, isError }) => {
    if (message === null) {
        return null;
    }

    return <div className={isError ? "error" : "good"}>{message}</div>;
};

export default Notification;