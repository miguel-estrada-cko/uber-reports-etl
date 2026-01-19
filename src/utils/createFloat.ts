import { Float, FloatDecimal } from '../types'

export const createFloat = (value: string | number | null | undefined): Float => {
    let number = value ? value : 0

    if (typeof number === 'string') {
        number = number.trim()
    }

    return new FloatDecimal(number ? number : 0)
}
