import Decimal from 'decimal.js'

export const FloatDecimal = Decimal.clone({
    precision: 40,
    rounding: Decimal.ROUND_HALF_UP,
})

export type Float = InstanceType<typeof FloatDecimal>
