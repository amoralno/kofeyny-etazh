/* =============================================================
   Кофейный этаж — витрина кофейни
   Всё, что двигается на странице, живёт здесь: данные о товарах,
   фильтры и корзина. Никаких сборщиков и библиотек.

   Как читать файл: сначала данные (CONFIG), потом состояние
   (что сейчас выбрано и что в корзине), потом функции, которые
   это состояние перерисовывают. Один источник правды на весь
   файл — поэтому счётчик в шапке, панель и сумма не могут
   разойтись между собой.
   ============================================================= */

'use strict';


/* =============================================================
   1. ДАННЫЕ
   Демонстрационные: названия выдуманы, реальных брендов нет.
   Чтобы заменить на свои — правь только этот массив, остальной
   скрипт подстроится сам, включая список категорий.

   category — категория. Список фильтра собирается из этих же
   строк, поэтому добавил товар — он сам появился в фильтре.
   icon     — имя иконки из ICONS ниже (никаких картинок).
   photo    — необязательное поле. Путь к фотографии товара
              относительно index.html, например 'images/c2.jpg'.
              Фотография кладётся размытым фоном под рисунком.
              Нет поля — обложка остаётся цветной, как раньше.
   specs    — характеристики для карточки товара. Объект,
              потому что порядок пар в нём сохраняется и строки
              выводятся в том же порядке, что записаны.
   p1 / p2  — координаты световых пятен на обложке, чтобы
              карточки не выглядели одинаковыми.
   rate     — оценка, по ней сортировка «по популярности».
   ============================================================= */
const CONFIG = [
  {
    id: 'c1',
    name: 'Эспрессо «Ночная смена»',
    category: 'Кофе',
    price: 890,
    note: 'Тёмная обжарка, плотное тело, ноты какао и сухофруктов.',
    icon: 'espresso',
    photo: 'images/c1.jpg',
    specs: { Обжарка: 'тёмная', Помол: 'в зёрнах', Вес: '250 г', Выход: '18–20 мл' },
    p1: '30% 28%',
    p2: '72% 74%',
    rate: 4.9,
  },
  {
    id: 'c2',
    name: 'Арабика «Эфиопия»',
    category: 'Кофе',
    price: 1240,
    note: 'Светлая обжарка, мытая обработка: жасмин и лимон.',
    icon: 'beans',
    photo: 'images/c2.jpg',
    specs: { Регион: 'Иргачефф', Обработка: 'мытая', Обжарка: 'светлая', Вес: '250 г' },
    p1: '24% 66%',
    p2: '76% 30%',
    rate: 4.8,
  },
  {
    id: 'c3',
    name: 'Декаф «Вечер»',
    category: 'Кофе',
    price: 990,
    note: 'Без кофеина, но со вкусом. На вечер и на брюнет.',
    icon: 'moon',
    photo: 'images/c3.jpg',
    specs: { Кофеин: 'нет', Метод: 'декофеинизация', Обжарка: 'средняя', Вес: '250 г' },
    p1: '68% 24%',
    p2: '30% 70%',
    rate: 4.5,
  },
  {
    id: 'c4',
    name: 'Кофе молотый',
    category: 'Кофе',
    price: 590,
    note: 'Средний помол, мешочек на пару литров. Годится и в турку.',
    icon: 'scoop',
    photo: 'images/c4.jpg',
    specs: { Помол: 'средний', Обжарка: 'средняя', Расход: '18 г на чашку', Вес: '500 г' },
    p1: '26% 30%',
    p2: '74% 70%',
    rate: 4.7,
  },
  {
    id: 'c5',
    name: 'Кофе в зёрнах, 1 кг',
    category: 'Кофе',
    price: 1690,
    note: 'Большая пачка для офиса. Мелить прямо перед заваркой.',
    icon: 'beans',
    photo: 'images/c5.jpg',
    specs: { Форма: 'в зёрнах', Обжарка: 'средняя', Расход: '18 г на чашку', Вес: '1 кг' },
    p1: '68% 26%',
    p2: '30% 72%',
    rate: 4.6,
  },
  {
    id: 'c6',
    name: 'Растворимый кофе',
    category: 'Кофе',
    price: 340,
    note: 'Когда мельница не под рукой. Размешивается прямо в чашке.',
    icon: 'jar',
    photo: 'images/c6.jpg',
    specs: { Форма: 'растворимый', Обжарка: 'тёмная', Расход: '1 ч. л. на чашку', Вес: '250 г' },
    p1: '30% 62%',
    p2: '72% 34%',
    rate: 4.5,
  },
  {
    id: 'c7',
    name: 'Сироп «Карамель»',
    category: 'Кофе',
    price: 380,
    note: 'Густой, с солёной карамелью. Одна ложка — и напиток мягче.',
    icon: 'jar',
    photo: 'images/c7.jpg',
    specs: { Вкус: 'карамель', Состав: 'сахар, вода, соль', Добавление: '5–10 мл в чашку', Объём: '250 мл' },
    p1: '72% 30%',
    p2: '28% 70%',
    rate: 4.4,
  },
  {
    id: 't1',
    name: 'Шу пуэр, 2019',
    category: 'Чай',
    price: 1290,
    note: 'Выдержанный на полках. Землисто-сливовый, терпкости нет.',
    icon: 'teapot',
    photo: 'images/t1.jpg',
    specs: { Вид: 'шу пуэр', Сбор: '2019', Форма: 'прессованный', Вес: '100 г' },
    p1: '32% 30%',
    p2: '70% 68%',
    rate: 4.7,
  },
  {
    id: 't2',
    name: 'Ассам второго сбора',
    category: 'Чай',
    price: 780,
    note: 'Листовой, крепкий. Хлебная сладость и лёгкая терпкость.',
    icon: 'leaf',
    specs: { Сбор: 'второй', Лист: 'крупный', Крепость: 'высокая', Вес: '100 г' },
    p1: '26% 62%',
    p2: '74% 34%',
    rate: 4.4,
  },
  {
    id: 't3',
    name: 'Мята и ромашка',
    category: 'Чай',
    price: 640,
    note: 'Травяной сбор. Заваривать крутым и недолго.',
    icon: 'herb',
    specs: { Состав: 'мята, ромашка', Кофеин: 'нет', Форма: 'рассыпной', Вес: '80 г' },
    p1: '70% 30%',
    p2: '28% 66%',
    rate: 4.6,
  },
  {
    id: 'p1',
    name: 'Кемекс V60',
    category: 'Посуда',
    price: 3200,
    note: 'Стекло, шесть граммов на чашку. Мыть раз в неделю.',
    icon: 'dripper',
    photo: 'images/p1.jpg',
    specs: { Материал: 'стекло', Размер: 'V60', Объём: '600 мл', Дозировка: '6 г' },
    p1: '28% 26%',
    p2: '74% 72%',
    rate: 4.8,
  },
  {
    id: 'p2',
    name: 'Турка медная',
    category: 'Посуда',
    price: 2240,
    note: 'Толстое дно и деревянная ручка. Для кофе на огне.',
    icon: 'cezve',
    photo: 'images/p2.jpg',
    specs: { Материал: 'медь', Объём: '350 мл', Ручка: 'дерево', Покрытие: 'нет' },
    p1: '34% 68%',
    p2: '70% 28%',
    rate: 4.5,
  },
  {
    id: 'p3',
    name: 'Чашка для капучино',
    category: 'Посуда',
    price: 980,
    note: 'Толстая керамика держит тепло. 220 мл, с блюдцем.',
    icon: 'cup',
    photo: 'images/p3.jpg',
    specs: { Материал: 'керамика', Объём: '220 мл', Диаметр: '80 мм', Блюдце: 'в комплекте' },
    p1: '64% 26%',
    p2: '32% 72%',
    rate: 4.7,
  },
  {
    id: 'b1',
    name: 'Темпер 58 мм',
    category: 'Бариста',
    price: 1890,
    note: 'Сталь и ровное дно. Порошок выходит ровным.',
    icon: 'tamper',
    photo: 'images/b1.jpg',
    specs: { Диаметр: '58 мм', Высота: '55 мм', Материал: 'нержавеющая сталь', Вес: '480 г' },
    p1: '30% 34%',
    p2: '72% 68%',
    rate: 4.9,
  },
  {
    id: 'b2',
    name: 'Кофейные весы',
    category: 'Бариста',
    price: 3400,
    note: 'Шаг в 0,1 г, таймер и подставка под чашку.',
    icon: 'scale',
    photo: 'images/b2.jpg',
    specs: { Максимум: '2000 г', Точность: '0,1 г', Таймер: 'есть', Подставка: 'есть' },
    p1: '26% 60%',
    p2: '76% 36%',
    rate: 4.6,
  },
  {
    id: 'b3',
    name: 'Ситечко для капучино',
    category: 'Бариста',
    price: 590,
    note: 'Стальная сетка на пружине. Моется кипятком за минуту.',
    icon: 'strainer',
    photo: 'images/b3.jpg',
    specs: { Диаметр: '58 мм', Сетка: 'нержавеющая', Крепление: 'пружина' },
    p1: '68% 62%',
    p2: '30% 32%',
    rate: 4.3,
  },
];

