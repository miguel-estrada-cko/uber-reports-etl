import { HandlerException } from './HandlerException'
import { Handler } from './Handler'
import { HandlerProperties } from './HandlerProperties'
import { SettlementBreakdownHandler } from './SettlementBreakdownHandler'

type HandlerRegistry = {
    readonly pattern: RegExp
    factory(fileName: string): Handler<any>
}

const REGISTERED_HANDLERS: HandlerRegistry[] = [SettlementBreakdownHandler]

export class HandlerFactory {
    static new(fileName: string): Handler<HandlerProperties> {
        const registry: HandlerRegistry | undefined = REGISTERED_HANDLERS.find((handler) => {
            return handler.pattern.test(fileName)
        })

        if (!registry) throw new HandlerException.NoRegistryFound(fileName)
        return registry.factory(fileName)
    }
}
