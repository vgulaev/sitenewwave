<?php
    require_once("wordpress/wp-load.php");
    //echo "Hello";
	$recent_posts = wp_get_recent_posts();
	$k = 0;
    foreach( $recent_posts as $recent ){
        if ($k == 0) {
        echo '<li class = "first"><span>'.$recent["post_date"].'</span><a href="' . get_permalink($recent["ID"]) . '" title="Look '.esc_attr($recent["post_title"]).'" >' .   $recent["post_title"].'</a> </li> ';
        }
        else {
        echo '<li><span>'.$recent["post_date"].'</span><a href="' . get_permalink($recent["ID"]) . '" title="Look '.esc_attr($recent["post_title"]).'" >' .   $recent["post_title"].'</a> </li> ';
        }
        $k = $k + 1;
        if( $k >= 5 ){
            break; // Больше пяти новостей смотрится уже плохо и не красиво
        }
	}
?>
