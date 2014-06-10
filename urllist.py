#!/web/tdymkru/python/bin/python2.6
# -*- coding: utf-8 -*-
# This Python file uses the following encoding: utf-8


class urltype:
    urlname = ""
    path = ""

    def __init__(self, urlname, strfolder):
        self.urlname = urlname
        self.path = strfolder

url_dictionary = {
    "mainpage": "htmlstaticcontent/0001mainpage/",
    # блок меню "О компании"
    "about": "htmlstaticcontent/002_about_/",
    "about/awards": "htmlstaticcontent/011_about_awards_/",
    "about/history": "htmlstaticcontent/010_about_history_/",
    "about/strong": "htmlstaticcontent/014_about_strong_/",
    "about/history/photo": "htmlstaticcontent/012_about_history_photo_/",
    "about/vacancies": "htmlstaticcontent/017_about_vacancies_/",
    "about/partners": "htmlstaticcontent/015_about_partners_/",
    "about/news": "htmlstaticcontent/016_about_news_/",
    "about/leaderships": "htmlstaticcontent/013_about_leaderships_/",
    # блок меню "Продукция"
    "products/faq/924": "htmlstaticcontent/039_products_faq_924_/",
    "products": "htmlstaticcontent/004_products_/",
    "products/faq/902": "htmlstaticcontent/035_products_faq_902_/",
    "products/krovl/profnastil":
                "htmlstaticcontent/026_products_krovl_profnastil_/",
    "products/krovl/vodostochnye_sistemy":
                "htmlstaticcontent/028_products_krovl_vodostochnye_sistemy_/",
    "products/krovl/metallosajding":
                "htmlstaticcontent/027_products_krovl_metallosajding_/",
    "products/faq/937": "htmlstaticcontent/045_products_faq_937_/",
    "products/krovl/metallocherepica":
                "htmlstaticcontent/029_products_krovl_metallocherepica_/",
    "products/faq": "htmlstaticcontent/034_products_faq_/",
    "products/faq/933": "htmlstaticcontent/043_products_faq_933_/",
    "products/gost": "htmlstaticcontent/033_products_gost_/",
    "products/faq/929": "htmlstaticcontent/041_products_faq_929_/",
    "products/krovl/soputstvujuwie_tovary":
                "htmlstaticcontent/030_products_krovl_soputstvujuwie_tovary_/",
    "products/dealers": "htmlstaticcontent/031_products_dealers_/",
    "products/special": "htmlstaticcontent/036_products_special_/",
    "products/faq/915": "htmlstaticcontent/038_products_faq_915_/",
    "products/krovl": "htmlstaticcontent/025_products_krovl_/",
    "products/faq/935": "htmlstaticcontent/044_products_faq_935_/",
    "products/metalloprokat":
                "htmlstaticcontent/024_products_metalloprokat_/",
    "products/faq/931": "htmlstaticcontent/042_products_faq_931_/",
    "products/faq/926": "htmlstaticcontent/040_products_faq_926_/",
    "products/request": "htmlstaticcontent/037_products_request_/",
    "products/krovl/dobornye-jelementy":
                "htmlstaticcontent/046_products_krovl_dobornye-jelementy_/",
    "products/shtrips":
                "htmlstaticcontent/055_products_shtrips/",
    # блок меню "Услуги"
    "services": "htmlstaticcontent/020_services_metalwork_/",
    "services/metalwork": "htmlstaticcontent/020_services_metalwork_/",
    "services/storage": "htmlstaticcontent/023_services_storage_/",
    "services/delivery": "htmlstaticcontent/021_services_delivery_/",
    "services/weighing": "htmlstaticcontent/022_services_weighing_/",
    "services/metalwork/gaz_rezka":
                "htmlstaticcontent/048_services_metalwork_gaz_rezka_/",
    "services/metalwork/pravka_buht":
                "htmlstaticcontent/049_services_metalwork_pravka_buht_/",
    "services/metalwork/rubka_listov":
                "htmlstaticcontent/050_services_metalwork_rubka_listov_/",
    "services/metalwork/mech_rezka":
                "htmlstaticcontent/051_services_metalwork_mech_rezka_/",
    "services/metalwork/lentopil_rezka":
                "htmlstaticcontent/052_services_metalwork_lentopil_rezka_/",
    "services/metalwork/plazma_rezka":
                "htmlstaticcontent/053_services_metalwork_plazma_rezka_/",
    "services/metalwork/pp_rezka":
                "htmlstaticcontent/054_services_metalwork_pp_rezka/",

    # блок меню "Поставщикам"
    "suppliers": "htmlstaticcontent/005_suppliers_/",
    # блок меню "Контакты"
    "contacts": "htmlstaticcontent/006_contacts_/",
    "contacts/urinfo": "htmlstaticcontent/019_contacts_urinfo_/",
    "contacts/feedback": "htmlstaticcontent/008_contacts_feedback_/",
    "contacts/maps": "htmlstaticcontent/018_contacts_maps_/",
    # описание банкинга
    "banking": "htmlstaticcontent/047_banking_/",
    # блок меню "Войти"
    "kabinet": "1cengine/kabinet/",
    "kabinet/orders": "1cengine/kabinet_orders/",
    "kabinet/authorization": "1cengine/kabinet_authorization/",
    "kabinet/personal": "1cengine/kabinet_personal/",
    "kabinet/payment": "1cengine/kabinet_payment/",
    "kabinet/shipping": "1cengine/kabinet_shipping/",
    "kabinet/settlement": "1cengine/kabinet_settlement/",
    # онлайн платежи
    "payment": "1cengine/payment/",
    "payment/*": "1cengine/payment/",
    "payment/success": "1cengine/payment_success/",
    "payment/fail": "1cengine/payment_fail/",
}

