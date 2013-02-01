$(document).ready( function(){
	$(".orderItem").click( function(){
		$(".orderDownload").hide()
		// alert(0)
		$(this).find(".orderDownload").each( function(){
			// alert(1)
			$(this).show()
		})

	})	
})

function openLink(linkUID, type) {
    $.ajax({
        type: "POST",
        url: "/1cengine/site/getfilelink.php",
        async: false,
        data: "linkUID=" + linkUID + "&type=" + type + "",
        success: function(html) {
            //var success = 'true';
            window.location.href = html
            // alert(html)
        }
    });
}