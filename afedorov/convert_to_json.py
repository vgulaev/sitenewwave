#-*- coding:utf-8 -*-

text = """Лист
url: /catalog/list/
title: Листовая сталь, купить, цена
description: Предлагаем купить стальные листы в Тюмени по низким ценам
text: размеченные текст (Ещё не написаны)

лист оцинкованный
url: /catalog/otsinkovannyy-list/
title: Лист оцинкованный Тюмень, купить, цена
description: Предлагаем купить оцинкованный лист в Тюмени по низким ценам
text: размеченные текст (Ещё не написаны)

лист рифленый
url: /catalog/riflenyy-list/
title: Лист рифленый Тюмень, купить, цена
description: Предлагаем купить рифленый лист в Тюмени по низким ценам
text: размеченные текст (Ещё не написаны)

Просечно-вытяжной лист
url: /catalog/prosechno-vytyazhnoy-list/
title: Просечно-вытяжной лист
description: Предлагаем купить просечно-вытяжные листы в Тюмени по низким ценам
text: размеченные текст (Ещё не написаны)

Балка
url: /catalog/balka/
title: Балка двутавровая
description: Предлагаем купить двутавровые балки в Тюмени по низким ценам
text: размеченные текст (Ещё не написаны)

Труба
url: /catalog/truba/
title: Труба Тюмень
description: Предлагаем купить трубы в Тюмени по низким ценам
text: размеченные текст (Ещё не написаны)

Бесшовные трубы
url: /catalog/besshovnye-truby/
title: Бесшовные трубы
description: Предлагаем купить бесшовные трубы в Тюмени по низким ценам
text: размеченные текст (Ещё не написаны)

Квадрат
url: /catalog/kvadrat/
title: Квадрат металлический, металлопрокат
description: Предлагаем купить металлические квадраты в Тюмени по низким ценам
text: размеченные текст (Ещё не написаны)

Угол
url: /catalog/ugolok/
title: Уголок металлический
description: Предлагаем купить металлические уголки в Тюмени по низким ценам
text: размеченные текст (Ещё не написаны)

Круг
url: /catalog/krug/
title: Круг стальной
description: Предлагаем купить стальные круги в Тюмени по низким ценам
text: размеченные текст (Ещё не написаны)

трубы бу
url: /catalog/trubi-bu/
title: Трубы б/у
description: Предлагаем купить трубы б/у в Тюмени по низким ценам
text: размеченные текст (Ещё не написаны)

профильные трубы
url: /catalog/profilnye-truby/
title: Профильные трубы
description: Предлагаем купить профильные трубы в Тюмени по низким ценам
text: размеченные текст (Ещё не написаны)

оцинкованные трубы
url: /catalog/otsinkovannye-truby/
title: Оцинкованные трубы
description: Предлагаем купить Оцинкованные трубы в Тюмени по низким ценам
text: размеченные текст (Ещё не написаны)

сетка кладочная
url: /catalog/setka-kladochnaya/
title: Cетка кладочная Тюмень
description: Предлагаем купить кладочные сетки в Тюмени по выгодным ценам
text: размеченные текст (Ещё не написаны)

Сетка рабица
url: /catalog/setka-rabitsa/
title: Cетка рабица Тюмень
description: Предлагаем купить сетку рабица в Тюмени по выгодным ценам
text: размеченные текст (Ещё не написаны)

балка двутавровая
url: /catalog/balka-dvutavrovaya/
title: Балка двутавровая
description: Предлагаем купить двутавровые балки в Тюмени по выгодным ценам
text: размеченные текст (Ещё не написаны)
"""

text_array = text.split("\n\n")

for tag_text in text_array:
    # print tag_text
    tag_array = tag_text.split("\n")
    print """ 
        \""""+tag_array[0]+"""\" : {
            "url" : \""""+tag_array[1].split(": ")[1]+"""\",
            "title" : \""""+tag_array[2].split(": ")[1]+"""\",
            "description" : \""""+tag_array[3].split(": ")[1]+"""\",
            "text" : \""""+tag_array[4].split(": ")[1]+"""\"
        },
        
    """

