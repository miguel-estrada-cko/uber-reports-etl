import { WinstonLogger, Logger } from '../../../services'

describe('Console Writer Service', () => {
    it('should implement the interface', () => {
        const logger: Logger = new WinstonLogger()
        expect(logger).toBeInstanceOf(WinstonLogger)
    })
})
