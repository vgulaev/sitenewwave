#!/web/trimetru/python/bin/python2.6
# -*- coding: utf-8 -*-

### What are those values
# 1. path to group image
# 2. show height in params
# 3. show thickness in params
# 4. show width|diameter in params
# 5. height name
# 6. thickness name
# 7. width name
# 8. additional info flag:
#   l - overall length
#   w - overall width
#   s - overall square
###

groups_params = {
    "Арматура": [
        "/1cengine/site/images/eye_pic/armatura.png",
        0,
        0,
        1,
        "Высота",
        "Толщина",
        "Диаметр",
        "l"
    ],
    "Балка": [
        "/1cengine/site/images/eye_pic/balka_dvutavrovaya.png",
        1,
        1,
        1,
        "Высота",
        "Толщина",
        "Ширина",
        "l"
    ],
    "Водосточная система": [
        "/1cengine/site/images/eye_pic/default.png",
        0,
        0,
        0,
        "Высота",
        "Толщина",
        "Ширина",
        "s"
    ],
    "Квадрат": [
        "/1cengine/site/images/eye_pic/kvadratu.png",
        1,
        1,
        1,
        "Высота",
        "Толщина",
        "Ширина",
        "l"
    ],
    "Комплектующие для кровли и фасада": [
        "/1cengine/site/images/eye_pic/default.png",
        0,
        0,
        0,
        "Высота",
        "Толщина",
        "Диаметр",
        "s"
    ],
    "Круг": [
        "/1cengine/site/images/eye_pic/krugi.png",
        1,
        1,
        1,
        "Высота",
        "Толщина",
        "Диаметр",
        "l"
    ],
    "Лист горячекатаный": [
        "/1cengine/site/images/eye_pic/list_stalnoy.png",
        1,
        1,
        1,
        "Высота",
        "Толщина",
        "Ширина",
        "s"
    ],
    "Лист неответственного назначения": [
        "/1cengine/site/images/eye_pic/list_stalnoy.png",
        1,
        1,
        1,
        "Высота",
        "Толщина",
        "Ширина",
        "s"
    ],
    "Лист оцинкованный": [
        "/1cengine/site/images/eye_pic/list_stalnoy.png",
        1,
        1,
        1,
        "Высота",
        "Толщина",
        "Ширина",
        "s"
    ],
    "Лист плоский с полимерным покрытием": [
        "/1cengine/site/images/eye_pic/list_stalnoy.png",
        0,
        1,
        0,
        "Высота",
        "Толщина",
        "Ширина",
        "s"
    ],
    "Лист рифлёный": [
        "/1cengine/site/images/eye_pic/list_stalnoy.png",
        1,
        1,
        1,
        "Высота",
        "Толщина",
        "Ширина",
        "s"
    ],
    "Лист холоднокатаный": [
        "/1cengine/site/images/eye_pic/list_stalnoy.png",
        1,
        1,
        1,
        "Высота",
        "Толщина",
        "Ширина",
        "s"
    ],
    "Металлосайдинг": [
        "/1cengine/site/images/eye_pic/metallosajding.png",
        0,
        0,
        0,
        "Высота",
        "Толщина",
        "Ширина",
        "s"
    ],
    "Металлочерепица": [
        "/1cengine/site/images/eye_pic/cherepica.png",
        1,
        1,
        1,
        "Высота",
        "Толщина",
        "Ширина",
        "s"
    ],
    "Металлоштакетник": [
        "/1cengine/site/images/eye_pic/default.png",
        0,
        0,
        0,
        "Высота",
        "Толщина",
        "Ширина",
        "s"
    ],
    "Полоса": [
        "/1cengine/site/images/eye_pic/polosovoy_prokat.png",
        1,
        1,
        1,
        "Высота",
        "Толщина",
        "Ширина",
        "l"
    ],
    "Проволока": [
        "/1cengine/site/images/eye_pic/provoloka.png",
        1,
        1,
        1,
        "Высота",
        "Толщина",
        "Диаметр",
        "l"
    ],
    "Профнастил": [
        "/1cengine/site/images/eye_pic/profnastil.png",
        1,
        1,
        1,
        "Высота гофры",
        "Толщина",
        "Ширина",
        "s"
    ],
    "Саморез": [
        "/1cengine/site/images/eye_pic/profnastil.png",
        0,
        0,
        0,
        "Высота гофры",
        "Толщина",
        "Ширина",
        "s"
    ],
    "Сетка кладочная": [
        "/1cengine/site/images/eye_pic/default.png",
        1,
        1,
        1,
        "Высота",
        "Толщина",
        "Ширина",
        "l"
    ],
    "Сетка рабица": [
        "/1cengine/site/images/eye_pic/default.png",
        1,
        1,
        1,
        "Высота",
        "Толщина",
        "Ширина",
        "l"
    ],
    "Трубы": [
        "/1cengine/site/images/eye_pic/truba.png",
        1,
        1,
        1,
        "Высота",
        "Толщина",
        "Диаметр",
        "l"
    ],
    "Трубы б/у": [
        "/1cengine/site/images/eye_pic/truba.png",
        1,
        1,
        1,
        "Высота",
        "Толщина",
        "Диаметр",
        "l"
    ],
    "Трубы оцинкованные": [
        "/1cengine/site/images/eye_pic/truba.png",
        1,
        1,
        1,
        "Высота",
        "Толщина",
        "Диаметр",
        "l"
    ],
    "Трубы профильные": [
        "/1cengine/site/images/eye_pic/profilnaya_truba.png",
        1,
        1,
        1,
        "Высота",
        "Толщина",
        "Диаметр",
        "l"
    ],
    "Угол гнутый": [
        "/1cengine/site/images/eye_pic/ugolok_stalnoy.png",
        1,
        1,
        1,
        "Высота",
        "Толщина",
        "Ширина",
        "l"
    ],
    "Угол неравнополочный": [
        "/1cengine/site/images/eye_pic/ugolok_stalnoy.png",
        1,
        1,
        1,
        "Высота",
        "Толщина",
        "Ширина",
        "l"
    ],
    "Угол равнополочный": [
        "/1cengine/site/images/eye_pic/ugolok_stalnoy.png",
        0,
        1,
        1,
        "Высота",
        "Толщина",
        "Ширина",
        "l"
    ],
    "Швеллер": [
        "/1cengine/site/images/eye_pic/shveller.png",
        0,
        1,
        0,
        "Высота",
        "Размер",
        "Ширина",
        "l"
    ],
    "Швеллер гнутый": [
        "/1cengine/site/images/eye_pic/shveller.png",
        0,
        1,
        0,
        "Высота",
        "Размер",
        "Ширина",
        "l"
    ],
    "Шестигранник": [
        "/1cengine/site/images/eye_pic/shestigrannik.png",
        1,
        1,
        1,
        "Высота",
        "Толщина",
        "Ширина",
        "l"
    ]
}
