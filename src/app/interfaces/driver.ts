import { Talent } from './talent';

import { Stage } from './stage';

export interface Driver {
    name: string;
    talent: Talent;
    stages?: Stage[];
    totalTimeSeconds?: number;
    totalTimeString?: string; 
    gap?: string;
    currentStageTime?: string;
    sugDifficulty?: number;
    player?: boolean;
    crash?: boolean;
}