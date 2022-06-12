import Base from '../base';
import { $modules, $hooks, $options } from '../../context';
import { bindHook, log, makeKey, warn } from '../../utils';

type HookProps = {
  name: string;
  label?: string;
  handler: CallableFunction;
};

type AllProps = HookProps & {
  $moduleName: string;
  $isMainHook: boolean;
  $from?: string;
};

class Hook extends Base<HookProps> {
  constructor(props: AllProps) {
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
    } = this.props as AllProps;

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

    const moduleKey = makeKey($moduleName).module();
    const module = $modules().get(moduleKey);

    const registerHook = bindHook(module.name, $hooks());
    registerHook([{ $isMainHook, $from, name, label, handler, type: module.type }]);
  }

  render() {
    return null;
  }
}

export default Hook;