/* Иллюстрации товаров — контуры, одним и тем же стилем.
   Каждая строка — набор SVG-путей в системе координат 64×64:
   поле достаточно крупное, чтобы нарисовать предмет целиком,
   а не значок. Поле icon товара ссылается на название здесь.

   Плюс и минус живут в той же сетке, но толще: их рисуют
   кнопки по 14 пикселей, и тонкий штрих там просто исчезает. */
const ICONS = {
  // Эспрессо: чашка, crema, блюдце
  espresso: [
    'M15 24h28v11a14 14 0 0 1-28 0z',
    'M17 29h24',
    'M43 28h4.5a6 6 0 0 1 0 12H43',
    'M8 52c3 3.5 13 6 24 6s21-2.5 24-6',
  ],
  // Зёрна в россыпи: три штуки, на каждой бороздка
  beans: [
    'M22 12c7 0 12 6 12 13s-5 13-12 13-12-6-12-13 5-13 12-13z',
    'M28 12c-4 8-4 18 0 26',
    'M45 20c5 0 9 4.5 9 10s-4 10-9 10-9-4.5-9-10 4-10 9-10z',
    'M49 21c-3 6-3 12 0 18',
    'M24 44c4.5 0 8 3.5 8 8s-3.5 8-8 8-8-3.5-8-8 3.5-8 8-8z',
    'M28 45c-2.5 4-2.5 10 0 14',
  ],
  // Вечер: полумесяц и две звезды
  moon: [
    'M60 22.2A15 15 0 0 1 41 3a15 15 0 1 0 19.2 19.2z',
    'M14 8l1.6 4.4L20 14l-4.4 1.6L14 20l-1.6-4.4L8 14l4.4-1.6z',
    'M46 10l1 3 3 1-3 1-1 3-1-3-3-1 3-1z',
  ],
  // Ложка с молотым кофе: овал чаши, горка сверху, ручка вниз.
  // Горка обязательна — пустой овал с ручкой читается
  // как зеркало, а не как ложка
  scoop: [
    'M12 30a20 15 0 1 0 40 0a20 15 0 1 0-40 0z',
    'M18 27c3-7 25-7 28 0',
    'M32 45v13',
  ],
  // Банка растворимого кофе: крышка, тело, линия заполнения
  // и зерно на этикетке
  jar: [
    'M14 14h36v7H14z',
    'M18 21h28v29a6 6 0 0 1-6 6H24a6 6 0 0 1-6-6z',
    'M18 31h28',
    'M28 38a4 5 0 1 0 8 0a4 5 0 1 0-8 0z',
    'M32 39c-1 2-1 4 0 7',
  ],
  // Чайник: крышка с knob, широкий носик, дуга ручки.
  // Носик нарисован формой, а не линией: тонкая кривая
  // рядом с ручкой читалась как вторая ручка, и чайник
  // получался кружкой
  teapot: [
    'M32 17v5',
    'M26 28a6 6 0 0 1 12 0',
    'M22 28h20l-2 22a3 3 0 0 1-3 3h-10a3 3 0 0 1-3-3z',
    'M42 32c6 1 8-2 9-6l4 1c-1 6-5 10-13 10z',
    'M21 31h-6a5 5 0 0 0 0 12h6',
  ],
  // Лист: жилка и боковые прожилки
  leaf: [
    'M58 10c0 26-12 40-30 40a16 16 0 0 1-16-16C12 14 34 8 58 10z',
    'M11 37C24 31 40 21 57 12',
    'M22 30l-2-10',
    'M31 25v-11',
    'M41 20l2-11',
  ],
  // Ромашка и мята: два стебля рядом.
  // Лепестки — короткие овалы вплотную к сердцевине.
  // Длинные тонкие линии от центра читались бы как солнце
  herb: [
    'M20 33v25',
    'M20 19a7 7 0 1 0 0 14a7 7 0 1 0 0-14z',
    'M20 11.8a2.2 3.2 0 1 0 0 6.4a2.2 3.2 0 1 0 0-6.4z',
    'M5.8 26a3.2 2.2 0 1 0 6.4 0a3.2 2.2 0 1 0-6.4 0z',
    'M27.8 26a3.2 2.2 0 1 0 6.4 0a3.2 2.2 0 1 0-6.4 0z',
    'M27.8 15.8a2.4 2.4 0 1 0 0 4.8a2.4 2.4 0 1 0 0-4.8z',
    'M12.2 15.8a2.4 2.4 0 1 0 0 4.8a2.4 2.4 0 1 0 0-4.8z',
    'M27.8 31a2.4 2.4 0 1 0 0 4.8a2.4 2.4 0 1 0 0-4.8z',
    'M12.2 31a2.4 2.4 0 1 0 0 4.8a2.4 2.4 0 1 0 0-4.8z',
    'M20 50c-7 0-11-5-11-11 7 0 11 5 11 11z',
    'M20 57c7 0 11-5 11-11-7 0-11 5-11 11z',
    'M46 58V32',
    'M46 32c5 0 8-3 8-7-5 0-8 3-8 7z',
    'M46 40c-6 0-9-4-9-9 6 0 9 4 9 9z',
    'M46 40c6 0 9-4 9-9-6 0-9 4-9 9z',
    'M46 50c-6 0-9-4-9-9 6 0 9 4 9 9z',
    'M46 50c6 0 9-4 9-9-6 0-9 4-9 9z',
  ],
  // Воронка на сервере: рёбра, фильтр, напиток
  dripper: [
    'M8 10h48L40 34H24L8 10z',
    'M20 12l6 20',
    'M32 11v21',
    'M44 12l-6 20',
    'M24 36h16v11a8 8 0 0 1-16 0z',
    'M26 42h12v5a6 6 0 0 1-12 0z',
    'M20 57h24',
  ],
  // Турка: корпус расширяется книзу, ручка — широкая планка
  cezve: [
    'M29 4v4',
    'M23 14a6 6 0 0 1 12 0',
    'M18 14h20',
    'M22 14h12v6H22z',
    'M22 20h12l6 30a4 4 0 0 1-4 5H20a4 4 0 0 1-4-5z',
    'M36 24l20-7',
    'M36 30l20-7',
    'M56 17v6',
  ],
  // Капучино: чашка, сердце в пенке, блюдце, пар
  cup: [
    'M14 26h30v9a15 9 0 0 1-30 0z',
    'M44 29h5a5.5 5.5 0 0 1 0 11h-5',
    'M29 39c-4.5-3-7-5.2-7-7.7a3.6 3.6 0 0 1 7-1.6a3.6 3.6 0 0 1 7 1.6c0 2.5-2.5 4.7-7 7.7z',
    'M8 46c4 3 12 4.5 24 4.5S52 49 56 46',
    'M22 22c0-4 4-4 4-8',
    'M34 22c0-4 4-4 4-8',
  ],
  // Темпер: широкий купол, узкая талия, широкое основание.
  // Перехват обязателен — если все три части одной ширины,
  // получается ведро, а не темпер
  tamper: [
    'M32 8a9 9 0 0 1 9 9H23a9 9 0 0 1 9-9z',
    'M28 17h8v10h-8z',
    'M22 27h20v5H22z',
    'M23 32h18v24a3 3 0 0 1-3 3H26a3 3 0 0 1-3-3z',
  ],
  // Весы: платформа, дисплей, кнопки
  scale: [
    'M8 12h48',
    'M14 16h36a3 3 0 0 1 3 3v30a3 3 0 0 1-3 3H14a3 3 0 0 1-3-3V19a3 3 0 0 1 3-3z',
    'M19 24h26v13H19z',
    'M23 28v5',
    'M30 28v5',
    'M37 28v5',
    'M19 44h9v6h-9z',
    'M32 44h9v6h-9z',
  ],
  // Ситечко: ободок, сетка, ручка
  strainer: [
    'M8 14h48',
    'M12 16h40l-4 18a16 16 0 0 1-32 0z',
    'M18 18v14',
    'M26 17v17',
    'M34 17v17',
    'M42 18v14',
    'M15 28h34',
    'M29 50h6v9h-6z',
  ],
  plus: ['M32 18v28', 'M18 32h28'],
  minus: ['M18 32h28'],
};

