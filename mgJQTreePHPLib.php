<?php
/*
 Created by Marco Gaido on 25/08/2014.
 Copyright (c) 2014 Marco Gaido. All rights reserved.
 
 This software is released under GNU GPLv3 license.
*/
class NodeNotFoundException extends Exception{}

/****
	In order to have this class working properly,
	you need to add jquery, jquery-ui and mgJQTreeJQLib
	scripts into your documents.
*/
class mg_Tree{
	
	private static $treeCounter=0;
	
	
	private $rootNode;
	private $id;
	private $nodeList;
	
	public function __construct($rootNode=null, $id=""){
		
		$this->rootNode=$rootNode;
		
		if($id=="")
			$this->id="tree".(self::$treeCounter++);
		else
			$this->id=$id;
			
		$this->nodeList=array();
		
		if($rootNode!=null){
			$this->nodeList[]=$rootNode;
		}
		
	}
	
	public function addNewChild($parent, $child){
		
		if($parent==$child) throw new Exception("Parent and child must be different.");
		
		if(!in_array($parent, $this->nodeList))
			throw new NodeNotFoundException();
		
		$this->nodeList[]=$child;
		$parent->addChild($child);
		
	}
	
	public function addAllChildren($parent, $children){
		
		foreach($children as $child){
			$this->addNewChild($parent, $child);
		}
	
	}
	
	
	public function setRootNode($rootNode){
		$this->rootNode=$rootNode;
		if($rootNode!=null){
			$this->nodeList[]=$rootNode;
		}
	}
	
	public function serializeToJSON(){
		return $this->rootNode->serializeToJSON();	
	}
	
	public function getId(){return $this->id;}
	
	public function getRootNode(){return $this->rootNode;}
	
	public function generateTree(){
		?>
		<script type="text/javascript"">
			document.write("<div id=\"<?php echo $this->id;?>\" class=\"tree\"><\/div>");
			jQuery(document).ready($("#<?php echo $this->id;?>").mg_GenerateTree(<?php echo $this->serializeToJSON();?>));
		</script>
		<?php
	}
	//lack of infos
	public static function loadTreeFromJSON($json){
		$rootNode=json_decode($json);
		$root=new mg_Node($rootNode->label, $rootNode->id, $rootNode->type=="leaf");
		
		foreach($rootNode->infos as $name => $value){
			
			$root->setProperty($name, $value);
			
		}
		
		$tree=new mg_Tree($root);
		self::recursTreeLoading($tree, $root, $rootNode);
		return $tree;
	}
	
	private static function recursTreeLoading(&$tree, &$node, $jsonNode){
		foreach($jsonNode->children as $child){
			$childNode=new mg_Node($child->label, $child->id, $child->type=="leaf");
			foreach($child->infos as $name => $value){
				$childNode->setProperty($name, $value);
			}
			$tree->addNewChild($node, $childNode);
			self::recursTreeLoading($tree, $childNode, $child);
		}
			
			
	}

}



class mg_Node{
	
	private $label;
	private $id;
	private $isLeaf;
	private $children;
	private $properties;
	
	public function __construct($label, $id="", $isLeaf=false){
		
		$this->label=$label;
		$this->id=$id;
		$this->isLeaf=$isLeaf;
		$this->children=array();
		$this->properties=array();
		
	}
	
	public function addChild($child){
		$this->children[]=$child;
	}
	
	public function serializeToJSON(){
		$string="{label:\"".$this->label."\", id:\"".$this->id."\", type:\"".(($this->isLeaf)?"leaf":"node")."\"";
		if(count($this->properties)>0){
			$string.=", infos:{";
			foreach($this->properties as $name => $value){
				$string.="\"$name\":\"$value\", ";
			}
			$string=substr($string, 0, -2);
			$string.="}";
		}
		if(count($this->children)>0){
			$string.=", children:[";
			foreach($this->children as $child){
				$string.=$child->serializeToJSON().", ";
			}
			$string=substr($string, 0, -2);
			$string.="]";
		}
		$string.="}";
		return $string;
	}
	public function setProperty($name, $value){
		$this->properties[$name]=$value;
	}
	
	public function getChildren(){return $this->children;}
	
	
}

?>
