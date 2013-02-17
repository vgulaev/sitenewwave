<?php
    require_once("wordpress/wp-load.php");
    echo "Hello";
	$recent_posts = wp_get_recent_posts();
	foreach( $recent_posts as $recent ){
		echo '<li><a href="' . get_permalink($recent["ID"]) . '" title="Look '.esc_attr($recent["post_title"]).'" >' .   $recent["post_title"].'</a> </li> ';
	}
?>
