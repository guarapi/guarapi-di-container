# @guarapi/di-container

![GitHub](https://img.shields.io/github/license/guarapi/guarapi-container)
![npm](https://img.shields.io/npm/v/@guarapi/di-container)

Dependency injection container for JavaScript/TypeScript applications.

## Installation

You can install the package via npm or yarn:

```bash
pnpm add @guarapi/di-container
# or
npm install @guarapi/di-container
# or
yarn add @guarapi/di-container
```

## Usage

### Creating Dependency Keys

First, you need to create symbols to act as keys for your dependencies using the `createDependencyKey` function:

```typescript
import { createDependencyKey } from '@guarapi/di-container';

const myDependencyKey = createDependencyKey<string>('myDependency');
```

### Setting Dependencies

Then, you can set dependencies in the container using the `set` method:

```typescript
import Container from '@guarapi/di-container';

const container = new Container()
  .set(myDependencyKey, () => 'Dependency value');
```

### Getting Dependencies

Finally, you can retrieve dependencies from the container using the `get` method:

```typescript
const dependencyValue = container.get(myDependencyKey);
console.log(dependencyValue); // Output: Dependency value
```

## Contributing

Contributions are welcome! Please feel free to submit any issues or pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
