# eslint-plugin-lodash-to-native

Данный плагин проверяет, что используется Array#map() вместо _.map() там, где это возможно.

Правило `lodash-to-native/map` также предлагает следующие исправления:
- В общем случае будет добавлена проверка того, является ли первый параметр массивом:
```js
// Array.isArray(collection) ? collection.map(fn) : _.map(collection, fn);
_.map(collection, fn);
```

- Если при вызове явно указан литерал массива, то генерируется код без проверки:
```js
// Заменится на [].map(e => e);
_.map([], e => e);
```

- Если при вызове используется объект, то данный вызов не будет считаться ошибкой:
```js
// Не изменится
_.map({}, e => e);
```




## Установка

Сначала необходимо установить [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Затем установить данное правило `eslint-plugin-lodash-to-native`:

```
$ npm install -S https://github.com/Aracturat/eslint-plugin-lodash-to-native.git
```

## Использование

Необходимо добавить в файл .eslintrc.js следующее :
```js
{
    "plugins": [
        "lodash-to-native"
    ],
    "rules": {
        "lodash-to-native/map": "warn"
    }
}
```

## Разработка

Для запуска тестов запустите `npm test`.
