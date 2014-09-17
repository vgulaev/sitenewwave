#-*- coding:utf8 -*-


# price_csv = open("../../import/price.csv", "r")

# for line in price_csv.readline():
#     print line

with open("../../import/price.csv", "r") as price_csv:
    for line in price_csv:
        item_array = line.split("','")
        
        print item_array

price_csv.close()

print("hallo!")