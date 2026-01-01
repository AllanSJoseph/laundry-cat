import {useState, useRef, useEffect} from "react";


interface TimerInputProps {
    onTimeSet: (seconds: number) => void;
}

const TimerInput: React.FC<TimerInputProps> = ({ onTimeSet }) => {

    const [inputValue, setInputValue] = useState<number>(0);
    const [formData, setFormData] = useState<{minutes: number; seconds: number}>({minutes: 0, seconds: 0});
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const knobRef = useRef<HTMLDivElement>(null);
    const lastAngleRef = useRef<number>(0);

    const minValue = 0;
    const maxValue = 1800;
    const minAngle = 0;
    const maxAngle = 360;

    const valueToAngle = (val: number) => {
        return minAngle + (val - minValue) * (maxAngle - minAngle) / (maxValue - minValue);
    };

    const angleToValue = (angle: number) => {
        let normalizedAngle = angle;
        if (normalizedAngle < minAngle) normalizedAngle = minAngle;
        if (normalizedAngle > maxAngle) normalizedAngle = maxAngle;

        const val = minValue + (normalizedAngle - minAngle) * (maxValue - minValue) / (maxAngle - minAngle);
        return Math.round(Math.max(minValue, Math.min(maxValue, val)));
    };

    const getAngleFromEvent = (e: MouseEvent | TouchEvent): number => {
        if (!knobRef.current) return 0;

        const rect = knobRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const clientX = 'clientX' in e ? e.clientX : e.touches[0].clientX;
        const clientY = 'clientY' in e ? e.clientY : e.touches[0].clientY;

        const deltaX = clientX - centerX;
        const deltaY = clientY - centerY;

        let angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
        angle = angle + 90;

        if (angle < 0) angle += 360;

        return angle;
    };

    const handleKnobStart = (e: React.MouseEvent | React.TouchEvent): void => {
        setIsDragging(true);
        const nativeEvent = e.nativeEvent as MouseEvent | TouchEvent;
        lastAngleRef.current = getAngleFromEvent(nativeEvent);
    };

    const handleKnobMove = (e: MouseEvent | TouchEvent): void => {
        if (!isDragging) return;

        e.preventDefault();
        const currentAngle = getAngleFromEvent(e);
        const currentValueAngle = valueToAngle(Number(inputValue) || 0);

        let deltaAngle = currentAngle - lastAngleRef.current;

        if (deltaAngle > 180) deltaAngle -= 360;
        if (deltaAngle < -180) deltaAngle += 360;

        const newAngle = currentValueAngle + deltaAngle;
        let newValue = angleToValue(newAngle);

        const snapInterval = 300;
        const snapThreshold = 30;

        const remainder = newValue % snapInterval;

        if (remainder < snapThreshold) {
            newValue = newValue - remainder;
        } else if (remainder > snapInterval - snapThreshold){
            newValue = newValue + (snapInterval - remainder);
        }

        setInputValue(newValue);
        lastAngleRef.current = currentAngle;
    };

    const handleEnd = (): void => {
        setIsDragging(false);
    };

    const handleSet = () => {
        const seconds = Number(inputValue);
        if (seconds > 0) {
            onTimeSet(seconds);
        }
    };

    const rotation = valueToAngle(Number(inputValue) || 0);

    useEffect(() => {
        if (isDragging){
            const mouseMoveHandler = (e: MouseEvent) => handleKnobMove(e);
            const touchMoveHandler = (e: TouchEvent) => handleKnobMove(e);

            setFormData({minutes: Math.floor(inputValue / 60), seconds: inputValue % 60});

            window.addEventListener('mousemove', mouseMoveHandler);
            window.addEventListener('mouseup', handleEnd);
            window.addEventListener('touchmove', touchMoveHandler);
            window.addEventListener('touchend', handleEnd);

            return () => {
                window.removeEventListener('mousemove', mouseMoveHandler);
                window.removeEventListener('mouseup', handleEnd);
                window.removeEventListener('touchmove', touchMoveHandler);
                window.removeEventListener('touchend', handleEnd);
            };
        }
    }, [isDragging, inputValue]);


    useEffect(() => {
        const totalSeconds = formData.minutes * 60 + formData.seconds;
        if (inputValue !== totalSeconds){
            setInputValue(totalSeconds);
        } else if (totalSeconds === 0){
            setInputValue(0);
        }
        
    }, [formData]);


    return (
        <div>
            
            <div className="pt-7">
                    
        
                <div className="relative">
                    {/* Knob container */}
                    <div className="relative w-48 h-48 mb-8">
                        {/* Scale marks */}
                        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200">
                            {[...Array(13)].map((_, i) => {
                                const angle = (i / 12) * 360;
                                const rad = (angle - 90) * Math.PI / 180;
                                const x1 = 100 + Math.cos(rad) * 85;
                                const y1 = 100 + Math.sin(rad) * 85;
                                const x2 = 100 + Math.cos(rad) * 75;
                                const y2 = 100 + Math.sin(rad) * 75;
                                
                                // Highlight snap points (every 5 minutes)
                                const isSnapPoint = i % 2 === 0 && i < 12;
                                
                                return (
                                <line
                                    key={i}
                                    x1={x1}
                                    y1={y1}
                                    x2={x2}
                                    y2={y2}
                                    stroke={isSnapPoint ? "#ff6900" : "#475569"}
                                    strokeWidth={isSnapPoint ? "3" : "2"}
                                    strokeLinecap="round"
                                />
                                );
                            })}
                        </svg>
                            
                        {/* Knob */}
                        <div
                        ref={knobRef}
                        className={`absolute inset-0 m-auto w-40 h-40 rounded-full bg-gradient-to-br from-slate-700 to-slate-600 shadow-lg cursor-grab ${
                            isDragging ? 'cursor-grabbing scale-95' : ''
                        } transition-transform`}
                        onMouseDown={handleKnobStart}
                        onTouchStart={handleKnobStart}
                        style={{
                            transform: `rotate(${rotation}deg)`,
                        }}
                        >
                            {/* Inner circle */}
                            <div className="absolute inset-3 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 shadow-inner" />
                            
                            {/* Indicator */}
                            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-1 h-12 bg-orange-400 rounded-full shadow-lg shadow-cyan-400/50" />
                            
                            {/* Center dot */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-800 shadow-inner" />
                        </div>
                    </div>
                </div>
        
                {/* Value display */}
                <div className="text-center">
                    <div className="text-5xl font-bold text-orange-400 mb-2">
                        {/* {Math.floor(inputValue / 60)}:{String(inputValue % 60).padStart(2, '0')} */}
                        <input
                            className="w-20 bg-transparent text-center focus:outline-none"
                            type="number"
                            value={formData.minutes}
                            onChange={(e) => setFormData({...formData, minutes: Number(e.target.value)})}
                            placeholder="Enter minutes"
                        />
                        :
                        <input
                            className="w-20 bg-transparent text-center ml-2 focus:outline-none"
                            type="number"
                            value={formData.seconds}
                            onChange={(e) => setFormData({...formData, seconds: Number(e.target.value)})}
                            placeholder="Enter seconds"
                        />
                    </div>
                    <div className="text-slate-400 text-sm">minutes : seconds</div>
                    </div>
                    <button className="mt-3 w-50 rounded bg-orange-400 p-2 font-bold text-white cursor-pointer" onClick={handleSet} disabled={!inputValue}>Set Timer</button>
                </div>
        </div>
    )

};

export default TimerInput;