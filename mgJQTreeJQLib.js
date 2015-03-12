/*
 Created by Marco Gaido on 25/08/2014.
 Copyright (c) 2014 Marco Gaido. All rights reserved.
 
 This software is released under GNU GPLv2 license.
 
 
 	Interface:
 	
 	-	mg_GenerateTree(JsonStruct): this function must be called on a "tree" element. It creates the tree from JsonStruct.
 	
 	-	mg_addNode(newItem): to add a new item (node or leaf) to the selected node.
 							newItem should be an object with properties "label","isLeaf" (true or false), "id" and "infos".
 							The default for "label" and "id" is "", for "isLeaf" is false and for "infos" is nothing.
 							"infos" is an object containing all the information you want to link to the new item.
 							
 	-	mg_getTreeObject(): this function must be called on a "tree" element. It returns an object representing the tree.
 	
 	-	mg_getJSONFromTree(): the same as mg_getTreeObject() but it returns a JSON string.
 		
 	-	mg_addInfos(infoObj): it appends informations (the infoObj object) to the selected node. If some properties already exists
 							in the informations of the node, they will be overwritten.
 							
 	-	mg_getInfos(): it returns an object containing the informations of the selected node.
 	
 	-	mg_getParent(): it returns the parent node of the selected node in the tree.
 		
 	- 	mg_removeFromTree(): it removes the element from the tree
*/

