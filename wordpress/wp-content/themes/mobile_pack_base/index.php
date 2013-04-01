<?php // get_header(); ?>
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="initial-scale=1.0, user-scalable=no">
        <meta name="apple-mobile-web-app-capable" content="yes">
        <meta name="apple-mobile-web-app-status-bar-style" content="black">
        <title>Тримет новости</title>
        <link rel="stylesheet" href="https://s3.amazonaws.com/codiqa-cdn/mobile/1.2.0/jquery.mobile-1.2.0.min.css" />
        <!--link rel="stylesheet" href="m/my.css" /-->
        <script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
        <!--script src="https://s3.amazonaws.com/codiqa-cdn/mobile/1.2.0/jquery.mobile-1.2.0.min.js"></script-->
        <script src="http://code.jquery.com/mobile/1.3.0/jquery.mobile-1.3.0.min.js"></script>
        <!-- // <script src="lib/frameworks/jquerymobile/1.3.0/jquery.mobile-1.3.0.min.js"></script> -->
        <script src="m/my.js"></script>
        <!-- User-generated css -->
        <style>
        </style>
        <!-- User-generated js -->
        <script>
            try {

                $(function() {

                });

            } catch (error) {
                console.error("Your javascript has an error: " + error);
            }

        </script>
    </head>
    <body>
<!-- Home -->
<div data-role="page" id="Main">
    <div data-role="content">
        <div class="ui-grid-a">
            <div class="ui-block-a" style="width: 180px;">
                <div style="">
                    <img style="width: 160px; height: 47px" src="img/logo.png">
                </div>
            </div>
            <div class="ui-block-b" style="width: 110px;">
                <div>   <a href="http://trimet.ru" data-transition="fade"> Полная версия сайта </a>

                </div>
            </div>
        </div>
        <ul data-role="listview" data-divider-theme="b" data-inset="true">
            
            <?php 
            while (have_posts()) {
                the_post();
                // print '<div class="post" id="post-' . get_the_ID() . '">';
                if(is_single() || is_page()) {
                    print '<h1>' . get_the_title() . '</h1>';
                    wpmp_theme_post_single();
                } else {
                    print '<li data-theme="c">';
                    print '<a href="#article'.get_the_ID().'" data-transition="slide">' . get_the_title() . '</a>';
                    // wpmp_theme_post_summary();
                    print '</li>';
              }
            } 
            ?>
        </ul>
        <!--select id="sdsfsd" name="select-choice-1">
            <option value="null">Выберите группу товаров</option>
        </select-->
        
    </div>
</div>
<!-- news -->


<?php 
    while (have_posts()) {
        the_post();
        // print '<div class="post" id="post-' . get_the_ID() . '">';
        print '<div data-role="page" id="article'.get_the_ID().'">';
        ?>

        <div data-role="content">
        <?php 
            print '<h1>' . get_the_title() . '</h1>';
            print get_the_content(); 
        ?>

        <ul data-role="listview" data-divider-theme="b" data-inset="true">
            <li data-theme="c" data-icon="arrow-l"> <a href="#Main" data-transition="slide"> Назад </a>

            </li>
        </ul>
        <!--a id=" ButtonEx" data-role="button" href="#page1" onclick="doSomething(); return false" rel="external"> Button </a-->
        

    </div>
</div>
    <?php
        // print '<li data-theme="c">';
        // print '<a href="#article'.get_the_ID().'" data-transition="slide">' . get_the_title() . '</a>';
        // // wpmp_theme_post_summary();
        // print '</li>';
  
} 



function wpmp_theme_post_single() {
  wpmp_theme_post(true);
  print '<p class="metadata">'; previous_post_link(__('Previous post:', 'wpmp') . ' %link'); print '<br />'; next_post_link(__('Next post:', 'wpmp') . ' %link'); print '</p>';
  if(!function_exists('wpmp_transcoder_is_last_page') || wpmp_transcoder_is_last_page()) {
    global $post;
    if (!$post->comment_status=='open') {
      print '<p class="metadata">' . __('Comments are closed for this post.', 'wpmp') . '</p>';
      print '</div>';
    } else {
      print '</div>';
      comments_template();
    }
  }
}

function wpmp_theme_post_summary() {
  wpmp_theme_post();
  print '</div>';
}

function wpmp_theme_post($single = false) {
  global $wpmp_summary_first;
  if (!isset($wpmp_summary_first)) {
    $wpmp_summary_first=true;
  }
  $summary = get_option('wpmp_theme_post_summary');
  $metadata = get_option('wpmp_theme_post_summary_metadata')=='true';
  if ($single || $metadata) {
    print '<p class="metadata">'. get_the_time('F jS, Y') . ' by ' . get_the_author() . '</p>';
  }
  if ($single || ($summary!='none' && ($summary!='firstteaser' || $wpmp_summary_first))) {
    print '<div class="entry">';
    the_content(__('Read more', 'wpmp'));
    print '</div>';
    $wpmp_summary_first = false;
  }
  if ($single || $metadata) {
    print '<p class="metadata">' . __('Posted in ', 'wpmp');
    the_category(', ');
    edit_post_link('Edit', ' | ', '');
    print ' | ';
    comments_popup_link('No comments', '1 comment', '% comments');
    print '</p>';
  }
}
?>


    
    </body>
</html>