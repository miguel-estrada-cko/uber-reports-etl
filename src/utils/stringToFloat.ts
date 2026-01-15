import { Float } from '../types'
import { createFloat } from './createFloat'

export const stringToFloat = (value: string | null | undefined): Float | null => {
    return value ? createFloat(value) : null
}