/* Ключ в localStorage. Версия в конце — на случай, если позже
   поменяется формат корзины: старую можно будет не читать,
   а просто заменить ключ на shop.cart.v2 */
const STORAGE_KEY = 'shop.cart.v1';


/* =============================================================
   2. СОСТОЯНИЕ
   Три переменных, которые описывают весь интерфейс целиком.
   Всё остальное — производные от них, поэтому «правда»
   всегда в одном месте. */
const state = {
  category: 'all',   // активная категория, 'all' — показывать всё
  query: '',         // строка поиска
  sort: 'popular',   // режим сортировки
  cart: [],          // [{ id, qty }, ...]
};

/* Открытое модальное окно: панель, куда заперт фокус, и кнопка,
   на которую фокус вернётся при закрытии.

   Окно одно за раз — и корзина, и карточка товара. Если бы
   открылись оба, Escape закрыл бы не то, что на экране сверху,
   а фокус ушёл бы внутрь невидимого. Хранится здесь, а не в
   state, потому что это не состояние интерфейса, а его временное
   условие: запертый фокус к фильтрам отношения не имеет. */
let openPanel = null;

/* Режимы сортировки. Подпись и правило сравнения лежат рядом,
   поэтому список в кнопке и реальный порядок товаров разойтись
   не могут: добавил режим — он появился в обоих местах.

   Раньше здесь лежали только функции сравнения, а подписи вариантов
   жили в HTML отдельным <select>. Правка одного места молча
   забывала другое, и список предлагал то, что не работало */
const SORTS = {
  popular: {
    label: 'по популярности',
    compare: (a, b) => b.rate - a.rate,
  },
  cheap: {
    label: 'сначала дешёвые',
    compare: (a, b) => a.price - b.price,
  },
  expensive: {
    label: 'сначала дорогие',
    compare: (a, b) => b.price - a.price,
  },
  name: {
    label: 'по названию',
    compare: (a, b) => a.name.localeCompare(b.name, 'ru'),
  },
};


