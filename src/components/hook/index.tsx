import Base from '../base';
import { $modules, $hooks, $options } from '../../context';
import { bindHook, log, makeKey, warn } from '../../utils';

export type HookProps = {
  name: string;
  label?: string;
  handler: CallableFunction;
};

export type AllHookProps = HookProps & {
  $moduleName: string;
  $isMainHook: boolean;
  $from?: string;
};

class Hook extends Base<HookProps> {
  constructor(props: AllHookProps) {
    super(props);
    this.bindHook();
  }

  get isSlient() {
    const options = $options().get(makeKey().options());
    return !options.silent;
  }

  shouldComponentUpdate() {
    return false;
  }

  private bindHook() {
    const {
      name,
      handler,
      label,
      $moduleName,
      $from,
      $isMainHook = false,
    } = this.props as AllHookProps;

    if (!$moduleName) {
      const msg = `Module not found for "${name}" hook!`;
      if (this.isStrict) {
        throw new Error(msg);
      } else {
        warn(msg, this.isSilent);
      }
    }

    if ($from) {
      log(`[hook] ${$from} -> ${$moduleName}  [${name}]`, this.isSlient);
    }

    const key = makeKey($moduleName).module();
    const module = $modules().get(key);

    const registerHook = bindHook(module.name, $hooks());
    registerHook([
      { $isMainHook, $from, name, label, handler, type: module.type },
    ]);
  }

  render() {
    return null;
  }
}

export default Hook;
