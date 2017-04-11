export interface EventColor {
    primary?: string;
    secondary?: string;
}
export interface CalendarEvent {
    id?: number;
    start?: Date;
    end?: Date;
    title?: string;
    description?: string;
    color?: EventColor;
    draggable?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}