/* =============================================================
   3. МЕЛОЧИ, КОТОРЫЕ ПРИГОДЯТСЯ ВСЕМ
   ============================================================= */
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

/* Создаёт SVG из массива путей в общей сетке 64×64.
   createElementNS обязателен: элементы <path> создаются
   в «пространстве» SVG, обычным createElement браузер их
   не поймёт.

   Ширина штриха задаётся в единицах этой сетки, а не в пикселях:
   картинка уменьшается стилями, и вместе с ней уменьшается штрих.
   Поэтому для крупных иллюстраций хватает 2, а для плюсиков
   в кнопках 14 пикселей нужно 6 — иначе линия исчезает. */
function makeIcon(paths, strokeWidth = 2) {
  const NS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', '0 0 64 64');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', String(strokeWidth));
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('stroke-linejoin', 'round');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');

  for (const d of paths) {
    const path = document.createElementNS(NS, 'path');
    path.setAttribute('d', d);
    svg.appendChild(path);
  }
  return svg;
}

/* «1 товар», «2 товара», «5 товаров» — в русском языке форма
   слова зависит от последней цифры, а не от «больше-меньше 10» */
function plural(count, forms) {
  const n = Math.abs(count) % 100;
  if (n > 10 && n < 20) return forms[2];
  switch (count % 10) {
    case 1: return forms[0];
    case 2:
    case 3:
    case 4: return forms[1];
    default: return forms[2];
  }
}

const money = (value) => new Intl.NumberFormat('ru-RU').format(value) + ' ₽';

const findProduct = (id) => CONFIG.find((item) => item.id === id);

/* Количество товара в корзине. 0, если его там нет */
function inCart(id) {
  const line = state.cart.find((item) => item.id === id);
  return line ? line.qty : 0;
}

const cartTotalQty = () => state.cart.reduce((sum, line) => sum + line.qty, 0);
const cartTotalSum = () =>
  state.cart.reduce((sum, line) => {
    const product = findProduct(line.id);
    return product ? sum + product.price * line.qty : sum;
  }, 0);


/* =============================================================
   4. КОРЗИНА В localStorage
   Главное отличие магазина от обычной страницы: корзина
   переживает перезагрузку. Храним не товары, а только пары
   «id + количество» — цены берём из CONFIG, чтобы старая
   цена из хранилища не показывалась после правки данных.
   ============================================================= */
function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    // Проверяем каждую позицию: в хранилище может лежать
    // мусор (правка вручную в DevTools, старый формат ключа),
    // а товара с таким id в каталоге уже могло не стать
    return parsed
      .filter(
        (line) =>
          line &&
          typeof line.id === 'string' &&
          Number.isInteger(line.qty) &&
          line.qty > 0 &&
          findProduct(line.id),
      )
      .map((line) => ({ id: line.id, qty: line.qty }));
  } catch {
    // Приватный режим или отключённое хранилище: работаем
    // без сохранения, но не падаем — витрина должна жить
    return [];
  }
}

function saveCart() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.cart));
  } catch {
    // Не сохранилось — не беда: корзина живёт до перезагрузки
  }
}

/* Единственное место, где корзина меняется. Всё остальное
   только читает state.cart и перерисовывает интерфейс. */
function setQty(id, qty) {
  const line = state.cart.find((item) => item.id === id);

  if (qty <= 0) {
    state.cart = state.cart.filter((item) => item.id !== id);
  } else if (line) {
    line.qty = qty;
  } else {
    state.cart.push({ id, qty });
  }

  saveCart();
  renderCart();
  syncBuyRows();
}

const addToCart = (id) => setQty(id, inCart(id) + 1);
const removeFromCart = (id) => setQty(id, 0);

function clearCart() {
  state.cart = [];
  saveCart();
  renderCart();
  syncBuyRows();
}


/* =============================================================
   5. ФИЛЬТРЫ
   ============================================================= */

/* Категории собираются из данных, а не пишутся руками:
   добавил товар с новой категорией — кнопка появится сама.

   Кнопки строятся один раз, а при выборе обновляется только их
   состояние. Если бы мы перерисовывали их заново, нажатая кнопка
   исчезла бы из страницы вместе с фокусом — выбравший категорию
   с клавиатуры терял бы место в списке. */
function buildCategories() {
  const box = $('#categories');
  const categories = [...new Set(CONFIG.map((item) => item.category))];

  box.textContent = '';

  for (const key of ['all', ...categories]) {
    const chip = document.createElement('button');
    chip.className = 'chip';
    chip.type = 'button';
    chip.dataset.category = key;
    chip.textContent = key === 'all' ? 'Все' : key;

    box.appendChild(chip);
  }
}

/* Подсветка выбранной категории. У активной кнопки роль нажатой,
   чтобы состояние читалось и на слух, а не только цветом */
function syncCategoryChips() {
  for (const chip of $$('#categories .chip')) {
    const active = chip.dataset.category === state.category;
    chip.classList.toggle('is-active', active);
    chip.setAttribute('aria-pressed', String(active));
  }
}

/* Что попадёт в каталог: сначала режем по поиску и категории,
   потом сортируем. Возвращаем готовый список — сама функция
   ничего не рисует, её легко предсказать глазами. */
function selectProducts() {
  const query = state.query.trim().toLowerCase();

  const found = CONFIG.filter((item) => {
    if (state.category !== 'all' && item.category !== state.category) return false;
    if (!query) return true;
    // Ищем и по названию, и по описанию: человек ищет
    // «беспроводная», а не точное имя товара
    return (item.name + ' ' + item.note).toLowerCase().includes(query);
  });

  return found.sort((SORTS[state.sort] || SORTS.popular).compare);
}


/* =============================================================
   6. КАТАЛОГ
   ============================================================= */
/* Обложка товара: контурный рисунок на цветном фоне, а если
   у товара есть поле photo — ещё и фотография под рисунком.

   Функция общая у карточки и окна товара, иначе фотография
   могла бы появиться в одном месте и не появиться в другом.

   Тег передаётся параметром: на карточке обложка открывает
   окно, поэтому должна быть кнопкой, а внутри уже открытого
   окна кнопка быть не может. */
