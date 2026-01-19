import { Logger, LoggerInterface } from '../../../services'

describe('Console Writer Service', () => {
    it('should implement the interface', () => {
        const logger: LoggerInterface = new Logger()
        expect(logger).toBeInstanceOf(Logger)
    })
})
