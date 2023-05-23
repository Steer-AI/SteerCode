// https://www.typescriptlang.org/docs/handbook/enums.html#objects-vs-enums

export type NotificationType = typeof NotificationType[keyof typeof NotificationType];
export const NotificationType = {
    GeneralSuccess: 'success',
    GeneralError: 'error',
    GeneralInfo: 'info',
} as const;

export type Position = typeof Position[keyof typeof Position];
export const Position = {
    TopLeft: 'top-left',
    TopCenter: 'top-center',
    TopRight: 'top-right',
    BottomLeft: 'bottom-left',
    BottomCenter: 'bottom-center',
    BottomRight: 'bottom-right',
} as const;

