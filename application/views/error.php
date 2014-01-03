<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title><?php echo $title ?></title>
<?php
echo html::stylesheet('media/css/error');
echo html::script('media/js/jquery', true);
?>
<script type="text/javascript">
$(document).ready(function) { $('#info-x, #info-panel', window.top.document).removeClass('loading'); });
</script>
</head>

<body>
<div id="error">
	<h1><?php echo $title ?></h1>
	<?php echo $content ?>   
</div>
</body>
</html>