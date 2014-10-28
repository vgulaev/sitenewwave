#!/web/trimetru/python/bin/python2.6
#-*- coding:utf8 -*-

import MySQLdb
from secrets import *


class Item:
    def __init__(self, item_array):
        self.item_name = item_array[0].replace("'", "", 1).strip()
        self.item_hash = item_array[1].strip()
        self.item_char = item_array[2].strip()
        self.item_char_hash = item_array[3].strip()
        self.item_group = item_array[4].strip()
        self.item_parent = item_array[5].strip()
        self.item_diameter = item_array[6].strip().replace(",",".")
        self.item_thickness = item_array[7].strip().replace(",",".")
        self.item_min_length = item_array[8].strip().replace(",",".")
        self.item_max_length = item_array[9].strip().replace(",",".")
        self.item_char_weight = item_array[10].strip().replace(",",".")
        self.item_char_kf = item_array[11].strip().replace(",",".")
        self.item_unit = item_array[12].strip()
        self.item_price = item_array[13].replace("\xc2\xa0", "").replace(",", ".").strip()
        self.item_price_type = item_array[14].replace(",",".").strip()
        self.item_height = item_array[15].replace("';", "").strip()
        self.optional_length = False

        if self.item_min_length is not "" or self.item_max_length is not "":
            self.optional_length = True

    def insert_group(self):

        check_existance = """
            SELECT `id` FROM `site_group`
            WHERE `name`='{0}'
        """.format(self.item_group)
        self.cursor.execute(check_existance)

        if self.optional_length:
            char_price = 0
        else:
            char_price = 1

        r = self.cursor.fetchall()

        if r.__len__() > 0:
            return r[0][0]
        else:
            print(u"Inserting {0}".format(self.item_group.decode("utf-8")))
            insert_text = """
                INSERT INTO `trimetru_catalog`.`site_group` (`id`, `name`, `char_price`)
                VALUES ('{0}', '{1}', {2})
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
            print(u"Inserting {0}".format(self.item_parent.decode("utf-8")))
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
            print(u"Inserting {0}".format(self.item_price_type.decode("utf-8")))
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
            print(u"Inserting {0}".format(self.item_name.decode("utf-8")))
            insert_text = """
                INSERT INTO `trimetru_catalog`.`item`
                (`name`, `hash`, `thickness`, `diameter`, `height`, `ed_izm`,
                    `is_optional_length`, `min_length`, `max_length`,
                    `site_group_ref`, `item_parent_ref`)
                VALUES ('{0}', '{1}', '{2}', '{3}', '{4}', '{5}', {6}, '{7}',
                    '{8}', '{9}', {10})
            """.format(
                self.item_name, self.item_hash, self.item_thickness,
                self.item_diameter, self.item_height, self.item_unit, self.optional_length,
                self.item_min_length, self.item_max_length, self.group_id,
                self.parent_id
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
            print(u"Inserting {0}".format(self.item_char.decode("utf-8")))
            insert_text = """
                INSERT INTO `trimetru_catalog`.`char` (`id`, `name`, `hash`,
                    `weight`, `kf`, `item_ref`)
                VALUES ('{0}', '{1}', '{2}', '{3}', '{4}', '{5}')
            """.format(
                "", self.item_char, self.item_char_hash,
                self.item_char_weight, self.item_char_kf, self.item_id
            )

            self.cursor.execute(insert_text)
            r = self.cursor.fetchall()
            conn.commit()

            return self.cursor.lastrowid

    def insert_price(self):
        if self.char_price:
            check_existance = """
                SELECT `price` FROM `item_price`
                WHERE `item_ref`='{0}' AND `price_type_ref`='{1}' AND `is_char`=1
            """.format(self.char_id, self.price_type_id)
            self.cursor.execute(check_existance)

            r = self.cursor.fetchall()

            if r.__len__() > 0:
                for row in r:
                    if row[0] == self.item_price:
                        return False

            print(u"Inserting {0}".format(self.item_price.decode("utf-8")))
            insert_text = """
                INSERT INTO `trimetru_catalog`.`item_price` (`item_ref`,
                `price_type_ref`, `price`, `is_char`)
                VALUES ('{0}', '{1}', '{2}', {3})
            """.format(
                self.char_id, self.price_type_id,
                self.item_price, self.char_price
            )

        else:
            check_existance = """
                SELECT `price` FROM `item_price`
                WHERE `item_ref`='{0}' AND `price_type_ref`='{1}' AND `is_char`=0
            """.format(self.item_id, self.price_type_id)
            self.cursor.execute(check_existance)

            r = self.cursor.fetchall()

            if r.__len__() > 0:
                for row in r:
                    if row[0] == self.item_price:
                        return False

            print(u"Inserting {0}".format(self.item_price.decode("utf-8")))
            insert_text = """
                INSERT INTO `trimetru_catalog`.`item_price` (`item_ref`,
                `price_type_ref`, `price`, `is_char`)
                VALUES ('{0}', '{1}', '{2}', {3})
            """.format(
                self.item_id, self.price_type_id,
                self.item_price, self.char_price
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

        self.cursor = conn.cursor()
        self.cursor.execute('SET NAMES utf8;')
        self.cursor.connection.autocommit(True)
        self.insert_price()
        self.cursor.close()

conn = MySQLdb.connect(host=databases["catalog"]["host"],
                       user=databases["catalog"]["user"],
                       passwd=databases["catalog"]["passwd"],
                       db=databases["catalog"]["db"])


conn.set_character_set('utf8')


with open("../../import/price.csv") as price_csv:
    for line in price_csv:
        item_array = line.split("','")

        item = Item(item_array)

        item.fill_the_database()


    conn.close()

price_csv.close()

print("hallo!")
