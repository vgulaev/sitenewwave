<?php

header('Content-Type: text/html; charset=' . get_bloginfo('charset'));
header('Vary: user-agent, accept');
header('Cache-Control: no-cache, no-transform');

print '<?xml version="1.0" encoding="UTF-8"?>';

if (file_exists($wpmp_include = wpmp_theme_group_file('header.php'))) {
  include_once($wpmp_include);
} else {
  ?><!DOCTYPE html PUBLIC "-//WAPFORUM//DTD XHTML Mobile 1.1//EN" "http://www.openmobilealliance.org/tech/DTD/xhtml-mobile11.dtd">
  <html xmlns="http://www.w3.org/1999/xhtml">
  <head profile="http://gmpg.org/xfn/11">
    <link rel="stylesheet" href="https://s3.amazonaws.com/codiqa-cdn/mobile/1.2.0/jquery.mobile-1.2.0.min.css" />
    <!--link rel="stylesheet" href="m/my.css" /-->
    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
    <!--script src="https://s3.amazonaws.com/codiqa-cdn/mobile/1.2.0/jquery.mobile-1.2.0.min.js"></script-->
        <!--script src="http://code.jquery.com/mobile/1.3.0/jquery.mobile-1.3.0.min.js"></script-->
    <script src="lib/frameworks/jquerymobile/1.3.0/jquery.mobile-1.3.0.min.js"></script>

    <?php if (get_bloginfo('stylesheet_url') != wpmp_theme_base_style()) { ?>
      <link href="<?php print wpmp_theme_base_style() ?>" rel="stylesheet" type="text/css" />
    <?php } ?>
    <link href="<?php bloginfo('stylesheet_url'); ?>" rel="stylesheet" type="text/css" />
    <link href="<?php print get_theme_root_uri(); ?>/mobile_pack_base/style_structure.css" rel="stylesheet" type="text/css" />
  <?php
}
?>

    <meta http-equiv="Content-Type" content="<?php bloginfo('html_type'); ?>; charset=<?php bloginfo('charset'); ?>" />
    <title><?php bloginfo('name'); ?> <?php if ( is_single() ) { print '&#187; ' . __('Blog Archive', 'wpmp'); } ?><?php wp_title('&#187;'); ?></title>
    <link rel="alternate" type="application/rss+xml" title="RSS 2.0" href="<?php bloginfo('rss2_url'); ?>" />
    <link rel="alternate" type="text/xml" title="RSS .92" href="<?php bloginfo('rss_url'); ?>" />
    <link rel="alternate" type="application/atom+xml" title="Atom 0.3" href="<?php bloginfo('atom_url'); ?>" />
    <link rel="pingback" href="<?php bloginfo('pingback_url'); ?>" />
    <?php wp_head(); ?>
  </head>
  <body class="<?php if($wpmp_theme_group = wpmp_theme_group()) {print $wpmp_theme_group;} else {print 'base';} ?>">  <div id="wrap">
    
      <div data-role="page" id="Main">
        <div data-role="content">  
          <div class="ui-grid-a">
              <div class="ui-block-a" style="width: 180px;">
                  <div style="">
                      <img style="width: 160px; height: 47px" src="/img/logo.png">
                  </div>
              </div>
              <div class="ui-block-b" style="width: 110px;">
                  <div> <a href="http://trimet.ru" data-transition="fade"> Полная версия сайта </a>

                  </div>
              </div>
          </div>
    </div>
    