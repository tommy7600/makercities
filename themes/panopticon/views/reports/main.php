<div id="content">
	<div class="content-bg">
		<!-- start reports block -->
		<div class="big-block">
			<?php if (isset($_GET['z'])) : ?>
			<h1><?php echo $total_reports . ' ' . Kohana::lang('ui_main.reports'); ?></h1>
			<?php else: ?>
			<h1><?php echo $page_title; ?></h1>
		<?php endif; ?>

		<?php if (isset($_GET['q'])): ?>
			<h2>Matching keyword: <?php echo htmlentities($_GET['q'], ENT_QUOTES, 'UTF-8'); ?></h2>
		<?php endif; ?>
			
		<?php if (isset($myFutures) AND $total_reports == 0): ?>
			<div class="submit report_row">
				<h2 class="center"><a class="panel-submit" href="<?php echo url::site('reports/submit'); ?>" target="reports"><?php echo Kohana::lang('makercities.submit_my_future'); ?></a></h2>
			</div>
		<?php endif; ?>

			<div id="tooltip-box">
				<div class="tt-arrow"></div>
				<ul class="inline-links">
					<li>
						<a title="<?php echo Kohana::lang('ui_main.all_time'); ?>" class="btn-date-range active" id="dateRangeAll" href="#">
							<?php echo Kohana::lang('ui_main.all_time')?>
						</a>
					</li>
					<li>
						<a title="<?php echo Kohana::lang('ui_main.today'); ?>" class="btn-date-range" id="dateRangeToday" href="#">
							<?php echo Kohana::lang('ui_main.today'); ?>
						</a>
					</li>
					<li>
						<a title="<?php echo Kohana::lang('ui_main.this_week'); ?>" class="btn-date-range" id="dateRangeWeek" href="#">
							<?php echo Kohana::lang('ui_main.this_week'); ?>
						</a>
					</li>
					<li>
						<a title="<?php echo Kohana::lang('ui_main.this_month'); ?>" class="btn-date-range" id="dateRangeMonth" href="#">
							<?php echo Kohana::lang('ui_main.this_month'); ?>
						</a>
					</li>
				</ul>
				
				<p class="labeled-divider"><span><?php echo Kohana::lang('ui_main.choose_date_range'); ?>:</span></p>
				<?php echo form::open(NULL, array('method' => 'get')); ?>
					<table>
						<tr>
							<td><strong>
								<?php echo Kohana::lang('ui_admin.from')?>:</strong><input id="report_date_from" type="text" style="width:78px" />
							</td>
							<td>
								<strong><?php echo ucfirst(strtolower(Kohana::lang('ui_admin.to'))); ?>:</strong>
								<input id="report_date_to" type="text" style="width:78px" />
							</td>
							<td valign="bottom">
								<a href="#" id="applyDateFilter" class="filter-button" style="position:static;"><?php echo Kohana::lang('ui_main.go')?></a>
							</td>
						</tr>
					</table>
				<?php echo form::close(); ?>
			</div>

			<div style="overflow:auto;">
				<!-- reports-box -->
				<div id="reports-box">
					<?php echo $report_listing_view; ?>
				</div>
				<!-- end #reports-box -->
				
				<?php if(!isset($_GET['panel'])): ?>
        <div id="filters-box">
					<h2><?php echo Kohana::lang('ui_main.filter_reports_by'); ?></h2>
					<div id="accordion">
						
						<h3>
							<a href="#" class="small-link-button f-clear reset" onclick="removeParameterKey('c', 'fl-categories');"><?php echo Kohana::lang('ui_main.clear')?></a>
							<a class="f-title" href="#"><?php echo Kohana::lang('ui_main.category')?></a>
						</h3>
						<div class="f-category-box">
							<ul class="filter-list fl-categories" id="category-filter-list">
								<li>
									<a href="#"><?php
									$all_cat_image = '&nbsp';
									$all_cat_image = '';
									if($default_map_all_icon != NULL) {
										$all_cat_image = html::image(array('src'=>$default_map_all_icon));
									}
									?>
									<span class="item-swatch" style="background-color: #<?php echo Kohana::config('settings.default_map_all'); ?>"><?php echo $all_cat_image ?></span>
									<span class="item-title"><?php echo Kohana::lang('ui_main.all_categories'); ?></span>
									<span class="item-count" id="all_report_count"><?php echo $report_stats->total_reports; ?></span>
									</a>
								</li>
								<?php echo $category_tree_view; ?>
							</ul>
						</div>
						
						<h3>	
							<a href="#" class="small-link-button f-clear reset" onclick="removeParameterKey('radius', 'f-location-box');removeParameterKey('start_loc', 'f-location-box');">
								<?php echo Kohana::lang('ui_main.clear')?>
							</a>
							<a class="f-title" href="#"><?php echo Kohana::lang('ui_main.location'); ?></a></h3>
						<div class="f-location-box">
							<?php echo $alert_radius_view; ?>
							<p></p>
						</div>
						
						<h3>
							<a href="#" class="small-link-button f-clear reset" onclick="removeParameterKey('mode', 'fl-incident-mode');">
								<?php echo Kohana::lang('ui_main.clear')?>
							</a>
							<a class="f-title" href="#"><?php echo Kohana::lang('ui_main.type')?></a>
						</h3>
						<div class="f-type-box">
							<ul class="filter-list fl-incident-mode">
								<li>
									<a href="#" id="filter_link_mode_1">
										<span class="item-icon ic-webform">&nbsp;</span>
										<span class="item-title"><?php echo Kohana::lang('ui_main.web_form'); ?></span>
									</a>
								</li>
							
							<?php foreach ($services as $id => $name): ?>
								<?php
									$item_class = "";
									if ($id == 1) $item_class = "ic-sms";
									if ($id == 2) $item_class = "ic-email";
									if ($id == 3) $item_class = "ic-twitter";
								?>
								<li>
									<a href="#" id="filter_link_mode_<?php echo ($id + 1); ?>">
										<span class="item-icon <?php echo $item_class; ?>">&nbsp;</span>
										<span class="item-title"><?php echo $name; ?></span>
									</a>
								</li>
							<?php endforeach; ?>

							</ul>
						</div>
						
						<h3>
							<a href="#" class="small-link-button f-clear reset" onclick="removeParameterKey('m', 'fl-media');"><?php echo Kohana::lang('ui_main.clear')?></a>
							<a class="f-title" href="#"><?php echo Kohana::lang('ui_main.media');?></a>
						</h3>
						<div class="f-media-box">
							<p><?php echo Kohana::lang('ui_main.filter_reports_contain'); ?>&hellip;</p>
							<ul class="filter-list fl-media">
								<li>
									<a href="#" id="filter_link_media_1">
										<span class="item-icon ic-photos">&nbsp;</span>
										<span class="item-title"><?php echo Kohana::lang('ui_main.photos'); ?></span>
									</a>
								</li>
								<li>
									<a href="#" id="filter_link_media_2">
										<span class="item-icon ic-videos">&nbsp;</span>
										<span class="item-title"><?php echo Kohana::lang('ui_main.video'); ?></span>
									</a>
								</li>
								<li>
									<a href="#" id="filter_link_media_4">
										<span class="item-icon ic-news">&nbsp;</span>
										<span class="item-title"><?php echo Kohana::lang('ui_main.reports_news')?></span>
									</a>
								</li>
							</ul>
						</div>
						
						<h3>
							<a href="#" class="small-link-button f-clear reset" onclick="removeParameterKey('v', 'fl-verification');">
								<?php echo Kohana::lang('ui_main.clear'); ?>
							</a>
							<a class="f-title" href="#"><?php echo Kohana::lang('ui_main.verification'); ?></a>
						</h3>
						<div class="f-verification-box">
							<ul class="filter-list fl-verification">
								<li>
									<a href="#" id="filter_link_verification_1">
										<span class="item-icon ic-verified">&nbsp;</span>
										<span class="item-title"><?php echo Kohana::lang('ui_main.verified'); ?></span>
									</a>
								</li>
								<li>
									<a href="#" id="filter_link_verification_0">
										<span class="item-icon ic-unverified">&nbsp;</span>
										<span class="item-title"><?php echo Kohana::lang('ui_main.unverified'); ?></span>
									</a>
								</li>
								
							</ul>
						</div>
						<h3>
							<a href="#" class="small-link-button f-clear reset" onclick="removeParameterKey('cff', 'fl-customFields');">
								<?php echo Kohana::lang('ui_main.clear'); ?>
							</a>
							<a class="f-title" href="#"><?php echo Kohana::lang('ui_main.custom_fields'); ?></a>
						</h3>
						<div class="f-customFields-box">
							<?php echo $custom_forms_filter; ?>
							
						</div>
						<?php
							// Action, allows plugins to add custom filters
							Event::run('ushahidi_action.report_filters_ui');
						?>
					</div>
					<!-- end #accordion -->
					
					<div id="filter-controls">
						<p>
							<a href="#" class="small-link-button reset" id="reset_all_filters"><?php echo Kohana::lang('ui_main.reset_all_filters'); ?></a> 
							<a href="#" id="applyFilters" class="filter-button"><?php echo Kohana::lang('ui_main.filter_reports'); ?></a>
						</p>
					</div>          
				</div>
				<!-- end #filters-box --> 
        <?php endif; ?>
			</div>
      
			<div style="display:none">
				<?php
					// Filter::report_stats - The block that contains reports list statistics
					Event::run('ushahidi_filter.report_stats', $report_stats);
					echo $report_stats;
				?>
			</div>

		</div>
		<!-- end reports block -->
		
	</div>
	<!-- end content-bg -->
</div>