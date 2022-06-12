export class ServiceContainer {
  private container: Map<
    string | Symbol,
    { value: any; singleton?: boolean; key: string | Symbol }
  > = new Map();

  create() {
    return new ServiceContainer();
  }

  add = (key: string | Symbol, value: any) => {
    const item = this.container.get(key);
    if (!item) {
      this.container.set(key, {
        key,
        value,
      });
    } else if (item && !item.singleton) {
      this.container.set(key, { ...item, value });
    }
  };

  get = (key: string | Symbol, defaultValue?: any): any => {
    const item = this.container.get(key);
    return (item && item.value) || defaultValue;
  };

  getAll() {
    const items = [] as any[];
    this.container.forEach(({ value }) => items.push(value));
    return items;
  }

  singleton = (key: string | Symbol, value: any) => {
    if (!this.has(key)) {
      this.container.set(key, {
        key,
        value,
        singleton: true,
      });
    }
  };

  has = (key: string | Symbol) => this.container.has(key);

  remove = (key: string | Symbol) => this.container.delete(key);
}

export default new ServiceContainer();
