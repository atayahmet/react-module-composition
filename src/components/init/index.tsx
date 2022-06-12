import React from 'react';
import { ModuleOptions } from '../../../types/index';
import Base from '../base';
import { $options } from '../../context';
import { log, makeKey } from '../../utils';

type InitProps = {
  options?: ModuleOptions;
  modules?: CallableFunction[];
  children?: React.ReactNode;
};

const defaultOptions: ModuleOptions = {
  strict: false,
  silent: true,
};

class Init extends Base<InitProps> {
  constructor(props: InitProps) {
    super(props);
    this.init();
  }

  shouldComponentUpdate() {
    return false;
  }

  init() {
    const keygen = makeKey();
    const optionKey = keygen.options();

    const currentOptions = $options().get(optionKey, defaultOptions);
    const { options: newOptions = {} } = this.props;

    $options().add(optionKey, { ...currentOptions, ...newOptions });
  }

  render() {
    const { modules = [] } = this.props;
    const elements = modules.map((module, index) => {
      return React.cloneElement(module(), { key: index });
    });

    log('Modules initializing...', this.isSilent);

    return (
      <>
        {elements}
        {this.props.children}
      </>
    );
  }
}

export default Init;
