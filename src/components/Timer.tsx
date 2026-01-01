import {useState, useRef, useEffect, useReducer} from "react";
import TimerDisplay from "./timerDisplay";
import TimerInput from "./timerInput";
import type { TimerState, TimerAction } from "../types";

const initialTimerState: TimerState = {
    status: "WAITING"
};

const timerReducer = (state: TimerState, action: TimerAction): TimerState => {
    switch (action.type){
        case "SET_TIME":
            return {...state, status: "WAITING"};
        case "START":
            return {...state, status: "RUNNING"}
        case "PAUSE":
            return {...state, status: "PAUSED"};
        case "RESUME":
            return {...state, status: "RUNNING"};
        case "RESET":
            return {...state, status: "IDLE"};
        case "FINISH":
            return {...state, status: "COMPLETED"};
        default:
            return state;
    }
};

interface TimerProps {
    needsResponse: boolean,
    setNeedsResponse: React.Dispatch<React.SetStateAction<boolean>>
}

const Timer: React.FC<TimerProps> = ({needsResponse, setNeedsResponse}) => {

    const [state, dispatch] = useReducer(timerReducer, initialTimerState);

    const [startTime, setStartTime] = useState<number>(0);
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const intervalRef = useRef<number | null>(null);

    const handleTimeSet = (seconds: number): void => {
        if (seconds <= 0){
            alert("Please set a time greater than 0 seconds.");
            return;
        } 
        alert(`Timer set for ${Math.floor(seconds / 60)} minutes ${seconds % 60} seconds.`);
        setStartTime(seconds);
        setTimeLeft(seconds);
    };

    const startTimer = () => {
        if (timeLeft > 0){
            dispatch({ type: "START" })
        }
    };

    const pausetimer = () => {
        dispatch({ type: "PAUSE" })
    };

    const resumeTimer = () => {
        dispatch({ type: "RESUME" })
    };

    const resetTimer = () => {
        setTimeLeft(startTime);
        dispatch({ type: "RESET" });
    };

    const setTimer = () => {
        dispatch({ type: "SET_TIME" });
    };

    useEffect(() => {
        if (!needsResponse){
            dispatch({ type: "RESET" })
        }
    }, [needsResponse]);

    useEffect(() => {
        if (state.status === "RUNNING" && timeLeft > 0){
            intervalRef.current = window.setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (state.status === "RUNNING" && timeLeft <= 0){
            dispatch({ type: "FINISH"});
            setNeedsResponse(true);
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [state.status , timeLeft]);


    if (state.status === "WAITING" ){
        return (
            <div className="flex flex-col items-center justify-center">
                <TimerInput onTimeSet={(seconds) => handleTimeSet(seconds)} />
                <button className="mt-3 w-50 rounded bg-orange-400 p-2 font-bold text-white cursor-pointer" onClick={startTimer} disabled={timeLeft === 0}>Start</button>
            </div>
        )
    } else {
        return (
            <div className="flex flex-col items-center justify-center">
                <TimerDisplay currTime={timeLeft} />

                {
                    state.status === "COMPLETED" ?
                    <p>Your Laundry has completed Washing! Please Take it out!</p>

                    :

                    <div className="flex items-center flex-col">
                        <button
                            className="mt-3 w-50 rounded bg-orange-400 p-2 font-bold text-white cursor-pointer" 
                            onClick=
                            {
                                state.status === "RUNNING" ?
                                pausetimer 
                                : 
                                state.status === "IDLE" ? 
                                startTimer 
                                : 
                                resumeTimer
                            }
                        >
                            {
                                state.status === "RUNNING" ? 
                                "Pause" 
                                :  
                                state.status === "IDLE" ? 
                                "Start" 
                                : 
                                "Resume"
                            }
                        </button>
                
                        <button className="mt-3 w-50 rounded bg-orange-400 p-2 font-bold text-white cursor-pointer" onClick={resetTimer}>Reset</button>
                        <button className="mt-3 w-50 rounded bg-orange-400 p-2 font-bold text-white cursor-pointer" onClick={setTimer}>Stop & Set new Timer</button>
                    </div>
                }
                
            </div>
        )
    }
};

export default Timer;