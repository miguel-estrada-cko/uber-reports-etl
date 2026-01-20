export const withDefault = <T>(value: T | null | undefined, fallback: T): T => {
    return value ?? fallback
}