trimeturls = list()

for url in url_dictionary:
    trimeturls.append(urltype(url, url_dictionary[url]))

# trimeturls.append(urltype("mainpage", "htmlstaticcontent/0001mainpage/"))

# trimeturls.append(urltype("about", "htmlstaticcontent/002_about_/"))
# trimeturls.append(
#     urltype("about/awards", "htmlstaticcontent/011_about_awards_/"))
# trimeturls.append(
#     urltype("about/history", "htmlstaticcontent/010_about_history_/"))
# trimeturls.append(
#     urltype("about/strong", "htmlstaticcontent/014_about_strong_/"))

# trimeturls.append(
#     urltype("about/history/photo",
#             "htmlstaticcontent/012_about_history_photo_/"))
# trimeturls.append(
#     urltype("about/vacancies", "htmlstaticcontent/017_about_vacancies_/"))
# trimeturls.append(
#     urltype("about/partners", "htmlstaticcontent/015_about_partners_/"))
# trimeturls.append(urltype("about/news", "htmlstaticcontent/016_about_news_/"))
# trimeturls.append(
# urltype("about/leaderships",
# "htmlstaticcontent/013_about_leaderships_/"))


# trimeturls.append(
#     urltype("products/faq/924", "htmlstaticcontent/039_products_faq_924_/"))
# trimeturls.append(urltype("products", "htmlstaticcontent/004_products_/"))
# trimeturls.append(
#     urltype("products/faq/902", "htmlstaticcontent/035_products_faq_902_/"))
# trimeturls.append(
#     urltype("products/krovl/profnastil",
#             "htmlstaticcontent/026_products_krovl_profnastil_/"))
# trimeturls.append(
#     urltype("products/krovl/vodostochnye_sistemy",
#             "htmlstaticcontent/028_products_krovl_vodostochnye_sistemy_/"))
# trimeturls.append(urltype("products/krovl/metallosajding",
#                   "htmlstaticcontent/027_products_krovl_metallosajding_/"))
# trimeturls.append(
#     urltype("products/faq/937", "htmlstaticcontent/045_products_faq_937_/"))
# trimeturls.append(urltype("products/krovl/metallocherepica",
#                   "htmlstaticcontent/029_products_krovl_metallocherepica_/"))
# trimeturls.append(
#     urltype("products/faq", "htmlstaticcontent/034_products_faq_/"))
# trimeturls.append(
#     urltype("products/faq/933", "htmlstaticcontent/043_products_faq_933_/"))
# trimeturls.append(
#     urltype("products/gost", "htmlstaticcontent/033_products_gost_/"))
# trimeturls.append(
#     urltype("products/faq/929", "htmlstaticcontent/041_products_faq_929_/"))
# trimeturls.append(
#     urltype("products/krovl/soputstvujuwie_tovary",
#             "htmlstaticcontent/030_products_krovl_soputstvujuwie_tovary_/"))
# trimeturls.append(
#     urltype("products/dealers", "htmlstaticcontent/031_products_dealers_/"))
# trimeturls.append(
#     urltype("products/special", "htmlstaticcontent/036_products_special_/"))
# trimeturls.append(
#     urltype("products/faq/915", "htmlstaticcontent/038_products_faq_915_/"))
# trimeturls.append(
#     urltype("products/krovl", "htmlstaticcontent/025_products_krovl_/"))
# trimeturls.append(
#     urltype("products/faq/935", "htmlstaticcontent/044_products_faq_935_/"))
# trimeturls.append(
#     urltype("products/metalloprokat",
#             "htmlstaticcontent/024_products_metalloprokat_/"))
# trimeturls.append(
#     urltype("products/faq/931", "htmlstaticcontent/042_products_faq_931_/"))
# trimeturls.append(
#     urltype("products/faq/926", "htmlstaticcontent/040_products_faq_926_/"))
# trimeturls.append(
#     urltype("products/request", "htmlstaticcontent/037_products_request_/"))
# trimeturls.append(urltype("products/krovl/dobornye-jelementy",
#                   "htmlstaticcontent/046_products_krovl_dobornye-jelementy_/"))


