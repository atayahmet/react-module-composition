import React from 'react';
import { ModuleOptions } from '../../../types/index';
import { $options } from '../../context';
import { makeKey } from '../../utils';

export default class Base<P, S = {}> extends React.Component<P, S> {
  get options(): ModuleOptions {
    const options = $options().get(makeKey().options());
    return options;
  }

  get isSilent() {
    return !this.options.silent;
  }

  get isStrict() {
    return this.options.strict;
  }
}
