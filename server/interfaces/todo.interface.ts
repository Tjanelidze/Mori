export interface ITodo {
    title: string,
    isFinished: boolean,
    reps: number,
    priority: "low" | "medium" | 'high',
    createdAt: Date
}