function createVisual(product, tagName) {
  const visual = document.createElement(tagName);
  visual.className = 'product__visual';

  // Рисунок — кнопка открытия окна товара. Не вся карточка:
  // вложить в кнопку ещё и текст с кнопкой «В корзину» нельзя
  // (кнопка в кнопке недопустима), а делать карточку ссылкой —
  // значит уводить её в отдельную страницу, которой нет
  if (tagName === 'button') {
    visual.type = 'button';
    visual.dataset.open = product.id;
    // Внутри кнопки только рисунок с aria-hidden, поэтому своего
    // названия у неё нет вообще: скринридер читает просто
    // «кнопка». Подпись задаём явно, чтобы было понятно, что
    // нажатие откроет именно этот товар
    visual.setAttribute('aria-label', `Подробнее о товаре: ${product.name}`);
  }

  // Пятна на обложке задаём переменными из данных — так каждая
  // карточка своя, хотя фон рисует один и тот же CSS
  visual.style.setProperty('--p1', product.p1);
  visual.style.setProperty('--p2', product.p2);

  // Фотография необязательна: поле photo есть не у всех товаров
  if (product.photo) {
    visual.classList.add('has-photo');
    visual.style.setProperty('--photo', `url("${product.photo}")`);
  }

  const glyph = document.createElement('div');
  glyph.className = 'product__glyph';
  glyph.appendChild(makeIcon(ICONS[product.icon] || ICONS.espresso));
  visual.appendChild(glyph);

  return visual;
}

function createCard(product) {
  const card = document.createElement('article');
  card.className = 'product';

  // --- обложка ---
  const visual = createVisual(product, 'button');

  // --- текст ---
  const body = document.createElement('div');
  body.className = 'product__body';

  const cat = document.createElement('p');
  cat.className = 'product__cat';
  cat.textContent = product.category;

  const name = document.createElement('h2');
  name.className = 'product__name';

  // Название тоже открывает окно — но не отдельной кнопкой:
  // иначе на каждую карточку пришлось бы дважды ходить по Tab.
  // Ссылка снимается с порядка обхода клавишей, но остаётся
  // доступной мышью: писать «нажми, чтобы открыть» на глазу
  // не нужно, а вот лишний Tab мешал бы
  const nameLink = document.createElement('a');
  nameLink.href = '#';
  nameLink.tabIndex = -1;
  nameLink.textContent = product.name;
  nameLink.addEventListener('click', (event) => {
    event.preventDefault();
    openProductModal(product.id);
  });
  name.appendChild(nameLink);

  const note = document.createElement('p');
  note.className = 'product__note';
  note.textContent = product.note;

  // --- покупка ---
  const buy = document.createElement('div');
  buy.className = 'product__buy';

  const price = document.createElement('span');
  price.className = 'product__price';
  price.textContent = money(product.price);

  buy.append(price, createBuyBlock(product));
  body.append(cat, name, note, buy);
  card.append(visual, body);

  return card;
}

function renderCatalog() {
  const grid = $('#grid');
  const products = selectProducts();

  // Чистим сетку через textContent: одной операцией удаляет
  // всех прежних детей, без ручного цикла
  grid.textContent = '';
  for (const product of products) grid.appendChild(createCard(product));

  // Пустой экран без пояснения читается как поломка,
  // поэтому при нуле показываем блок с подсказкой
  $('#empty').hidden = products.length > 0;
  $('#resultLine').textContent = products.length
    ? `${products.length} ${plural(products.length, ['товар', 'товара', 'товаров'])}`
    : 'Ничего не нашлось';

  syncBuyRows();
}

/* Блок покупки: кнопка добавления и счётчик количества.
   Оба элемента создаются сразу и переключаются скрытием.

   Почему не один элемент, который перерисовывается: перерисовка
   уничтожила бы нажатую кнопку вместе с фокусом. Здесь элементы
   живут постоянно, и после нажатия «+» фокус остаётся на месте. */
function createBuyBlock(product) {
  const box = document.createElement('div');
  box.className = 'buy';
  // По этой метке syncBuyRows находит блок после изменения корзины
  box.dataset.id = product.id;

  const add = document.createElement('button');
  add.className = 'btn btn--primary buy__add';
  add.type = 'button';
  add.dataset.add = product.id;
  add.textContent = 'В корзину';
  add.setAttribute('aria-label', `Добавить в корзину: ${product.name}`);

  box.append(add, createQtyControl(product.id));
  syncBuyBlock(box, product.id);
  return box;
}

/* Переключает кнопку на счётчик и обновляет цифру. Вызывается
   и при создании блока, и после каждого изменения корзины. */
function syncBuyBlock(box, id) {
  const qty = inCart(id);
  const added = qty > 0;

  const add = $('.buy__add', box);
  const control = $('.qty', box);

  // Помечаем, где стоял фокус: после переключения он может
  // оказаться на скрытой кнопке, и его надо перенести
  const focused = box.contains(document.activeElement)
    ? document.activeElement
    : null;

  add.hidden = added;
  control.hidden = !added;
  $('.qty__value', control).textContent = String(qty);
  $('.qty__btn', control).disabled = qty <= 1;

  if (focused && focused.offsetParent === null) {
    // Нажали «В корзину» — товар появился, кнопка исчезла,
    // и фокус надо куда-то перенести. Раньше он уезжал на «−»,
    // но при одной штуке «−» отключена, а на отключённую кнопку
    // фокус не встаёт: он молча падал обратно на <body>, и дальше
    // по Tab приходилось начинать страницу заново. Берём «+» —
    // она рабочая при любом количестве
    const next = added ? $$('.qty__btn', control)[1] || add : add;
    if (next) next.focus();
  }
}

/* Обновляет все блоки покупки на странице: и в каталоге, и
   в открытом окне товара — они читают одну и ту же корзину. */
function syncBuyRows() {
  for (const box of $$('.buy')) syncBuyBlock(box, box.dataset.id);
}


/* =============================================================
   7. СЧЁТЧИК КОЛИЧЕСТВА

   Живёт в трёх местах: в строке корзины, на карточке товара
   и в окне товара. Поэтому одна функция, а не три копии —
   иначе они разъедутся при первом же правке.

   Минус гаснет при одной штуке: нажатие удалит товар целиком,
   а по кнопке «−» это не ожидаешь. Чтобы «−» просто не
   сработала, кнопку отключаем — иначе она выглядит живой,
   но ничего не делает.
   ============================================================= */
