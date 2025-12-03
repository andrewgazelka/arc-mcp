/**
 * Semantic locator strategies for finding elements
 */
export type LocatorStrategy = {
    role: {
        role: string;
        name?: string;
    };
} | {
    label: string;
} | {
    text: string;
    exact?: boolean;
} | {
    placeholder: string;
} | {
    testId: string;
} | {
    css: string;
};
/**
 * Role-based locator with optional accessible name
 */
export interface RoleLocator {
    role: string;
    name?: string;
}
/**
 * Supported ARIA roles with implicit HTML element mappings
 */
export declare const ROLE_MAPPINGS: Record<string, string>;
//# sourceMappingURL=locator.d.ts.map