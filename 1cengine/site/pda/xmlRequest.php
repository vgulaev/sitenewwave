<?php

$xml = simplexml_load_file('pricelist.xml');

print_r($xml->data[0]);
?>