(function($){

	/* *** utilities *** */
	
	// --- for recursion during creation ---
	function mg_TreeRecursiveCreation(currNode, liItem){
		if(currNode.children && currNode.type!="leaf"){
			$.each(currNode.children, function (index, item){
				if(index==0){
					liItem.append("<ul></ul>");
				}
				newli=$("<li><a class='"+(item.type=="leaf"?"treeLeaf":"treeNode")+"' id='"+item.id+"'>"+item.label+"</a></li>");
				if(item.hasOwnProperty("infos")){
					$($(newli).children()[0]).data("infos", item.infos);
				}
				if(item.hasOwnProperty("classes")){
					for(var i=0; i<item.classes.length;++i){
						$($(newli).children()[0]).addClass(item.classes[i]);
					}
				}
				liItem.children().last().append(newli);
				mg_TreeRecursiveCreation(item,newli);
			

			});
		}


	}
	
	//--recursive function for getting object representing tree
	function mg_recursiveTreeObj(obj, currNode){
	
		$.each($(currNode).parent().children("ul").children(), function(index, liItem){
	
			var childNode=$(liItem).children()[0];
			if(!obj.hasOwnProperty("children"))
				obj.children=new Array();
			
			var newChild={};
			newChild.id=$(childNode).attr("id");
			
			if($(childNode).hasClass("treeLeaf"))
				newChild.type="leaf";
			else
				newChild.type="node";
		
			newChild.label=$(childNode).text();
		
			if($(childNode).data("infos")){
				newChild.infos=$(childNode).data("infos");
			}
			var classes = childNode.className.split(/\s+/);
			for (var i = 0; i < classes.length; i++) {
				if(i==0) newChild.classes=new Array();
				if(classes[i]!="treeNode" && classes[i]!="treeLeaf" && classes[i].indexOf("ui-")!=0)
					newChild.classes.push(classes[i]);
			}
			obj.children.push(newChild);
			mg_recursiveTreeObj(newChild, childNode);
			
			
		});
	
	
	
	}

	
	//--- function to handle drop event ---
	function mg_handleDropEvent(event, ui){
		//ui.draggable.parent().parent().css("backgroundColor", "red");
		var parentDragged=ui.draggable.context.parentElement.parentNode;
		var draggedElement=ui.draggable.context.parentElement;
		try{
		
			if($(this).next("ul").children().index(ui.draggable.context.parentElement)!=-1){
				return;
			}
			
			if($(this).next("ul").length==0){
				$(this).after("<ul></ul>");
			}
	
			var oldParent=ui.draggable.parent().parent();
		
			ui.draggable.context.parentElement.parentElement.removeChild(ui.draggable.context.parentElement);
			$(this).next("ul").append(ui.draggable.context.parentElement);
			
			
			
			
			if(oldParent.children().length==0){
				oldParent[0].remove();
			}
			
			$(this).parents(".tree").trigger("nodeDragged", [$(ui.draggable.context.parentElement).children("a")[0], this]);
			
		}catch(exc){
			//alert("Error: action forbidden. "+exc.message);
			$(parentDragged).append(draggedElement);
			if($(this).next("ul").children().length==0){
				$(this).next("ul").remove();
			}
			//console.log(backup);
			//$("#tree1")[0].innerHTML=backup;//toBeChanged
			$(".treeNode").draggable({stack: ".treeNode, .treeLeaf",revert:true,snapTolerance:30});
			$(".treeLeaf").draggable({stack: ".treeNode, .treeLeaf",revert:true,snapTolerance:30});
			$(".treeNode").droppable({drop:mg_handleDropEvent});
		}
	}
	
	var defaultSettings = {
	        // These are the defaults.
			enableDragAndDrop: true
	};


	// --- tree generator function ---
	$.fn.mg_GenerateTree=function(JsonStruct, options){
		//now options is useless, JsonStruct is required
		$.each(this.children(), function(index, item){
										item.remove();
									});
		this[0].mg_JQTree_settings = $.extend(defaultSettings, options );
					
		var list=$("<ul></ul>");
		this.append(list);
		
		newli=$("<li><a class='"+(JsonStruct.type=="leaf"?"treeLeaf":"treeNode")+"' id='"+JsonStruct.id+"'>"+JsonStruct.label+"</a></li>");
		if(JsonStruct.hasOwnProperty("infos")){
			$($(newli).children()[0]).data("infos", JsonStruct.infos);
		}
		if(JsonStruct.hasOwnProperty("classes")){
			for(var i=0; i<JsonStruct.classes.length;++i){
				$($(newli).children()[0]).addClass(JsonStruct.classes[i]);
			}
		}
		
		list.append(newli);
		
		mg_TreeRecursiveCreation(JsonStruct, newli);
		
		if(this[0].mg_JQTree_settings.enableDragAndDrop){
			$(".treeNode").draggable({stack: ".treeNode, .treeLeaf",revert:true,snapTolerance:30});
			$(".treeLeaf").draggable({stack: ".treeNode, .treeLeaf",revert:true,snapTolerance:30});
			$(".treeNode").droppable({drop:mg_handleDropEvent});
		}
		//backup=this.innerHTML;//toBeChanged
		
	};
	
	/*function Node(label, id, isLeaf){
			this.label=label;
			this.id=id;
			if(typeof(isLeaf)=="undefined") isLeaf=false;
			this.isLeaf=isLeaf;
		
		}*/
	//---add a node to the current tree node
	$.fn.mg_addNode=function(newItem){
		if(!$(this).hasClass("treeNode")){
			throw {message:"A new node can be added only to a treeNode object (i.e. an element of treeNode class)."};
		}
		
		var child=$.extend({label:"", id:"",isLeaf:false}, newItem);
		
		if(this.next("ul").length==0){
			this.after("<ul></ul>");
		}
		
		
		var newli=$("<li><a class='"+(child.isLeaf?"treeLeaf":"treeNode")+"' id='"+child.id+"'>"+child.label+"</a></li>");
		if(newItem.hasOwnProperty("infos")){
			$($(newli).children()[0]).data("infos", newItem.infos);
		}
		if(newItem.hasOwnProperty("classes")){
			for(var i=0; i<newItem.classes.length;++i){
				$($(newli).children()[0]).addClass(newItem.classes[i]);
			}
		}
		this.next("ul").append(newli);
		
		if(this.parents(".tree")[0].mg_JQTree_settings.enableDragAndDrop){
			$(".treeNode").draggable({stack: ".treeNode, .treeLeaf",revert:true,snapTolerance:30});
			$(".treeLeaf").draggable({stack: ".treeNode, .treeLeaf",revert:true,snapTolerance:30});
			$(".treeNode").droppable({drop:mg_handleDropEvent});
		}
	}
	
	
	//---get object from the tree
	$.fn.mg_getTreeObject=function(){
		if(!$(this).hasClass("tree")){
			throw {message:"JSON can be extracted only from a tree object (i.e. an element of tree class)."};
		}
		var obj={};
		
		var rootNode=$(this).children().children().children()[0];
		
		obj.id=$(rootNode).attr("id");
		
		if($(rootNode).hasClass("treeLeaf"))
			obj.type="leaf";
		else
			obj.type="node";
		
		obj.label=$(rootNode).text();
		
		if($(rootNode).data("infos")){
			obj.infos=$(rootNode).data("infos");
		}
		var classes = rootNode.className.split(/\s+/);
		for (var i = 0; i < classes.length; i++) {
			if(i==0) obj.classes=new Array();
			if(classes[i]!="treeNode" && classes[i]!="treeLeaf"  && classes[i].indexOf("ui-")!=0)
				obj.classes.push(classes[i]);
		}
		mg_recursiveTreeObj(obj, rootNode);
		return obj;
	}
	//---get the JSON representation of the tree
	$.fn.mg_getJSONFromTree=function(){
		return JSON.stringify($(this).mg_getTreeObject());
	}
	
	//---add an info to a node of the tree
	
	$.fn.mg_addInfos=function(infoObj){
		if(!$(this).hasClass("treeNode") && !$(this).hasClass("treeLeaf")){
			throw {message:"Infos can be added only to a treeNode or treeLeaf object (i.e. an element of treeNode or treeLeaf class)."};
		}
		if(infoObj === null || typeof infoObj !== 'object'){
			throw {message:"The infoObj parameter must be an object."};
		}
		$(this).data("infos",$.extend($(this).data("infos"), infoObj));
	
	}
	
	$.fn.mg_getInfos=function(){
		if(!$(this).hasClass("treeNode") && !$(this).hasClass("treeLeaf")){
			throw {message:"Infos can be retrieved only from a treeNode or treeLeaf object (i.e. an element of treeNode or treeLeaf class)."};		}
		
		return $(this).data("infos");
	
	}
	
	$.fn.mg_getParent=function(){
		if(!$(this).hasClass("treeNode") && !$(this).hasClass("treeLeaf")){
			throw {message:"Parent can be retrieved only from a treeNode or treeLeaf object (i.e. an element of treeNode or treeLeaf class)."};
		}
		return $(this).parent().parent().parent().children().first();
	
	}
	
	$.fn.mg_removeFromTree=function(){
		if(!$(this).hasClass("treeNode") && !$(this).hasClass("treeLeaf")){
			throw {message:"Only a treeNode or treeLeaf object can be removed from the tree."};
		}
		var oldParent=this.parent();
		
		oldParent[0].removeChild(this[0]);
		var ulParent = $(oldParent[0]).parent();

		if($(oldParent[0]).children().length==0){
			$(oldParent[0]).remove();
		}
		if($(ulParent[0]).children().length==0){
			$(ulParent[0]).remove();
		}
	}
	
}(jQuery));
