	(function ($) {
				jQuery.expr[':'].Contains = function(a,i,m){
	      		return (a.textContent || a.innerText || "").toUpperCase().indexOf(m[3].toUpperCase())>=0;
	  		};
	 
	  		function filterList(header, list) {
	  		    tmOutId = 0;
	    		var form = $("<form>").attr({"class":"filterform","action":"#"}),
	        	input = $("<input>").attr({"class":"filterinput","type":"text"});
	        	form.append('Поиск по номенклатуре: ');
	    		$(form).append(input).appendTo(header);
	    		$(input).attr({"placeholder":"Введите здесь наименование", "id":"filterInput"});
	 			list = $('ul#ПрайсЛист');
	    		$(input).change( function () {
	       			var filter = $(this).val();
	        		if(filter) {
	 					$('ul').show();
	          			$matches = $(list).find('span:Contains(' + filter + ')').parent().parent();
	          			if ($matches.hasClass("itemGroup")){
	          				$('li.itemGroup', list).not($matches).hide();
	          				
	          				$matches.show();
	          				
	          			} 
	          			
	          			if ($matches.hasClass("group")){
	          				$('li.group', list).not($matches).hide();
	          				
	          				$('li.group').not($matches).hide();
	          				//$('li.itemGroup').hide();
	          				$matches.find('li.itemGroup').show();
	          				$matches.find('li.group').show();
	          				$matches.parents('li.group').show();
	          				$matches.show();
	          				
	          			} else {
	          				$(list).find("li.itemGroup").hide();
	          				$('li.group').hide();
	          			}
	 
	        		} else {
	          			$(list).find("li").show();
	          			$(list).find("ul").hide();
	        		}
	        			return false;
	      			})
	    		$(input).keyup( function () {
	    		    
	    		    keyEvent = this;
	    		    window.clearTimeout(tmOutId);
	    		    tmOutId = window.setTimeout(  
                        function() {  
                            $(keyEvent).change();  
                        },  
                        1000  
                    );
                
	        		
	    		});
	  		}
	 
	 		$(function () {
	    		filterList($("#form"), $("#list"));
	  		});
		}(jQuery));
		
		$(function(){
			$("label input:checkbox").change(function(){
				
        		if ($("#itemTN").prop("checked")){
				
	 				$('table').find(".itemTN_hid").removeClass("itemTN_hid").addClass("itemTN");
	 			
	 			} else if ($("#itemTN").prop("checked")==false) {
	 				
	 				$('table').find(".itemTN").removeClass("itemTN").addClass("itemTN_hid");
	 			};
	 			
	 			if ($("#itemPC").prop("checked")){
				
	 				$('table').find(".itemPC_hid").removeClass("itemPC_hid").addClass("itemPC");
	 			
	 			} else if ($("#itemPC").prop("checked")==false) {
	 				
	 				$('table').find(".itemPC").removeClass("itemPC").addClass("itemPC_hid");
	 			};
	 			
	 			if ($("#itemPM").prop("checked")){
				
	 				$('table').find(".itemPM_hid").removeClass("itemPM_hid").addClass("itemPM");
	 			
	 			} else if ($("#itemPM").prop("checked")==false) {
	 				
	 				$('table').find(".itemPM").removeClass("itemPM").addClass("itemPM_hid");
	 			};
	 			
	 			//
	 			if ($("#p0").prop("checked")){
				
	 				$('table').find(".p0_hid").removeClass("p0_hid").addClass("p0");
	 			
	 			} else if ($("#p0").prop("checked")==false) {
	 				
	 				$('table').find(".p0").removeClass("p0").addClass("p0_hid");
	 			};
	 			
	 			if ($("#p1").prop("checked")){
				
	 				$('table').find(".p1_hid").removeClass("p1_hid").addClass("p1");
	 			
	 			} else if ($("#p1").prop("checked")==false) {
	 				
	 				$('table').find(".p1").removeClass("p1").addClass("p1_hid");
	 			};
	 			
	 			if ($("#p2").prop("checked")){
				
	 				$('table').find(".p2_hid").removeClass("p2_hid").addClass("p2");
	 			
	 			} else if ($("#p2").prop("checked")==false) {
	 				
	 				$('table').find(".p2").removeClass("p2").addClass("p2_hid");
	 			};
	 			
	 			if ($("#p3").prop("checked")){
				
	 				$('table').find(".p3_hid").removeClass("p3_hid").addClass("p3");
	 			
	 			} else if ($("#p3").prop("checked")==false) {
	 				
	 				$('table').find(".p3").removeClass("p3").addClass("p3_hid");
	 			};
	 			
        		return true;
    		});
   		});
