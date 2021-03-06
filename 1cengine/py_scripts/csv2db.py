#!/web/trimetru/python/bin/python2.6
#-*- coding:utf8 -*-

import MySQLdb
import imp
import os

# py_scripts_path = os.path.expanduser('~/web/sitenewwave/1cengine/py_scripts/') #development
py_scripts_path = os.path.expanduser('~/site/www/1cengine/py_scripts/') #production

secrets_lib_name = "secrets"
secrets_lib_path = "structures/secrets.py"
secrets = imp.load_source(
    secrets_lib_name,
    py_scripts_path + secrets_lib_path
)

database = secrets.databases["catalog"]

group_config_lib_name = "group_config"
group_config_lib_path = "structures/group_config.py"
group_config = imp.load_source(
    group_config_lib_name,
    py_scripts_path + group_config_lib_path
)

groups_params = group_config.groups_params


class Item:
    def __init__(self, item_array):
        self.item_name = item_array[0].replace("'", "", 1).strip()
        self.item_hash = item_array[1].strip()
        self.item_char = item_array[2].strip()
        self.item_char_hash = item_array[3].strip()
        self.item_group = item_array[4].strip()
        self.item_parent = item_array[5].strip()
        self.item_diameter = item_array[6].strip().replace(",", ".")
        self.item_thickness = item_array[7].strip().replace(",", ".")
        self.item_min_length = item_array[8].strip().replace(",", ".")
        self.item_max_length = item_array[9].strip().replace(",", ".")
        self.item_char_weight = item_array[10].strip().replace(",", ".")
        self.item_char_kf = item_array[11].strip().replace(",", ".")
        self.item_unit = item_array[12].strip()
        self.item_price = item_array[13].replace(
            "\xc2\xa0", "").replace(",", ".").strip()
        self.item_price_type = item_array[14].replace(",", ".").strip()
        self.item_height = item_array[15].replace(",", ".").strip()
        self.in_stock = item_array[16].replace(",", ".").strip()
        self.char_length = item_array[17].replace(",", ".").strip()
        self.item_work_width = item_array[18].replace(",", ".").strip()
        self.item_parent_short = item_array[19].replace(
            "';", "").replace(",", ".").strip()
        if self.item_parent_short != "":
            self.item_parent = self.item_parent_short

        if self.item_unit == "рул":
            self.item_unit = "шт"

        self.optional_length = False
        self.not_char = False

        if self.item_char == "" and self.item_char_hash == "0":
            self.item_char = "—"
            self.item_char_hash = self.item_hash
            # self.not_char = True

        if self.item_min_length is not "" or self.item_max_length is not "":
            self.optional_length = True

    def insert_group(self):

        check_existance = """
            SELECT `id` FROM `site_group`
            WHERE `name`='{0}'
        """.format(self.item_group)
        self.cursor.execute(check_existance)

        if self.optional_length or self.not_char:
            char_price = 0
        else:
            char_price = 1

        r = self.cursor.fetchall()

        if r.__len__() > 0:
            return r[0][0]
        else:
            # print(u"Inserting {0}".format(self.item_group.decode("utf-8")))

            if self.item_group in groups_params:
                img_path = groups_params[self.item_group][0]
                show_height = groups_params[self.item_group][1]
                show_thickness = groups_params[self.item_group][2]
                show_diameter = groups_params[self.item_group][3]
                height_name = groups_params[self.item_group][4]
                thickness_name = groups_params[self.item_group][5]
                diameter_name = groups_params[self.item_group][6]
                ai_flag = groups_params[self.item_group][7]

                insert_text = """
                    INSERT INTO `trimetru_catalog`.`site_group` (
                        `id`, `name`, `char_price`,`img_url`, `show_height`,
                        `show_thickness`, `show_diameter`, `height_name`,
                        `thickness_name`, `diameter_name`, `ai_flag`
                    ) VALUES (
                        '{0}', '{1}', '{2}', '{3}', '{4}',
                        '{5}', '{6}', '{7}', '{8}', '{9}', '{10}'
                    )
                """.format(
                    "", self.item_group, char_price, img_path, show_height,
                    show_thickness, show_diameter, height_name, thickness_name,
                    diameter_name, ai_flag
                )

            else:
                insert_text = """
                    INSERT INTO `trimetru_catalog`.`site_group` (
                        `id`, `name`, `char_price`
                    ) VALUES ('{0}', '{1}', {2})
                """.format("", self.item_group, char_price)

            self.cursor.execute(insert_text)
            r = self.cursor.fetchall()

            conn.commit()

            return self.cursor.lastrowid

    def insert_parent(self):
        check_existance = """
            SELECT `id` FROM `item_parent`
            WHERE `name`='{0}'
        """.format(self.item_parent)
        self.cursor.execute(check_existance)

        r = self.cursor.fetchall()

        if r.__len__() > 0:
            return r[0][0]
        else:
            # print(u"Inserting {0}".format(self.item_parent.decode("utf-8")))
            insert_text = """
                INSERT INTO `trimetru_catalog`.`item_parent` (`id`, `name`)
                VALUES ('{0}', '{1}')
            """.format("", self.item_parent)
            self.cursor.execute(insert_text)
            r = self.cursor.fetchall()

            conn.commit()

            return self.cursor.lastrowid

    def insert_price_type(self):
        check_existance = """
            SELECT `id` FROM `price_type`
            WHERE `name`='{0}'
        """.format(self.item_price_type)
        self.cursor.execute(check_existance)

        r = self.cursor.fetchall()

        if r.__len__() > 0:
            return r[0][0]
        else:
            # print(u"Inserting {0}".format(self.item_price_type.decode("utf-8")))
            insert_text = """
                INSERT INTO `trimetru_catalog`.`price_type` (`id`, `name`)
                VALUES ('{0}', '{1}')
            """.format("", self.item_price_type)

            self.cursor.execute(insert_text)
            r = self.cursor.fetchall()
            conn.commit()

            return self.cursor.lastrowid

    def insert_item(self):
        check_existance = """
            SELECT `id` FROM `item`
            WHERE `name`='{0}' AND `hash`='{1}'
        """.format(self.item_name, self.item_hash)
        self.cursor.execute(check_existance)

        r = self.cursor.fetchall()

        if r.__len__() > 0:
            return r[0][0]
        else:
            # print(u"Inserting {0}".format(self.item_name.decode("utf-8-sig")))
            insert_text = """
                INSERT INTO `trimetru_catalog`.`item`
                (`name`, `hash`, `thickness`, `diameter`, `height`, `ed_izm`,
                    `is_optional_length`, `min_length`, `max_length`,
                    `site_group_ref`, `item_parent_ref`, `work_width`)
                VALUES ('{0}', '{1}', '{2}', '{3}', '{4}', '{5}', {6}, '{7}',
                    '{8}', '{9}', {10}, '{11}')
            """.format(
                self.item_name, self.item_hash, self.item_thickness,
                self.item_diameter, self.item_height, self.item_unit,
                self.optional_length, self.item_min_length,
                self.item_max_length, self.group_id, self.parent_id,
                self.item_work_width
            )

            self.cursor.execute(insert_text)
            r = self.cursor.fetchall()
            conn.commit()

            return self.cursor.lastrowid

    def insert_char(self):
        check_existance = """
            SELECT `id` FROM `char`
            WHERE `name`='{0}' AND `hash`='{1}'
        """.format(self.item_char, self.item_char_hash)
        self.cursor.execute(check_existance)

        r = self.cursor.fetchall()

        if r.__len__() > 0:
            return r[0][0]
        else:
            # print(u"Inserting {0}".format(self.item_char.decode("utf-8")))
            insert_text = """
                INSERT INTO `trimetru_catalog`.`char` (`id`, `name`, `hash`,
                    `weight`, `kf`, `item_ref`, `length`)
                VALUES ('{0}', '{1}', '{2}', '{3}', '{4}', '{5}', {6})
            """.format(
                "", self.item_char, self.item_char_hash,
                self.item_char_weight, self.item_char_kf, self.item_id,
                self.char_length
            )

            try:
                self.cursor.execute(insert_text)
                r = self.cursor.fetchall()
                conn.commit()
                return self.cursor.lastrowid
            except:
                # print(
                #     u"Problems with char: {0}; item_ref: {1}".format(
                #         self.item_char.encode("utf-8").decode("utf-8"),
                #         self.item_name.encode("utf-8").decode("utf-8")
                #     )
                # )
                return None

    def insert_price(self):
        if self.char_price:
            check_existance = """
                SELECT `price` FROM `item_price`
                WHERE `item_ref`='{0}' AND `price_type_ref`='{1}'
                AND `is_char`=1
            """.format(self.char_id, self.price_type_id)
            self.cursor.execute(check_existance)

            r = self.cursor.fetchall()

            if r.__len__() > 0:
                for row in r:
                    if row[0] == self.item_price:
                        return False

            # print(u"Inserting {0}".format(self.item_price.decode("utf-8")))
            insert_text = """
                INSERT INTO `trimetru_catalog`.`item_price` (`item_ref`,
                `price_type_ref`, `price`, `is_char`, `in_stock`)
                VALUES ('{0}', '{1}', '{2}', {3}, '{4}')
            """.format(
                self.char_id, self.price_type_id,
                self.item_price, self.char_price, self.in_stock
            )

        else:
            check_existance = """
                SELECT `price` FROM `item_price`
                WHERE `item_ref`='{0}' AND `price_type_ref`='{1}'
                AND `is_char`=0
            """.format(self.item_id, self.price_type_id)
            self.cursor.execute(check_existance)

            r = self.cursor.fetchall()

            if r.__len__() > 0:
                for row in r:
                    if row[0] == self.item_price:
                        return False

            # print(u"Inserting {0}".format(self.item_price.decode("utf-8")))
            insert_text = """
                INSERT INTO `trimetru_catalog`.`item_price` (`item_ref`,
                `price_type_ref`, `price`, `is_char`, `in_stock`)
                VALUES ('{0}', '{1}', '{2}', {3}, '{4}')
            """.format(
                self.item_id, self.price_type_id,
                self.item_price, self.char_price, self.in_stock
            )

        self.cursor.execute(insert_text)
        r = self.cursor.fetchall()
        conn.commit()

        return True

    def fill_the_database(self):
        self.cursor = conn.cursor()
        self.cursor.execute('SET NAMES utf8;')
        self.cursor.connection.autocommit(True)
        self.group_id = self.insert_group()
        self.cursor.close()

        self.cursor = conn.cursor()
        self.cursor.execute('SET NAMES utf8;')
        self.cursor.connection.autocommit(True)
        self.parent_id = self.insert_parent()
        self.cursor.close()

        self.cursor = conn.cursor()
        self.cursor.execute('SET NAMES utf8;')
        self.cursor.connection.autocommit(True)
        self.price_type_id = self.insert_price_type()
        self.cursor.close()

        self.cursor = conn.cursor()
        self.cursor.execute('SET NAMES utf8;')
        self.cursor.connection.autocommit(True)
        self.item_id = self.insert_item()
        self.cursor.close()

        if self.item_char_hash == "" or self.optional_length:
            self.char_price = False
        else:
            self.cursor = conn.cursor()
            self.cursor.execute('SET NAMES utf8;')
            self.cursor.connection.autocommit(True)
            self.char_id = self.insert_char()
            self.char_price = True
            self.cursor.close()

        if self.char_price:
            if self.char_id != None:
                self.cursor = conn.cursor()
                self.cursor.execute('SET NAMES utf8;')
                self.cursor.connection.autocommit(True)
                self.insert_price()
                self.cursor.close()
        else:
            self.cursor = conn.cursor()
            self.cursor.execute('SET NAMES utf8;')
            self.cursor.connection.autocommit(True)
            self.insert_price()
            self.cursor.close()

conn = MySQLdb.connect(host=database["host"],
                       user=database["user"],
                       passwd=database["passwd"],
                       db=database["db"])


conn.set_character_set('utf8')
cursor = conn.cursor()

cursor.execute(""" TRUNCATE `item_price` """)
cursor.execute(""" TRUNCATE `price_type` """)
cursor.execute(""" TRUNCATE `char` """)
cursor.execute(""" TRUNCATE `item` """)
cursor.execute(""" TRUNCATE `item_parent` """)
cursor.execute(""" TRUNCATE `site_group` """)

csv_file_name = "/web/trimetru/site/www/import/price.csv"
# csv_file_name = "/home/saur/web/sitenewwave/import/price.csv"

with open(csv_file_name) as price_csv:
    for line in price_csv:
        item_array = line.split("','")

        item = Item(item_array)

        item.fill_the_database()

    conn.close()

price_csv.close()

print("hallo!")
