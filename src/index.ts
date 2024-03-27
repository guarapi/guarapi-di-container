/**
 * Represents a symbol that acts as a key to identify dependencies in the Container.
 */
export type SymbolKey<T> = symbol & { __type: T };

/**
 * Creates a key symbol for the dependency.
 */
export function createDependencyKey<T>(name: string) {
  return Symbol(name) as SymbolKey<T>;
}

export type DependenciesMap = Map<SymbolKey<unknown>, Dependency<unknown>>;

/**
 * Represents a dependency in the Container.
 */
export interface Dependency<T> {
  (container: Container): T;
  __resolving?: boolean;
}

/**
 * Class that implements a Container to store and manage dependencies.
 * @example
 * // Define symbols for dependencies
 * const myLogSymbol = createDependencyKey<Console>('myLogger');
 * const magicNumberSymbol = createDependencyKey<number>('magicNumber');
 * const easterEggSymbol = createDependencyKey<string>('easterEggSymbol');
 *
 * // Create an instance of the Container
 * const container = new Container()
 *   .set(myLogSymbol, (_container) => _container.get(myLogSymbol) || console)
 *   .set(magicNumberSymbol, () => 42)
 *   .set(easterEggSymbol, () => 'Easter');
 *
 * // Get dependencies from the Container
 * const myLogger = container.get(myLogSymbol);
 * const magicNumber = container.get(magicNumberSymbol);
 * const easterEgg = container.get(easterEggSymbol);
 *
 * // Use the obtained dependencies
 * myLogger.log('Hello World!');
 * myLogger.info(magicNumber);
 * myLogger.warn(easterEgg);
 */
export default class Container {
  private dependencies: DependenciesMap;

  constructor() {
    this.dependencies = new Map();
  }

  /**
   * Sets a dependency in the Container.
   * @param key The symbol acting as a key for the dependency.
   * @param dependency The factory function that creates the dependency.
   * @returns The current instance of the Container.
   */
  set<T>(key: SymbolKey<T>, dependency: Dependency<T>): this {
    this.dependencies.set(key, dependency);
    return this;
  }

  /**
   * Gets a dependency from the Container.
   * @param key The symbol acting as a key for the dependency.
   * @returns The corresponding dependency or null.
   */
  get<T>(key: SymbolKey<T>): T | null {
    const dependency = this.dependencies.get(key);

    if (!dependency || dependency.__resolving) {
      return null;
    }

    dependency.__resolving = true;

    const resolvedDependency = (dependency as Dependency<T>)(this);

    delete dependency.__resolving;

    return resolvedDependency;
  }
}
