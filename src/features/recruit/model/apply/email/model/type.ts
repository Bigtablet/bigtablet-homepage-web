export interface EmailApplyProps {
    getEmail: () => string;
    cooldownSec?: number;
}