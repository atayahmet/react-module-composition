import React from 'react';
import { $hooks, $modules } from '../../context';
import { getHookHandler, makeKey } from '../../utils';

type ShowProps = {
  module?: string;
  hook?: string;
  main?: boolean;
  [prop: string]: any;
};

const showModule = (name: string, props: ShowProps) => {
  const key = makeKey(name).module();
  const { component: Comp, type } = $modules().get(key);
  return <Comp {...{ ...props, $moduleName: name, $moduleType: type }} />;
};

const showHook = (
  name: string,
  isMain: boolean = false,
  module: string,
  props: ShowProps
) => {
  const splittedHook = name.split(':');
  const moduleName = splittedHook.length > 1 ? splittedHook[0] : module;

  const hookName = isMain ? `${splittedHook[1]}:$main` : splittedHook[1];
  const hookHandler = getHookHandler(moduleName, $hooks())(hookName);

  return hookHandler && hookHandler(props);
};

const Show: React.FC<ShowProps> = ({
  module,
  main,
  hook,
  ...props
}: ShowProps) => {
  if (hook && module) {
    return showHook(hook, main, module, props);
  } else if (module) {
    return showModule(module, props);
  }
  return null;
};

export default Show;