# trimeturls.append(
#     urltype("services", "htmlstaticcontent/020_services_metalwork_/"))
# trimeturls.append(
#     urltype("services/metalwork", "htmlstaticcontent/020_services_metalwork_/"))
# trimeturls.append(
#     urltype("services/storage", "htmlstaticcontent/023_services_storage_/"))
# trimeturls.append(
#     urltype("services/delivery", "htmlstaticcontent/021_services_delivery_/"))
# trimeturls.append(
#     urltype("services/weighing", "htmlstaticcontent/022_services_weighing_/"))
# trimeturls.append(urltype("services/metalwork/gaz_rezka",
#                   "htmlstaticcontent/048_services_metalwork_gaz_rezka_/"))
# trimeturls.append(urltype("services/metalwork/pravka_buht",
#                   "htmlstaticcontent/049_services_metalwork_pravka_buht_/"))
# trimeturls.append(urltype("services/metalwork/rubka_listov",
#                   "htmlstaticcontent/050_services_metalwork_rubka_listov_/"))
# trimeturls.append(urltype("services/metalwork/mech_rezka",
#                   "htmlstaticcontent/051_services_metalwork_mech_rezka_/"))
# trimeturls.append(urltype("services/metalwork/lentopil_rezka",
#                   "htmlstaticcontent/052_services_metalwork_lentopil_rezka_/"))
# trimeturls.append(urltype("services/metalwork/plazma_rezka",
#                   "htmlstaticcontent/053_services_metalwork_plazma_rezka_/"))


# trimeturls.append(urltype("suppliers", "htmlstaticcontent/005_suppliers_/"))

# trimeturls.append(urltype("contacts", "htmlstaticcontent/006_contacts_/"))
# trimeturls.append(
#     urltype("contacts/urinfo", "htmlstaticcontent/019_contacts_urinfo_/"))
# trimeturls.append(
#     urltype("contacts/feedback", "htmlstaticcontent/008_contacts_feedback_/"))
# trimeturls.append(
#     urltype("contacts/maps", "htmlstaticcontent/018_contacts_maps_/"))


# trimeturls.append(urltype("banking", "htmlstaticcontent/047_banking_/"))

# trimeturls.append(urltype("kabinet", "1cengine/kabinet/"))
# trimeturls.append(urltype("kabinet/orders", "1cengine/kabinet_orders/"))
# trimeturls.append(
#     urltype("kabinet/authorization", "1cengine/kabinet_authorization/"))
# trimeturls.append(urltype("kabinet/personal", "1cengine/kabinet_personal/"))
# trimeturls.append(urltype("kabinet/payment", "1cengine/kabinet_payment/"))
# trimeturls.append(urltype("kabinet/shipping", "1cengine/kabinet_shipping/"))
# trimeturls.append(
#     urltype("kabinet/settlement", "1cengine/kabinet_settlement/"))

# trimeturls.append(urltype("payment", "1cengine/payment/"))
# trimeturls.append(urltype("payment/*", "1cengine/payment/"))
# trimeturls.append(urltype("payment/success", "1cengine/payment_success/"))
