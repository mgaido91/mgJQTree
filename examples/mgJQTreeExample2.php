<?php
/*
 Created by Marco Gaido on 25/08/2014.
 
*/
require "../mgJQTreePHPLib.php";

$tree=mg_Tree::loadTreeFromJSON($_GET['tree']);



?>
<!DOCTYPE html>

<html>
<head>
	<title>Tree</title>
	<link rel="stylesheet" href="../mgJQtreeDef.css">
	<script src="jquery-latest.js"></script>
	<script type="text/javascript" src="jquery-ui.min.js"></script>
	<script src="../mgJQTreeJQLib.js"></script>
	<script>
		function toJSON(){
			var json=$("#tree0").mg_getJSONFromTree();
			$("body").append("<p>"+json+"<\/p>");
		}

	</script>
</head>
<body>
	<?php
	$tree->generateTree();
	?>
	<input type="button" value="Display json object" onclick="toJSON()">
</body>
</html>
