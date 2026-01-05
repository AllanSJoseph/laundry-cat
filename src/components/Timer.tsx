import {useState, useRef, useEffect, useReducer} from "react";
import toast from 'react-hot-toast';
import {Bell, Play, Pause, RotateCcw, Clock} from 'lucide-react';
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
            toast.error("Please set a time greater than 0 seconds.")
            return;
        }
        setStartTime(seconds);
        setTimeLeft(seconds); 
        toast.success(`Timer set for ${Math.floor(seconds / 60)} minutes ${seconds % 60} seconds.`);
        dispatch({ type: "RESET" });
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
            <TimerInput onTimeSet={(seconds) => handleTimeSet(seconds)} />      
        )
    } else {
        return (
            <div className="flex flex-col items-center">
                <TimerDisplay currTime={timeLeft} />

                {
                    state.status === "COMPLETED" ?
                        (
                            <div className="text-center mb-6">
                                <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-6 py-3 rounded-full font-semibold text-lg mb-4">
                                    <Bell className="w-5 h-5 animate-bounce" />
                                    Laundry Complete!
                                </div>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Your laundry has finished washing. Please take it out!
                                </p>
                            </div>
                        )

                    :

                    (
                        <div className="w-full space-y-3 mb-4">
                            <button
                                className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 dark:from-orange-600 dark:to-orange-700 dark:hover:from-orange-700 dark:hover:to-orange-800 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200" 
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
                                    (
                                        <>
                                            <Pause className="w-5 h-5" />
                                            Pause
                                        </>
                                    ) 
                                    :  
                                    state.status === "IDLE" ? 
                                    (
                                        <>
                                            <Play className="w-5 h-5" />
                                            Start
                                        </>
                                    )
                                    : 
                                    (
                                        <>
                                            <Play className="w-5 h-5" />
                                            Resume
                                        </>
                                    )
                                }
                            </button>


                            <div className="grid grid-cols-2 gap-3">
                                <button 
                                    className="flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold py-3 px-4 rounded-xl transition-all duration-200" 
                                    onClick={resetTimer}>
                                        <RotateCcw className="w-4 h-4" />
                                        Reset
                                </button>
                                <button 
                                    className="flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold py-3 px-4 rounded-xl transition-all duration-200" 
                                    onClick={setTimer}>
                                        <Clock className="w-4 h-4" />
                                        Stop & Set new Timer
                                </button>
                            </div>
                    
                            
                        </div>
                    )
                }
                
            </div>
        )
    }
};

export default Timer;