function createQtyControl(id) {
  const product = findProduct(id);
  const qty = inCart(id);

  const box = document.createElement('div');
  box.className = 'qty';
  // По этой метке syncBuyRows находит блок после изменения корзины
  box.dataset.id = id;

  const step = (value, label, glyph) => {
    const button = document.createElement('button');
    button.className = 'qty__btn';
    button.type = 'button';
    button.dataset.step = value;
    button.dataset.id = id;
    button.setAttribute('aria-label', `${label}: ${product.name}`);
    button.appendChild(makeIcon(glyph, 6));
    if (value < 0 && qty <= 1) button.disabled = true;
    return button;
  };

  const minus = step('-1', 'Убрать одну штуку', ICONS.minus);
  const plus = step('1', 'Добавить ещё одну', ICONS.plus);

  const value = document.createElement('span');
  value.className = 'qty__value';
  value.textContent = String(qty);

  box.append(minus, value, plus);
  return box;
}


/* =============================================================
   8. ПАНЕЛЬ КОРЗИНЫ
   ============================================================= */
function createCartLine(line) {
  const product = findProduct(line.id);

  const item = document.createElement('div');
  item.className = 'cart-item';

  const name = document.createElement('p');
  name.className = 'cart-item__name';
  name.textContent = product.name;

  const price = document.createElement('p');
  price.className = 'cart-item__price';
  price.textContent = money(product.price * line.qty);

  const note = document.createElement('p');
  note.className = 'cart-item__note';
  note.textContent = `${money(product.price)} × ${line.qty}`;

  const qty = createQtyControl(line.id);

  const remove = document.createElement('button');
  remove.className = 'cart-item__remove';
  remove.type = 'button';
  remove.dataset.remove = line.id;
  remove.textContent = 'Убрать';

  item.append(name, price, note, qty, remove);
  return item;
}


/* Перерисовывает корзину целиком. Позиции меняются только
   этой функцией — ни одна другая не трогает список строк */
function renderCart() {
  const box = $('#cartItems');
  box.textContent = '';
  for (const line of state.cart) box.appendChild(createCartLine(line));

  const isEmpty = state.cart.length === 0;
  $('#cartEmpty').hidden = !isEmpty;
  $('#cartClear').hidden = isEmpty;
  $('#cartTotal').textContent = money(cartTotalSum());

  // Счётчик в шапке считает штуки, а не позиции: три позиции
  // по одной и одна позиция по три — для покупателя это разное
  const count = cartTotalQty();
  const badge = $('#cartCount');
  badge.textContent = String(count);
  badge.dataset.empty = String(count === 0);
  $('#cartBtn').setAttribute(
    'aria-label',
    count ? `Открыть корзину, товаров: ${count}` : 'Открыть корзину',
  );
}

/* =============================================================
   9. ОКНО ТОВАРА

   Открывается нажатием на карточку. Показывает то же, что
   лежит в CONFIG, но целиком: рисунок, описание и таблицу
   характеристик — на карточке для них нет места.

   Окно одно на весь магазин и переиспользуется: при открытии
   другого товара содержимое заменяется. Строить и удалять
   разметку каждый раз дороже, да и фокус на кнопке закрытия
   пришлось бы искать заново.
   ============================================================= */
function renderProductModal(product) {
  $('#productModalTitle').textContent = product.name;

  const box = $('#productModalBody');
  box.textContent = '';
  box.style.setProperty('--p1', product.p1);
  box.style.setProperty('--p2', product.p2);

  // --- рисунок на своём фоне с пятнами, как обложка карточки ---
  box.appendChild(createVisual(product, 'div'));

  // --- текст и характеристики ---
  const text = document.createElement('div');
  text.className = 'modal__text';

  const note = document.createElement('p');
  note.className = 'modal__note';
  note.textContent = product.note;
  text.appendChild(note);

  // Характеристики — обычный список «пара: значение». Именно
  // список, а не таблица: пара короткая, таблица ради пары
  // выглядит рамкой вокруг пустоты
  const specs = document.createElement('dl');
  specs.className = 'specs';

  for (const [key, value] of Object.entries(product.specs || {})) {
    const dt = document.createElement('dt');
    dt.textContent = key;

    const dd = document.createElement('dd');
    dd.textContent = value;

    specs.append(dt, dd);
  }

  text.appendChild(specs);
  box.appendChild(text);

  // --- покупка ---
  const buy = document.createElement('div');
  buy.className = 'modal__buy';

  const price = document.createElement('span');
  price.className = 'modal__price';
  price.textContent = money(product.price);
  buy.appendChild(price);

  // Тот же блок покупки, что на карточке: кнопка или счётчик
  buy.appendChild(createBuyBlock(product));
  box.appendChild(buy);

  return product;
}

/* Открывает окно с выбранным товаром. Товар мог исчезнуть из
   каталога, пока окно было закрыто (например, правка данных),
   поэтому проверяем и просто выходим, если его нет. */
function openProductModal(id) {
  const product = findProduct(id);
  if (!product) return;

  renderProductModal(product);
  openModal('#productModal', '#productModalClose');
}

/* Открывает модальное окно: запоминает, откуда пришли, показывает
   панель, запирает страницу и ставит фокус внутрь. */
function openModal(selector, focusSelector) {
  // Окно одно за раз: открывая второе, закрываем первое, иначе
  // под верхним останется скрытое, но живое
  if (openPanel) closeModal();

  const modal = $(selector);
  openPanel = {
    modal,
    panel: $('.panel', modal),
    back: document.activeElement,
  };

  modal.hidden = false;
  document.body.classList.add('is-locked');
  $(focusSelector, modal).focus();
}

function closeModal() {
  if (!openPanel) return;

  const { modal, back } = openPanel;
  openPanel = null;

  modal.hidden = true;
  document.body.classList.remove('is-locked');

  // Фокус возвращаем туда, откуда открыли: иначе после закрытия
  // он падает на <body> и стрелками не поедешь. Проверка
  // document.contains — за время, пока окно было открыто, элемент
  // мог исчезнуть (например, карточка отфильтрована)
  if (back && document.contains(back)) back.focus();
}

const openCart = () => openModal('#cart', '#cartClose');
const closeCart = closeModal;

/* Панель объявлена как dialog: фокус не должен уходить на
   страницу под ней, поэтому держим Tab внутри панели. */
