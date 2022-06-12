import { $hooks } from '../context';
import { getHookHandler } from '../utils';

const useModule = (name: string): any => {
  return {
    callHook: (hookName: string, params?: any) => {
      const handler = getHookHandler(name, $hooks())(hookName);
      return handler && handler(params);
    },
  };
};

export default useModule;
