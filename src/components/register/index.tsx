import React from 'react';
import Base from '../base';
import { $modules } from '../../context';
import { log, makeKey } from '../../utils';
import Hook, { AllHookProps, HookProps } from '../hook';

type RegisterType = {
  component?: any;
  name: string;
  hooks?: HookProps[];
  targetHooks?: HookProps[];
  children?: React.ReactNode;
  label?: string;
};

type BaseProps = {
  $identifier?: string;
};

class Register extends Base<RegisterType> {
  state = {
    mainHooks: [],
    targetHooks: [],
  };

  constructor(public props: RegisterType & BaseProps) {
    super(props);
    this.register();
  }

  private register() {
    const { component, label, name: moduleName } = this.props;
    const key = makeKey(moduleName);
    const moduleKey = key.module();
    const has = $modules().has(moduleKey);

    $modules().add(moduleKey, {
      label,
      name: moduleName,
      component: component || this.props.children,
    });

    if (has) {
      log(`${moduleName} module replaced.`, this.isSilent);
    }
  }

  private prepareHook(hooks: HookProps[], extra: object = {}) {
    const { name } = this.props;
    return hooks.map((props: HookProps, index) => {
      const { name: hookName } = props;
      const $moduleName = hookName.includes(':')
        ? hookName.split(':')[0]
        : name;

      const newProps = {
        ...props,
        ...extra,
        $moduleName,
      } as AllHookProps;

      return <Hook {...newProps} key={index} />;
    });
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    const { hooks = [], targetHooks = [], name } = this.props;
    const mainHooks = this.prepareHook(hooks, { $isMainHook: true });
    const newTargetHooks = this.prepareHook(targetHooks);

    log(`${name} module registered.`, this.isSilent);

    return (
      <>
        <>{mainHooks}</>
        <>{newTargetHooks}</>
      </>
    );
  }
}

export default Register;
