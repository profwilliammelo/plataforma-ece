export const AI_MODELS = {
    FAST: {
        id: 'gemini-1.5-flash',
        name: 'E-Vidente Rápido',
        cost: 1
    },
    GENIUS: {
        id: 'gemini-1.5-pro',
        name: 'E-Vidente Gênio',
        cost: 5
    }
} as const;

export const DEFAULT_MODEL = AI_MODELS.GENIUS;

export type AIModelType = keyof typeof AI_MODELS;
