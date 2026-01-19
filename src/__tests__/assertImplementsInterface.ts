/**
 *
 * @param _instance
 * @returns
 *
 * @example
 * assertImplementsInterface<WriterInterface>(new ConsoleWriter())
 */
export function assertImplementsInterface<T>(_instance: T): T {
    return _instance
}
