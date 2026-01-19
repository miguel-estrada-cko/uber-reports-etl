export const stringToDate = (value: string | null | undefined): Date | null => {
    let date: Date | null = null

    if (typeof value === 'string') {
        value = value.trim()
        date = new Date(`${value}${value.endsWith('Z') ? '' : 'Z'}`)
    }

    return isNaN(date?.getTime() ?? NaN) ? null : date
}
