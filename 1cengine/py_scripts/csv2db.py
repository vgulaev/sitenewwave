#-*- coding:utf8 -*-

PREVIOUS_ITEM_HASH = ""
PREVIOUS_CHAR_HASH = ""

class Item:
    def __init__(self, item_array):
        self.item_name = item_array[0].strip()
        self.item_hash = item_array[1].strip()
        self.item_char = item_array[2].strip()
        self.item_char_hash = item_array[3].strip()
        self.item_group = item_array[4].strip()
        self.item_parent = item_array[5].strip()
        self.item_diameter = item_array[6].strip()
        self.item_thickness = item_array[7].strip()
        self.item_min_length = item_array[8].strip()
        self.item_max_length = item_array[9].strip()
        self.item_char_weight = item_array[10].strip()
        self.item_char_kf = item_array[11].strip()
        self.item_unit = item_array[12].strip()
        self.item_price = item_array[13].strip()
        self.item_price_type = item_array[14].strip()
        self.optional_length = False
        self.new_item = True
        self.new_char = True

        if self.min_length is not "" or self.max_length is not "":
            self.optional_length = True

        if self.item_hash == PREVIOUS_ITEM_HASH:
            self.new_item = False

        if self.item_char_hash == PREVIOUS_CHAR_HASH:
            self.new_char = False


with open("../../import/price.csv", "r") as price_csv:
    for line in price_csv:
        item_array = line.split("','")

        item = Item(item_array)


price_csv.close()

print("hallo!")
