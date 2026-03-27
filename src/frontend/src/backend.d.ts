import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ScheduledTask {
    startTime: string;
    daysActive: Array<boolean>;
    endTime: string;
    effect: EffectType;
    taskId: bigint;
}
export interface AmbiSettings {
    fps: bigint;
    currentPowerState: boolean;
    autoOnTime: string;
    staticColor: string;
    ledCount: bigint;
    scheduleDays: Array<boolean>;
    autoOffTime: string;
    autoPowerEnabled: boolean;
    selectedEffect: EffectType;
    screenCaptureActive: boolean;
}
export enum EffectType {
    static_ = "static",
    rainbow = "rainbow",
    music = "music",
    fire = "fire",
    breathe = "breathe"
}
export interface backendInterface {
    addTask(effect: EffectType, startTime: string, endTime: string, daysActive: Array<boolean>): Promise<bigint>;
    getAllTasks(): Promise<Array<ScheduledTask>>;
    getSettings(): Promise<AmbiSettings>;
    getTasksForDay(dayIdx: bigint): Promise<Array<ScheduledTask>>;
    removeTask(taskId: bigint): Promise<void>;
    updateSettings(newSettings: AmbiSettings): Promise<void>;
    updateTaskPowerState(taskId: bigint, newState: boolean): Promise<void>;
}
