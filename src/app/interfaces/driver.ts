interface Driver {
    name: string;
    talent: number;
    stages?: Stage[];
    totalTimeSeconds?: number;
    totalTimeString?: string; 
    gap?: string;
    currentStageTime?: string;
}