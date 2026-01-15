export const stringToDate = (value: string | null | undefined): Date | null => {
    return value ? new Date(`${value}Z`) : null
}
