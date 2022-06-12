import React from 'react';
import Base from '../base';
import { $modules } from '../../context';
import { log, makeKey } from '../../utils';

type RegisterType = {
  component?: any;
  name: string;
  hooks?: React.ReactElement[];
  targetHooks?: React.ReactElement[];
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
    const alreadyHas = $modules().has(moduleKey);

    $modules().add(moduleKey, {
      label,
      name: moduleName,
      component: component || this.props.children,
    });

    if (alreadyHas) {
      log(`[module] ${moduleName} module replaced.`, this.isSilent);
    }
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    const { hooks = [], targetHooks = [], name } = this.props;
    const mainHooks = hooks.map((element, index) => {
      return React.cloneElement(element, { $isMainHook: true, $moduleName: name, key: index });
    });

    const newTargetHooks = targetHooks.map((element, index) => {
      const $moduleName = element.props.name.split(':')[0];
      return React.cloneElement(element, { $moduleName, $from: name, key: index });
    });

    log(`[module] ${this.props.name} module registered.`, this.isSilent);

    return (
      <>
        <>{mainHooks}</>
        <>{newTargetHooks}</>
      </>
    );
  }
}

export default Register;
