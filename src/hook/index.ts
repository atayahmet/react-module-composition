import { $hooks, $modules } from '../context';
import { getHookHandler, makeKey } from '../utils';

const useModule = (moduleName: string): any => {
  const key = makeKey(moduleName);
  const moduleKey = key.module();
  const module = $modules().get(moduleKey);

  if (!module) throw new Error(`"${moduleName}" module not found.`);

  const callHook = (hookName: string, params?: any) => {
    const findHandler = getHookHandler(moduleName, $hooks());
    const handler = findHandler(hookName);
    return handler && handler(params);
  };

  const callBaseHook = (hookName: string, params?: any) =>
    callHook(`${hookName}:$main`, params);

  const { label } = module;

  return {
    label,
    callHook,
    callBaseHook,
  };
};

export default useModule;
