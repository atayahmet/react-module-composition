import container, { ServiceContainer } from '../container';
import { ContainerKeys } from '../../types/index';
import { makeKey } from '../utils';

export const getContainer = (name: ContainerKeys): ServiceContainer => {
  const keyGen = makeKey()[name];
  const key = keyGen();
  let _container = container.get(key);

  if (!_container) {
    _container = container.create();
    container.add(key, _container);
  }

  return _container;
};

export const $hooks = () => getContainer('hooks');

export const $modules = () => getContainer('modules');

export const $options = () => getContainer('options');
