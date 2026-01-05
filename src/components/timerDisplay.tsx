import { useState, useEffect } from "react";


const TimerDisplay: React.FC<{currTime: number}> = ({currTime}) => {
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const [displayTime, setDisplayTime] = useState<string>("00:00");

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;

        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    useEffect(() => {
        setDisplayTime(formatTime(timeLeft));
    }, [timeLeft]);

    useEffect(() => {
        setTimeLeft(currTime);
    }, [currTime]);



    return (
        <>
            <div className="p-5 text-5xl font-bold text-orange-500 dark:text-orange-400">
                {displayTime}
            </div>
        </>
    )
}


export default TimerDisplay;