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
                # print name
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
                function_struct[stocked_name]["function"] = function_text
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

def sort_functions():
    function_list = list(function_struct)


    for x in function_struct:
        # print "function " + x + function_struct[x]["parameters"]
        if "function" in function_struct[x]:
            function_struct[x]["ref"] = []
            for function_name in function_list:
                if function_name+"(" in function_struct[x]["function"]:
                    function_struct[x]["ref"].append(function_name)

            print x, " || ", function_struct[x]["ref"]

    result_list = function_list

    while 1:
        changed = 0
        for x in function_list:
            if "ref" in function_struct[x]:
                if function_struct[x]["ref"].__len__() > 0:
                    for y in function_struct[x]["ref"]:
                        if result_list.index(y) > result_list.index(x):
                            result_list.insert(result_list.index(y)+1, result_list.pop(result_list.index(x)))
                            changed = 1
                        else:
                            result_list.insert(-1, result_list.pop(result_list.index(x)))
        if changed == 0:
            break
    
    print "====================================="

    for x in result_list:
        if "ref" in function_struct[x]:
            print x, " || ", function_struct[x]["ref"]

    return result_list


def compose_js(output):
    function_part = ""
    leftover_part = ""

    for x in function_list:
        function_part = function_part + "\nfunction " + x + function_struct[x]["parameters"]
        if "function" in function_struct[x]:
            function_part = function_part + function_struct[x]["function"]
        if "leftover" in function_struct[x]:
            leftover_part = leftover_part + function_struct[x]["leftover"]

    output_file = open(output, "w+")

    output_file.write(function_part)
    output_file.write("$(document).ready(function() {\n")

    
    output_file.write(leftover_part)

    output_file.write("})")
    output_file.close()

            

get_functions("../new_site/js/")
function_list = sort_functions()
compose_js("../new_site/js/modern_ui.js")





# print function_struct

# merge_javascript("../new_site/js/", "../new_site/js/modern_ui.js")