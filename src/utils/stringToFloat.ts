import { Float } from '../types'
import { createFloat } from './createFloat'

export const stringToFloat = (value: string | null | undefined): Float | null => {
    let float: Float | null = null

    if (typeof value === 'string') {
        value = value.trim()
        float = createFloat(Number(value))
    }

    return value && !isNaN(Number(value)) ? createFloat(value) : null
}