function keepFocusInside(event) {
  if (event.key !== 'Tab' || !openPanel) return;

  // offsetParent === null у спрятанных элементов (display: none).
  // Без этой проверки в «последнюю» кнопку списка попадал бы
  // скрытый «Очистить корзину»: фокусить его нельзя, и при пустой
  // корзине фокус уезжал бы из панели наружу — ловушка перестала бы
  // работать именно тогда, когда панель открыта, а товаров нет
  const focusable = $$(
    'button:not([disabled]), [href], input, select, [tabindex]:not([tabindex="-1"])',
    openPanel.panel,
  ).filter((el) => el.offsetParent !== null);

  if (!focusable.length) return;

  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}


/* =============================================================
   10. ЗАПУСК МОДУЛЕЙ
   Каждая часть страницы — отдельная функция init*.
   Вызовы обёрнуты в try/catch, чтобы сбой в одной части
   (например, в корзине) не оставлял страницу мёртвой:
   остальные модули всё равно запустятся.
   ============================================================= */
function initCategories() {
  $('#categories').addEventListener('click', (event) => {
    const chip = event.target.closest('[data-category]');
    if (!chip) return;

    state.category = chip.dataset.category;
    syncCategoryChips();
    renderCatalog();
  });
}

function initSearch() {
  $('#search').addEventListener('input', (event) => {
    // Поиск срабатывает на каждый символ: список из десятка
    // товаров перерисовывается мгновенно, ждать нечего
    state.query = event.target.value;
    renderCatalog();
  });
}

/* Сортировка — кнопка со своим списком.

   Системный <select> в закрытом виде ещё можно подкрасить, а вот
   раскрытое меню рисует операционная система, и на него не влияют
   ни цвет, ни шрифт, ни рамка. Поэтому список собственный.

   Клавиатура работает так же, как у настоящего выпадающего списка:
   Enter и пробел открывают, стрелки переходят по вариантам и
   заворачивают с краёв, Home и End прыгают в начало и конец,
   Enter выбирает, Escape закрывает и возвращает фокус на кнопку.

   Варианты строятся из SORTS — того же объекта, по которому
   идёт сортировка. Поэтому подписи в списке и настоящий порядок
   товаров не могут разойтись. */
function initSort() {
  const root = $('#sort');
  if (!root) return;

  const btn = $('#sortBtn', root);
  const list = $('#sortList', root);
  const value = $('#sortValue', root);

  const options = Object.entries(SORTS).map(([key, mode]) => {
    const option = document.createElement('button');
    option.className = 'select__option';
    option.type = 'button';
    option.role = 'option';
    option.dataset.value = key;
    option.textContent = mode.label;
    list.appendChild(option);
    return option;
  });

  /* Отметка выбранного. aria-selected читает скринридер,
     а точка акцентом в правом углу видит глаз: открытый список
     без неё не говорит, что выбрано сейчас */
  const mark = (option) => {
    for (const item of options) {
      item.setAttribute('aria-selected', String(item === option));
    }
    value.textContent = option.textContent;
  };

  const chosen = () => options.find((o) => o.dataset.value === state.sort) || options[0];

  const open = () => {
    list.hidden = false;
    root.classList.add('is-open');
    btn.setAttribute('aria-expanded', 'true');
    // Фокус сразу на выбранном варианте: продолжать от того,
    // что уже стоит, удобнее, чем от начала списка
    chosen().focus();
  };

  const close = (toButton = true) => {
    list.hidden = true;
    root.classList.remove('is-open');
    btn.setAttribute('aria-expanded', 'false');
    if (toButton) btn.focus();
  };

  const choose = (option) => {
    state.sort = option.dataset.value;
    mark(option);
    close();
    renderCatalog();
  };

  btn.addEventListener('click', () => {
    if (list.hidden) open();
    else close();
  });

  list.addEventListener('click', (event) => {
    const option = event.target.closest('.select__option');
    if (option) choose(option);
  });

  /* Клик мимо закрывает список. Проверка через hidden вместо
     класса: после закрытия кнопка получает aria-expanded="false",
     а класс .is-open снимается — а hidden остаётся правдой в
     обоих случаях, и лишнего состояния не появляется */
  document.addEventListener('click', (event) => {
    if (!list.hidden && !root.contains(event.target)) close(false);
  });

  btn.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (list.hidden) open();
    }
  });

  list.addEventListener('keydown', (event) => {
    const items = $$('.select__option', list);
    const at = items.indexOf(document.activeElement);

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        items[(at + 1) % items.length].focus();
        break;
      case 'ArrowUp':
        event.preventDefault();
        items[(at - 1 + items.length) % items.length].focus();
        break;
      case 'Home':
        event.preventDefault();
        items[0].focus();
        break;
      case 'End':
        event.preventDefault();
        items[items.length - 1].focus();
        break;
      case 'Escape':
        // Закрываем и возвращаем фокус на кнопку, откуда пришли
        event.preventDefault();
        close();
        break;
      case 'Tab':
        // Фокус уходит дальше по странице — не мешаем ему,
        // но список закрываем, иначе он останется висеть
        close(false);
        break;
      default:
    }
  });

  // Первая отрисовка: отметка должна совпасть с mode в state,
  // иначе список покажет «выбрано» не то, что реально применено
  mark(chosen());
}

function initGrid() {
  // Один обработчик на всю сетку вместо слушателя на каждой
  // кнопке: карточки перерисовываются, слушатели — тоже
  $('#grid').addEventListener('click', (event) => {
    const add = event.target.closest('[data-add]');
    if (add) {
      addToCart(add.dataset.add);
      return;
    }

    // Рисунок карточки открывает окно товара
    const open = event.target.closest('[data-open]');
    if (open) openProductModal(open.dataset.open);
  });
}

/* Крестик и затемнение в окне товара. Само окно открывается
   из сетки, но закрыть его можно и оттуда же — по Tab до
   затемнения или до крестика, без мыши */
function initProductModal() {
  $('#productModalClose').addEventListener('click', closeModal);
  $('#productModalOverlay').addEventListener('click', closeModal);
}

function initCartPanel() {
  $('#cartBtn').addEventListener('click', openCart);
  $('#cartClose').addEventListener('click', closeCart);
  $('#cartOverlay').addEventListener('click', closeCart);

  $('#cartItems').addEventListener('click', (event) => {
    const remove = event.target.closest('[data-remove]');
    if (remove) removeFromCart(remove.dataset.remove);
  });

  $('#cartClear').addEventListener('click', clearCart);
}

