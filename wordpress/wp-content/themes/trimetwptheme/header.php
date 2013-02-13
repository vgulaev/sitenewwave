﻿<?php
/**
 * The Header for our theme.
 *
 * Displays all of the <head> section and everything up till <div id="main">
 *
 * @package WordPress
 * @subpackage Twenty_Twelve
 * @since Twenty Twelve 1.0
 */
?><!DOCTYPE html>
<?php
    $wwwdir = "C:/Users/Administrator/workspace/sitenewwave/";
    $doc = new DOMDocument();
    libxml_use_internal_errors(true);
    $doc->loadHTMLFile($wwwdir."/locate/ru/templates/mainpage_template.html");
    libxml_use_internal_errors(false);
    
    $template_string = $doc->saveHTML();
    
    //echo "<pre>"; print_r($doc); echo "</pre>";
    $template_string = substr($template_string, 106);
    $template_string = str_replace("</body>", "", $template_string);
    $template_string = str_replace("</html>", "", $template_string);
    
    echo $template_string;
?>
	<div id="main" class="wrapper">