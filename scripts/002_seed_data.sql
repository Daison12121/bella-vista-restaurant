-- Добавляем тестовые категории
INSERT INTO categories (name, description, color_gradient, image_url, sort_order) VALUES
('Закуски', 'Изысканные закуски для идеального начала вашего гастрономического путешествия', 'from-amber-400 to-orange-500', '/placeholder.svg?height=400&width=600&text=Закуски', 1),
('Основные блюда', 'Авторские блюда от нашего шеф-повара, приготовленные по традиционным итальянским рецептам', 'from-red-400 to-pink-500', '/placeholder.svg?height=400&width=600&text=Основные%20блюда', 2),
('Десерты', 'Сладкие шедевры нашего кондитера для идеального завершения трапезы', 'from-purple-400 to-indigo-500', '/placeholder.svg?height=400&width=600&text=Десерты', 3),
('Напитки', 'Отборные вина, авторские коктейли и освежающие напитки', 'from-emerald-400 to-teal-500', '/placeholder.svg?height=400&width=600&text=Напитки', 4);

-- Добавляем тестовые ингредиенты
INSERT INTO ingredients (name, is_allergen) VALUES
('Томаты', false),
('Моцарелла', true),
('Базилик', false),
('Оливковое масло', false),
('Пармезан', true),
('Прошутто', false),
('Руккола', false),
('Бальзамический уксус', false),
('Чеснок', false),
('Лук', false),
('Грибы', false),
('Сливки', true),
('Яйца', true),
('Мука', true),
('Орехи', true);

-- Добавляем тестовые блюда
INSERT INTO dishes (category_id, name, description, price, image_url, cook_time, is_popular, is_vegetarian, is_spicy, is_chef_special) VALUES
(1, 'Брускетта с томатами', 'Хрустящий тосканский хлеб с сочными томатами сан-марцано, свежим базиликом и моцареллой ди буффало', 450, '/placeholder.svg?height=400&width=600&text=Брускетта', '5 мин', true, true, false, false),
(1, 'Антипасто делла каса', 'Авторское ассорти итальянских мясных деликатесов, выдержанных сыров и маринованных овощей', 890, '/placeholder.svg?height=400&width=600&text=Антипасто', '10 мин', false, false, false, true),
(1, 'Капрезе премиум', 'Моцарелла ди буффало DOP, томаты черри, свежий базилик, трюфельное масло extra virgin', 650, '/placeholder.svg?height=400&width=600&text=Капрезе', '3 мин', true, true, false, false),

(2, 'Паста Карбонара', 'Классическая римская паста с гуанчиале, яйцом, пекорино романо и свежемолотым черным перцем', 780, '/placeholder.svg?height=400&width=600&text=Карбонара', '12 мин', true, false, false, false),
(2, 'Ризотто с трюфелями', 'Кремовое ризотто арборио с лесными грибами, черным трюфелем и выдержанным пармезаном', 920, '/placeholder.svg?height=400&width=600&text=Ризотто', '18 мин', false, true, false, true),
(2, 'Оссо Буко по-милански', 'Тушеная телячья голень в белом вине с овощами, подается с шафрановой полентой', 1450, '/placeholder.svg?height=400&width=600&text=Оссо%20Буко', '25 мин', true, false, false, true),

(3, 'Тирамису классический', 'Традиционный итальянский десерт с маскарпоне, кофе и какао', 380, '/placeholder.svg?height=400&width=600&text=Тирамису', '5 мин', true, true, false, false),
(3, 'Панна котта с ягодами', 'Нежный десерт из сливок с сезонными ягодами и ягодным соусом', 320, '/placeholder.svg?height=400&width=600&text=Панна%20котта', '3 мин', false, true, false, false),

(4, 'Эспрессо', 'Классический итальянский эспрессо из зерен арабики', 120, '/placeholder.svg?height=400&width=600&text=Эспрессо', '2 мин', true, true, false, false),
(4, 'Кьянти Классико', 'Красное вино из региона Тоскана, урожай 2020 года', 450, '/placeholder.svg?height=400&width=600&text=Кьянти', '1 мин', false, true, false, false);

-- Связываем блюда с ингредиентами
INSERT INTO dish_ingredients (dish_id, ingredient_id) VALUES
-- Брускетта
(1, 1), (1, 2), (1, 3), (1, 4),
-- Антипасто  
(2, 5), (2, 6), (2, 7), (2, 8),
-- Капрезе
(3, 1), (3, 2), (3, 3), (3, 4),
-- Карбонара
(4, 5), (4, 12), (4, 13),
-- Ризотто
(5, 11), (5, 5), (5, 12),
-- Оссо Буко
(6, 9), (6, 10), (6, 12);
