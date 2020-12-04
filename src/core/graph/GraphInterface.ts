export interface GraphInterface {
    setParams(allTime: number, timerStep: number, time?: any, shape?: any): void;

    configured(): boolean;

    dropConfigured(): void;

    drawToEnd(color?: string): void;
}