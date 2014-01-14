<?php echo $header_nav; ?>

<!-- wrapper -->
<div class="rapidxwpr floatholder">

  <!-- main body -->
  <div id="middle">
    <!-- <div class="background layoutleft"> -->
      
      <!-- header -->
      <div id="header">

        <!-- logo -->
        <div id="logo">
 					<a href="<?php echo url::site();?>">
						<img src="<?php echo url::site();?>themes/panopticon/images/makerCities_logo_small2.png" alt="Maker Cities" style="" />
					</a>
        </div>
        <!-- / logo -->

        <div id="currentChallenge">
          <div id="currentChallengeTitle">Current Challenge</div>
		  <?php
			$feeds = Database::instance()
			    ->from('feed_item')
				->orderby('item_date', 'desc')->get()->as_array();
			?>
		  <div id="currentChallengeName"><?php echo $feeds[0]->item_title; ?></div>
        </div>
        <!-- / currentChallenge -->

      </div>
      <!-- / header -->
          <!-- / header item for plugins -->
          <?php
              // Action::header_item - Additional items to be added by plugins
            Event::run('ushahidi_action.header_item');
          ?>

      <!-- mainmenu -->
      <!-- <div id="mainmenu" class="clearingfix">
        <ul>
          <?php nav::main_tabs($this_page); ?>
        </ul>

        <?php if ($allow_feed == 1) { ?>
        <div style="float:right;"><a href="<?php echo url::site(); ?>feed/"><img alt="<?php echo htmlentities(Kohana::lang('ui_main.rss'), ENT_QUOTES); ?>" src="<?php echo url::file_loc('img'); ?>media/img/icon-feed.png" style="vertical-align: middle;" border="0" /></a></div>
        <?php } ?>

      </div> -->
      <!-- / mainmenu -->
      
      <div id="panel-wrapper" class="open">

        <div id="panelHeader">
          How will <span id="panelHeaderYellow">Your</span> City <br>be a <span id="panelHeaderPink">Maker City in 2025?</span>
        </div>

        <ul id="panel-tabs">

        <div class="panelMenuWhiteSection">
          <li class="panel-submit"><a href="#submit">Add Your Future</a></li>
        
          <div class="panelTabsRight">
            <li class="panel-pins"><a href="#pins">All Futures</a></li>  
            <li class="panel-scoreboard"><a href="#scoreboard"><?php echo Kohana::lang('makercities.tab_scoreboard'); ?></a></li>
          </div>

          <br clear="all">
        </div>

        <div class="panelMenuBottom">
          <li class="panel-recentFutures"><a href="#recentFutures">Recent Futures</a></li>  
          <li class="panel-myFutures"><a href="#myFutures">My Futures</a></li> 
          <li class="panel-topFutures"><a href="#topFutures">Top Futures</a></li> 
        </div>

        </ul>
        <div id="submit-panel" class="panel">
          <iframe name="reports" src="<?php echo url::site();?>reports/submit?panel" frameborder="0" ></iframe>
        </div>
        <div id="pins-panel" class="panel">          
          <iframe name="pins" src="<?php echo url::site();?>reports?panel" frameborder="0" ></iframe>
        </div>
        <div id="scoreboard-panel" class="panel">
          <iframe src="<?php echo url::site();?>scoreboard" frameborder="0" ></iframe>
        </div>
        <div id="info-panel" class="panel">
          <iframe frameborder="0" ></iframe>
        </div>
      </div>