/* Плюс и минус — в трёх местах: в корзине, на карточке товара
   и в окне товара. Один обработчик на весь документ покрывает
   все три сразу: подписаться по одному контейнеру на место
   значило бы через правку каждого забыть один из них.

   Клик ловится один раз и потом всплывает до document — поэтому
   не важно, на каком из трёх мест нажали. */
function initQtyControls() {
  document.addEventListener('click', (event) => {
    const step = event.target.closest('[data-step]');
    if (!step) return;

    const id = step.dataset.id;
    const value = step.dataset.step;
    setQty(id, inCart(id) + Number(value));

    // Список корзины после «+» и «−» перерисовывается целиком:
    // нажатая кнопка уходит вместе со старой разметкой, и фокус
    // слетает на <body>. С клавиатуры до остальных товаров тогда
    // не доехать. Возвращаем фокус на ту же кнопку в новой разметке
    if (document.activeElement === document.body) {
      const again = $$('[data-step][data-id]').find(
        (button) => button.dataset.step === value && button.dataset.id === id,
      );
      if (again && !again.disabled) again.focus();
    }
  });
}

function initModalKeys() {
  document.addEventListener('keydown', (event) => {
    if (!openPanel) return;

    // Escape закрывает окно — стандартное ожидание
    // от любого модального окна, в том числе у скринридера
    if (event.key === 'Escape') {
      event.preventDefault();
      closeModal();
      return;
    }

    keepFocusInside(event);
  });
}

/* Панель фильтров: складывается и прячется при прокрутке.

   Два поведения на один слушатель:
     — is-compact — панель ужимается, когда прилипла к шапке;
     — is-hidden — уезжает вверх, когда человек листает каталог вниз.

   Прячется только панель. Шапка с кнопкой корзины остаётся на
   месте: корзина нужна всегда, а эти 72px дешевле, чем 146px
   фильтров. Возвращается панель при любом движении вверх —
   отдельную кнопку учить не надо, жест считывается сам.

   Все чтения — в начале обработчика, все записи — в конце.
   Обратный порядок заставил бы браузер считать раскладку дважды
   за кадр: сначала изменили класс, потом измерили высоту. */
const HIDE_RUN = 60; // сколько набрать вниз, прежде чем прятать
const JUMP = 400;    // разница, за которой считаем прыжок, а не листание

function initToolbarShrink() {
  const toolbar = $('.toolbar');
  if (!toolbar) return;

  // На узком экране фильтры находятся в обычном потоке страницы.
  // Не прячем их при прокрутке: на телефоне это мешает менять фильтры.
  const mobileViewport = window.matchMedia('(max-width: 760px)');

  // Точка, после которой панель «прилипла» к шапке: пока её верх
  // ещё виден, сжимать рано. Читаем один раз при запуске
  const foldAt = toolbar.offsetTop - 12;

  let lastY = window.scrollY;
  let downRun = 0;
  let compact = false;
  let hidden = false;

  const update = () => {
    if (mobileViewport.matches) {
      lastY = window.scrollY;
      downRun = 0;
      compact = false;
      hidden = false;
      toolbar.classList.remove('is-compact', 'is-hidden');
      return;
    }

    // --- чтения ---
    const y = Math.max(0, window.scrollY);
    // Высота документа меняется, когда фильтры перерисовали
    // каталог, поэтому берём её здесь, а не кешируем навсегда
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const delta = y - lastY;

    // --- решения ---
    let nextHidden = hidden;

    if (y <= foldAt || y >= max - 2) {
      // Наверху прятать нечего, а внизу панель нужна: человек
      // дочитал список, и прятать её именно там нельзя
      downRun = 0;
      nextHidden = false;
    } else if (Math.abs(delta) > JUMP) {
      // Прыжок: переход по ссылке, PageDown, восстановление
      // позиции браузером. Это не листание: засчитывать его
      // нельзя, иначе после прыжка к каталогу фильтры
      // исчезли бы ровно там, где их и искали
      downRun = 0;
      nextHidden = false;
    } else if (delta > 0) {
      downRun += delta;
      // Порог накопленного пути, а не «сколько-то пикселей за
      // кадр»: микропрокрутка от трекпада не должна дёргать
      // панель, а вот настоящее листание вниз — прятать
      if (downRun > HIDE_RUN) nextHidden = true;
    } else if (delta < 0) {
      // Вверх показываем сразу и без порога: человек потянул
      // панель обратно, значит она ему понадобилась
      downRun = 0;
      nextHidden = false;
    }

    // --- записи ---
    lastY = y;
    compact = y > foldAt;
    hidden = nextHidden;
    toolbar.classList.toggle('is-compact', compact);
    toolbar.classList.toggle('is-hidden', hidden);
  };

  // passive: true — обработчик не вызывает preventDefault, и
  // браузеру не нужно его ждать. Без этой опции прокрутка ждёт
  // каждого обработчика, и страница подтормаживает — ровно тот
  // эффект, которого мы шли чинить
  window.addEventListener('scroll', update, { passive: true });
  // Сбрасываем состояние панели и при повороте телефона,
  // и при изменении ширины окна браузера.
  if (typeof mobileViewport.addEventListener === 'function') {
    mobileViewport.addEventListener('change', update);
  } else {
    mobileViewport.addListener(update);
  }
  update();
}

function initFooter() {
  $('#year').textContent = String(new Date().getFullYear());
}

const MODULES = [
  initCategories,
  initSearch,
  initSort,
  initGrid,
  initQtyControls,
  initCartPanel,
  initProductModal,
  initModalKeys,
  initToolbarShrink,
  initFooter,
];

MODULES.forEach((init) => {
  try {
    init();
  } catch (error) {
    console.error('Модуль не запустился:', error);
  }
});


/* =============================================================
   11. ПЕРВЫЙ РЕНДЕР
   Сначала подпись про JavaScript убираем — она нужна только
   пока скрипт не выполнился. Потом рисуем всё, что зависит
   от состояния.
   ============================================================= */
document.documentElement.classList.remove('no-js');

// Забираем корзину из хранилища до первой отрисовки —
// иначе панель мелькнёт пустой и тут же поправится
state.cart = loadCart();

buildCategories();
// Подсветка выбранной категории — сразу после сборки кнопок.
// Без этого вызова состояние «Все» отмечалось только после
// первого клика: функция вызывалась из обработчика, а на
// старте про неё никто не вспоминал
syncCategoryChips();
renderCatalog();
renderCart();
