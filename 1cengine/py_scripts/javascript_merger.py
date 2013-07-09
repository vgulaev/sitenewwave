#-*- coding:utf-8 -*-

import sys,os

function_struct = {}

def merge_javascript(path, output, files=None):
    js_files_array = os.listdir(path)

    if files != None:
        for file in js_files_array:
            if not file in files:
                js_files_array.remove(file)

    output_file = open(output, "w+")
    output_file.write("$(document).ready(function() {\n")

    for file in js_files_array:
        js = open(os.path.join(path,file), "r")
        output_file.write(js.read())

    output_file.write("})")
    output_file.close()


def get_functions(path, files=None):
    js_files_array = os.listdir(path)

    if files != None:
        for file in js_files_array:
            if not file in files:
                js_files_array.remove(file)

    print js_files_array
    for file in js_files_array:

        js = open(os.path.join(path,file), "r")

        function = "function "
        read_name = 0
        read_parameters = 0
        read_function = 0
        bracket_open = 1
        stack = ""
        name = ""
        parameters = ""
        function_text = ""
        stocked_name = ""
        leftover = ""
        first_bracket = 1
        while 1:
            char = js.read(1)
            if not char:
                if not stocked_name == "":
                    function_struct[stocked_name]["leftover"] = leftover

                break

            
            if read_name == 1 and char != "(":
                name = name + char
            elif read_name == 1 and char == "(":
                function_struct[name] = {}
                print name
                stocked_name = name
                name = ""
                read_name = 0
                read_parameters = 1

            if read_parameters == 1 and char != "{":

                parameters = parameters + char
            elif read_parameters == 1 and char == "{":
                # print parameters
                function_struct[stocked_name]["parameters"] = parameters
                parameters = ""
                # name = ""
                read_parameters = 0
                read_function = 1
                bracket_open = 1
                first_bracket = 1

            if read_function == 1 and bracket_open > 0:
                # print char
                function_text = function_text + char
                if first_bracket != 1 and char == "{":
                    bracket_open = bracket_open + 1
                    
                    # print bracket_open

                elif char == "}":
                    bracket_open = bracket_open - 1
                    # print bracket_open

                first_bracket = 0

            elif read_function == 1 and bracket_open == 0:
                function_struct[stocked_name]["function"] = function_text.replace("\n","")
                # print function_text
                function_text = ""
                # name = ""
                read_function = 0
                bracket_open = 0


            if function.__len__() > stack.__len__() and char == function[stack.__len__()]:
                stack = stack + char
                # print char
            elif stack.__len__() == function.__len__() and stack==function:
                
                stack = ""
                if char != "(" and char != "{" and char != "$":
                    name = name + char
                    read_name = 1
            elif read_name != 1 and read_function != 1 and read_parameters != 1:
                leftover = leftover + stack
                leftover = leftover + char
                stack = ""
            else:
                # leftover = leftover + stack
                stack = ""

            

get_functions("../new_site/js/")

for x in function_struct:
    if "leftover" in function_struct[x]: 
        print function_struct[x]["leftover"]
# print function_struct

# merge_javascript("../new_site/js/", "../new_site/js/modern_ui.js")