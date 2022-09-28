# React Module Composition

**React Module Composition** library aims the suitable environment for the flexible, extensible UI developments. Basically, it enables the modules creation that impacts the behavior each others using composition pattern. So you can customize the modules using their hooks.

## Install

**Npm:**

```sh
$ npm i react-module-composition
```

**Yarn**

```sh
$ yarn add react-module-composition
```

**Import**

```ts
import RMC from 'react-module-composition';
```

**An example for module registration:**

```tsx
<RMC.Register
  name="basket_info"
  component={Component}
  hooks={[
    { name: 'get_basket_items', handler: () => ['Home', 'About'] },
    {
      name: 'dropdown_onclick',
      handler: () => 'handled from basket_info module',
    },
  ]}
/>
```

**An example for modifier module registration:**

```tsx
<RMC.Register
  name="custom_cart_info"
  targetHooks={[
    {
      name: 'cart_info:dropdown_onclick',
      handler: () => 'handled from custom_basket_info module',
    },
  ]}
/>
```

> **Note:** We only modified the _`dropdown_onclick`_ hook and did nothing for _`get_basket_items`_

**Trigger hooks:**

```tsx
import { useModule } from 'react-module-composition';

export const Component = props => {
  const { callHook } = useModule('basket_info');

  console.log(callHook('dropdown_onclick')); // output: -> handled from custom_basket_info module

  console.log(callBaseHook('dropdown_onclick')); // output: -> handled from basket_info module

  return <h1>Basket Items</h1>;
};
```

**Initialize the modules:**

```tsx
<RMC.Init modules={[CartInfoModule, CustomCartInfoModule]}>
  <App />
</RMC.Init>
```

## Case Study

Let's start with a basic case study;

Let's suppose we have an ecommerce product and you have many customers working in different fields. Therefore their expectations for UI and UX designs will be different from each other.

A customer wants to move the navigation bar in the menu from top to bottom. Their another expection is to fetch the menu data from a different API.

So we can modify the **header** module by customizing its hooks.

**Header Modülünün şu hooklara sahip olduğunu düşünelim;**

- Header background'ını varsayılan olarak mavi yapar
- Giriş Yap ve Yeni Kayıt linklerini sağ üste konumlandırır
- Menü verisini X API'dan çeker
- Menü background rengini varsayılan olarak kırmızı yapar

**Biz yukarıdaki özellik setlerinden şu hookları özelleştirmek istiyoruz;**

- Menü verisini X API yerine -> Y API'dan çeksin
-

### Teoride Uygulama

`<Navigation />` modulünü oluştur:

- Hooklarını belirle:
  - Get Menu items from **X** api -> `get_menu_items`
  - Apply background color -> `apply_background_color`

`<CustomNavigation />` modulünü oluştur:

- `<Navigation />` modülünde özelleştireceğin hook'ların isimleriyle aynı isime sahip hookları `<CustomNavigation />` modülü için de oluştur:
  - Get Menu items from **Y** api -> `get_menu_items`

CustomNavigation modülü tüm modüllerle birlikte initialize olduğunda her zaman için Navigation modülündeki `get_menu_items` hook'unu kendisininkiyle replace edecektir.

### Pratikte Uygulama

**Yeni bir modül oluşturalım:**

```tsx
import RMC from 'react-module-composition';

const HeaderModule = () => {
  return (
    <RMC.Register
      name="header"
      component={HeaderComponent}
      hooks={[
        <RMC.Hook
          name="get_menu_data"
          handler={() => ['Home', 'About', 'Contact']}
        />,
        <RMC.Hook name="menu_component" handler={({ items }) => <DefaultMenuComponent items={items} />}>
      ]}
    />
  );
};
```

**HeaderComponent**

```tsx
import RMC, { useModule } from 'react-modular';

const HeaderComponent = () => {
  const { callHook } = useModule('header');
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    setMenuItems(callHook('get_menu_data'));
  }, []);

  return (
    <div>
      <RMC.Show hook="menu_component" items={menuItems} />
    </div>
  );
};
```

**DefaultMenuComponent**

```tsx
const DefaultMenuComponent = ({ items }) => {
  return (
    <ul>
      {items.map(item => (
        <li>{item}</li>
      ))}
    </ul>
  );
};
```

Şimdi de modulü container'a kaydedelim:

```tsx
<RMC.Init modules={[HeaderModule]}>
  <App />
</RMC.Init>
```

**App.jsx**

```jsx
const App = () => {
  return (
    <div>
      <RMC.Show module="header" />
    </div>
  );
};
```

Yukarıdaki **header** modülünün çıktısı şu şekilde olacaktır:

```text
- Home
- About
- Contact
```

### Module Manipulation

Header modülündeki menü datasını farklı bir kaynaktan çekmek istediğimde ne yapmam gerekecek? Burada default header modulüne müdahalede bulunmadan şu şekilde yapabiliriz.

İlk olarak yeni bir modül oluşturmalıyız:

```tsx
const CustomHeaderModule = () => {
  return (
    <RMC.Register
      name="custom_header"
      targetHooks={[
        <RMC.Hook
          name="header:get_menu_data"
          handler={() => ['Home', 'Products', 'Prices', 'About', 'Contact']}
        />,
      ]}
    />
  );
};
```

Modülleri kaydedelim.

```tsx
<RMC.Init modules={[HeaderModule, CustomHeaderModule]}>
  <App />
</RMC.Init>
```

**App.jsx**

```jsx
const App = () => {
  return (
    <div>
      <RMC.Show module="header" />
    </div>
  );
};
```

Artık yukarıdaki **header** modülünün çıktısı şu şekilde olacaktır:

```text
- Home
- Products
- Prices
- About
- Contact
```

Manipülasyon adımlarını şu şekilde sıralayabiliriz;

```text
1. Base modülü tanımladık.
   - `HeaderModule`
2. Base modüldeki hook'ları tanımladık.
   - `get_menu_data`
   - `menu_component`
3. Base (Header) modüldeki hook'ları özelleştirecek olan custom modülü tanımladık.
   - `CustomHeaderModule`
4. Base `HeaderModule`'deki manipüle edilecek hook'lar `CustomHeaderModule` ile yeniden tanımlandı.
```

### Components

####`<Register />`

Register a module to container.

**Props**

| name        | type          | description                                                                                 |
| ----------- | ------------- | ------------------------------------------------------------------------------------------- |
| name        | string        | Module name. It should be unique.                                                           |
| component   | React Element | If you want to render a component in the module.                                            |
| hooks       | Hook[]        | The hooks that belongs to module must be defined here.                                      |
| targetHooks | Hook[]        | If there are hooks you want to manipulate in anothor modules, you must define them here.    |
| label       | string        | You can define a label to identify the modules. This can be useful when debugging a module. |
