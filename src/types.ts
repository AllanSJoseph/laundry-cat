export type SWMessage = {
    action: "startReminders" | "stopReminders";
}

export type TimerStatus = "IDLE" | "WAITING" | "RUNNING" | "PAUSED" | "COMPLETED";

export interface TimerState {
    status: TimerStatus;
}

export type TimerAction = 
    | {type: "SET_TIME"}
    | {type: "START"}
    | {type: "PAUSE"}
    | {type: "RESET"}
    | {type: "RESUME"}
    | {type: "FINISH"};