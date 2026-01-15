import { Float, FloatDecimal } from '../types'

export const createFloat = (value: string | number | null | undefined): Float => new FloatDecimal(value ?? 0)
