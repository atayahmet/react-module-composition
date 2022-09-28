import { Hook } from '../types/index';
import { ServiceContainer } from './container';

export const log = (msg: string, status: boolean = true) => {
  if (status) {
    console.log(`[RMC] ${msg}`);
  }
};

export const warn = (msg: string, status: boolean = true) => {
  if (status) {
    console.warn(`[RMC] ${msg}`);
  }
};

const makeHookName = (name: string, moduleName: string) =>
  name?.startsWith(`${moduleName}:`) ? name : `${moduleName}:${name}`;

export const bindHook = (
  moduleName: string,
  container: ServiceContainer
): CallableFunction => (hooks: Hook[]): void => {
  hooks.forEach(
    ({ $isMainHook, $from, label, name, handler, type: moduleType }) => {
      const hookName = makeHookName(name, moduleName);
      const data = { name: hookName, label, $isMainHook, handler, moduleType };

      if ($isMainHook) {
        container.add(`${hookName}:$main`, data);
      }
      container.add(`${hookName}`, {
        ...data,
        $from,
      });
    }
  );
};

export const getHookHandler = (
  moduleName: string,
  container: ServiceContainer
) => (name: string): CallableFunction | undefined => {
  const hookName = makeHookName(name, moduleName);
  const { handler } = container.get(hookName, {});
  return handler;
};

export const makeKey = (moduleName?: string) => {
  return {
    module() {
      return Symbol.for(`modules:${moduleName}`);
    },
    modules() {
      return Symbol.for(`@modules`);
    },
    hooks() {
      return Symbol.for(`@hooks`);
    },
    options() {
      return Symbol.for(`options`);
    },
  };
};

makeKey('');
