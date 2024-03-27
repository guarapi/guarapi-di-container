import Container, { createDependencyKey } from '../src';

describe('Container', () => {
  it('should set and get dependencies correctly', () => {
    const myLogSymbol = createDependencyKey<Console>('myLogger');
    const magicNumberSymbol = createDependencyKey<number>('magicNumber');
    const easterEggSymbol = createDependencyKey<string>('easterEggSymbol');

    const container = new Container()
      .set(myLogSymbol, () => ({ log: console.log }))
      .set(myLogSymbol, (innerContaier) => innerContaier.get(myLogSymbol) || console)
      .set(magicNumberSymbol, () => 42)
      .set(easterEggSymbol, () => 'Páscoa');

    expect(container.get(myLogSymbol)).toMatchObject({ log: console.log });
    expect(container.get(magicNumberSymbol)).toEqual(42);
    expect(container.get(easterEggSymbol)).toEqual('Páscoa');
  });

  it('should get null for depedency not found', () => {
    const container = new Container();
    const unknownSymbol = createDependencyKey<string>('unknown');

    expect(container.get(unknownSymbol)).toBeNull();
  });

  it('should override dependencies correctly', () => {
    const myString = createDependencyKey<string>('my-string');
    const container = new Container()
      .set(myString, () => 'string 2')
      .set(myString, () => 'string 3');

    expect(container.get(myString)).toEqual('string 3');
  });

  it('should return null for dependencies not found', () => {
    const container = new Container();
    const unknownSymbol = createDependencyKey<string>('unknown');

    // Verifica se retorna null para dependências não encontradas
    expect(container.get(unknownSymbol)).toBeNull();
  });

  it('should be able to handle circular dependencies', () => {
    const circularDep1 = createDependencyKey<string>('circularDep1');
    const circularDep2 = createDependencyKey<string>('circularDep2');

    const container = new Container()
      .set(circularDep1, (innerContainer) => innerContainer.get(circularDep2))
      .set(circularDep2, (innerContainer) => innerContainer.get(circularDep1));

    expect(() => container.get(circularDep1)).not.toThrow('Maximum call stack size exceeded');
    expect(container.get(circularDep1)).toBeNull();
    expect(container.get(circularDep2)).toBeNull();
  });

  it('should handle dependencies that return falsy values correctly', () => {
    const zeroSymbol = createDependencyKey<number>('zero');
    const nullSymbol = createDependencyKey<string>('nullValue');
    const undefinedSymbol = createDependencyKey<string>('undefinedValue');

    const container = new Container()
      .set(zeroSymbol, () => 0)
      .set(nullSymbol, () => null)
      .set(undefinedSymbol, () => undefined);

    expect(container.get(zeroSymbol)).toEqual(0);
    expect(container.get(nullSymbol)).toBeNull();
    expect(container.get(undefinedSymbol)).toBeUndefined();
  });

  it('should handle dependencies that throw errors gracefully', () => {
    const errorSymbol = createDependencyKey<void>('error');

    const container = new Container().set(errorSymbol, () => {
      throw new Error('Error dependency');
    });

    expect(() => container.get(errorSymbol)).toThrow('Error dependency');
  });

  it('should handle nested dependencies correctly', () => {
    const dep1Symbol = createDependencyKey<number>('dep1');
    const dep2Symbol = createDependencyKey<number>('dep2');
    const dep3Symbol = createDependencyKey<number>('dep3');

    const container = new Container()
      .set(dep1Symbol, () => 1)
      .set(dep2Symbol, (innerContainer) => innerContainer.get(dep1Symbol)! + 1)
      .set(dep3Symbol, (innerContainer) => innerContainer.get(dep2Symbol)! + 1);

    expect(container.get(dep3Symbol)).toEqual(3);
  });

  it('should handle dependencies that return objects correctly', () => {
    const objSymbol = createDependencyKey<object>('object');

    const container = new Container().set(objSymbol, () => ({ name: 'John', age: 30 }));

    expect(container.get(objSymbol)).toMatchObject({ name: 'John', age: 30 });
  });
});
