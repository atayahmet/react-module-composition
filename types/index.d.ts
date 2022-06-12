export type ContainerKeys = keyof IMakeKey;
export type ModuleHookKeyTypes = string | symbol;

export type ModuleProps = {
  $moduleName: string;
  $isMainHook: boolean;
};

export interface IMakeKey {
  module: () => Symbol;
  modules: () => Symbol;
  hooks: () => Symbol;
  options: () => Symbol;
}

type Hook = {
  $isMainHook: boolean;
  $from?: string;
  label?: string;
  name: string;
  handler: CallableFunction;
  type: string;
};

export type ModuleOptions = {
  silent?: boolean;
  strict?: boolean;
};
