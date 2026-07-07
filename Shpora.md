# Шпаргалка По Проекту

Этот файл нужен как учебная заметка по важным правилам, которые встречаются во время разработки сайта. Сюда можно складывать не просто команды, а объяснения: почему мы делаем именно так и как это работает.

## Tailwind: Размер Текста

В Tailwind размер текста задается классами:

```tsx
text-sm
text-base
text-lg
text-xl
text-2xl
text-3xl
text-4xl
text-5xl
text-6xl
text-7xl
text-8xl
text-9xl
```

Пример для нашего сайта:

```tsx
Hero title:       text-7xl md:text-8xl xl:text-9xl
Section title:    text-5xl md:text-5xl
Description:      text-lg md:text-xl
Card title:       text-xl
Button text:      text-base md:text-lg
```

## Tailwind: Жирность Шрифта

Жирность задается классами:

```tsx
font-thin
font-extralight
font-light
font-normal
font-medium
font-semibold
font-bold
font-extrabold
font-black
```

Соответствие числам:

```text
font-thin       100
font-extralight 200
font-light      300
font-normal     400
font-medium     500
font-semibold   600
font-bold       700
font-extrabold  800
font-black      900
```

Для шрифта Oswald важно не перебарщивать с жирностью. Oswald сам по себе узкий, высокий и выразительный. Если поставить `font-black` на большой заголовок, он может стать слишком тяжелым.

Для нашего сайта хорошая логика такая:

```text
Hero title:        font-normal / font-medium
Section title:     font-bold
Description text:  font-light / font-normal
Card title:        font-normal / font-medium
Button text:       font-bold
```

Почему так:

- главный заголовок и так большой, ему не всегда нужна максимальная жирность;
- заголовки секций должны быть уверенными, поэтому `font-bold`;
- описания должны легко читаться, поэтому `font-light` или `font-normal`;
- кнопки должны быть заметными, поэтому `font-bold`.

Хорошая страница строится так:

```text
1. Сначала взгляд идет на главный заголовок.
2. Потом на описание.
3. Потом на кнопки.
4. Потом на карточки и детали.
```
## Tailwind: justify

`justify-*` управляет расположением элементов по главной оси.

Если блок `flex-row`, главная ось идет слева направо.

```tsx
<div className="flex justify-between">
```

Основные значения:

```tsx
justify-start
justify-center
justify-end
justify-between
justify-around
justify-evenly
```

Как работают:

```text
justify-start
[1][2][3]----------------

justify-center
--------[1][2][3]--------

justify-end
----------------[1][2][3]

justify-between
[1]--------[2]--------[3]

justify-around
---[1]------[2]------[3]---

justify-evenly
----[1]----[2]----[3]----
```

Разница:

- `justify-start` — прижимает элементы к началу.
- `justify-center` — ставит группу по центру.
- `justify-end` — прижимает элементы к концу.
- `justify-between` — первый элемент к левому краю, последний к правому, расстояние между ними одинаковое.
- `justify-around` — добавляет воздух вокруг каждого элемента.
- `justify-evenly` — делает все промежутки одинаковыми: слева, между элементами и справа.

Фишка:

`justify-between` хорошо работает, когда нужно развести две части:

```text
[логотип]----------------[меню]
```

Но для карточек может быть плохо:

```text
[card]-----------[card]-----------[card]
```

Если карточки слишком сильно разъезжаются, лучше использовать:

```tsx
justify-center gap-6
```

Так расстояния контролируются через `gap`, а не растягиваются на всю ширину контейнера.
