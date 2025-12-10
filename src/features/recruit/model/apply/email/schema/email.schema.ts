export interface EmailSchema {
    getEmail: () => string;
    cooldownSec?: number;
}