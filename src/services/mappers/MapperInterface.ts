export interface MapperInterface<Input, Output> {
    map(input: Input): Output
}
