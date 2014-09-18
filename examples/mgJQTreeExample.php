<?php
/*
 Created by Marco Gaido on 25/08/2014.
 
*/
require "../mgJQTreePHPLib.php";

$root=new mg_Node("Parent", "root");

	$c1=new mg_Node("Child", "c1");
		$gc=new mg_Node("Grand Child");

	$secCh=new mg_Node("Second Child");
		$tert=new mg_Node("Tertiary Child");
		$with3Sons=new mg_Node("Child with 3 Sons");
			$leaf=new mg_Node("Leaf", "", true);
			$son=new mg_Node("Son");
			$son2=new mg_Node("Son2");
$son->setProperty("test", 12);	
$tree=new mg_Tree($root);
$tree->addNewChild($root, $c1);
$tree->addNewChild($root, $secCh);
$tree->addNewChild($c1, $gc);
$tree->addNewChild($secCh, $tert);
$tree->addNewChild($secCh, $with3Sons);
$tree->addNewChild($with3Sons, $leaf);
$tree->addNewChild($with3Sons, $son);
$tree->addNewChild($with3Sons, $son2);



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
		function addNewNode(){
			$("#c1").mg_addNode({label:"MY NEW NODE"});
		}
		function toJSON(){
			var json=$("#tree0").mg_getJSONFromTree();
			$("body").append("<p>"+json+"<\/p>");
		}
		function addInfo(){
			$("#root").mg_addInfos({"ITA":"radice"});
			logRootInfo();
		}
		function logRootInfo(){
			console.log($("#root").mg_getInfos());
		}
		function newWindow(){
			var json=$("#tree0").mg_getJSONFromTree();
			window.open("mgJQTreeExample2.php?tree="+json);
		}
		$(function(){
			$(".tree").on("nodeDragged", 
				function(event, draggedNode, newParent){
					alert("Dragged: "+$(draggedNode).text()+". Its new parent is: "+$(newParent).text());
				});
		});
		
		
	</script>
</head>
<body>
	<?php
	$tree->generateTree();
	?>
	<input type="button" value="Add new node" onclick="addNewNode()">
	<input type="button" value="Display json object" onclick="toJSON()">
	<input type="button" value="Open in new window" onclick="newWindow()">
	<input type="button" value="Add some info to root" onclick="addInfo()">
	
</body>
</html>
