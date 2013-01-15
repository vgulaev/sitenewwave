<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" lang="ru" class="m-locale_ru" xml:lang="ru">
	<head>
		<title></title>
		<meta charset="utf-8" />
		<script type="text/javascript" src='js/jquery.js'> </script>
		<script type="text/javascript" src='js/jquery.blockUI.js'> </script>
		<script type="text/javascript" src='js/getPriceMobile.js'> </script>
		<script type="text/javascript" src='js/uiMobileJS.js'> </script>
		
		
		<link rel="stylesheet" type="text/css" href="styleMobile.css" />

		<script type="text/javascript">
		
		$(document).ready(function() {
   			Privet();
   			
   			var sh = ($(window).height()-120)+'px';
			$('div#scrollable').height(sh);
			
            $('div#chkbxText').click( function() {
                $('div#chkbxLabels').show();
                $(this).hide();
            });
            
            $('a#chkbxLabelsHide').click( function() {
                $('div#chkbxText').show();
                $('div#chkbxLabels').hide();
            });
 		});
		
			
			
		
		</script>
	</head>
	
	<body>  
		<div id="siteHead">
			<p>
			<input id="MyButton" type="button" onclick="Privet()" value="Обновить прайс" style="display:none;"/>
			<div id="chkbxText">Настроить отображение цен</div>
			<div id="chkbxLabels">
			    <a id="chkbxLabelsHide" href=#>Скрыть</a><br />
			    Выводить цены:    
				<label>за тн. <input id="itemTN" type="checkbox"  checked="true" /></label>
				<label>за шт. <input id="itemPC" type="checkbox"  /></label>
				<label>за пог. м. <input id="itemPM" type="checkbox"  /></label>
				<br />
				Выводить цены:    
				<label>до 2тн <input id="p0" type="checkbox" checked="true" /></label>
				<label>от 2-8тн <input id="p1" type="checkbox" checked="true" /></label>
				<label>от 8-15тн <input id="p2" type="checkbox" checked="true" /></label>
				<label>от 15тн <input id="p3" type="checkbox" checked="true" /></label>
			</div>
			</p>
			<div id="form"></div>
		</div>
		<div id="tabDiv">
		<table cellspacing="0" border="0"  id='priceTable'>
		<tbody id="tabHead">
			<tr class='PHeader' id="PHeader">
				<td id='itemNameTD'>

					<span class='itemName'>Номенклатура/Сталь/Мера</span>
				</td>
			
				<td class='p0'>
					<table cellspacing="0" border="0">
						<tr><td colspan="3" class='itemUpper'><span class='itemPriceH'>до 2тн</span></td></tr>
						<tr>
							<td class='itemUpperBottom itemTN' ><span class='itemPrice'>тн.</span></td>
							<td class='itemUpperBottom itemPC_hid'><span class='itemPrice'>шт.</span></td>
							<td class='itemUpperBottom itemPM_hid'><span class='itemPrice'>пог. м.</span></td>
						</tr>
					</table>
				</td>
				<td class='p1'>
					<table cellspacing="0" border="0">
						<tr><td colspan="3" class='itemUpper'><span class='itemPriceH'>от 2-8тн</span></td></tr>
						<tr>
							<td class='itemUpperBottom itemTN' ><span class='itemPrice'>тн.</span></td>
							<td class='itemUpperBottom itemPC_hid'><span class='itemPrice'>шт.</span></td>
							<td class='itemUpperBottom itemPM_hid'><span class='itemPrice'>пог. м.</span></td>
						</tr>
					</table>
				</td>
				<td class='p2'>
					<table cellspacing="0" border="0">
						<tr><td colspan="3" class='itemUpper'><span class='itemPriceH'>от 8-15тн</span></td></tr>
						<tr>
							<td class='itemUpperBottom itemTN' ><span class='itemPrice'>тн.</span></td>
							<td class='itemUpperBottom itemPC_hid'><span class='itemPrice'>шт.</span></td>
							<td class='itemUpperBottom itemPM_hid'><span class='itemPrice'>пог. м.</span></td>
						</tr>
					</table>
				</td>
				<td class='p3'>
					<table cellspacing="0" border="0">
						<tr><td colspan="3" class='itemUpper'><span class='itemPriceH'>от 15тн</span></td></tr>
						<tr>
							<td class='itemUpperBottom itemTN' ><span class='itemPrice'>тн.</span></td>
							<td class='itemUpperBottom itemPC_hid'><span class='itemPrice'>шт.</span></td>
							<td class='itemUpperBottom itemPM_hid'><span class='itemPrice'>пог. м.</span></td>
						</tr>
					</table>
				</td>
				<td id='scrtd'></td>
			</tr>
		
			
			<tr class="PList">
				<td colspan="6" class='list'>
					<div id="scrollWrapper">
					<div id="scrollable">
						<ul id="ПрайсЛист">
	
						</ul>
					</div>
					
					</div>
				</td>
			</tr>
			</tbody>
		</table>
		</div>
	</body>
</html>
