function toggleNav(){
	if (document.getElementById("menu").style.width == "250px"){
		document.getElementById("menu").style.width = "0px";
		document.getElementById("content").classList.remove("open");
	}
	else{
		document.getElementById("menu").style.width = "250px";
		document.getElementById("content").classList.add("open");
		// document.getElementById("content").style.left = "250px";
	}
}

function clickMenu(id) {
  var i;
  var c = document.getElementById("menu").children;
  for (i = 0; i < c.length; i++) {
  	if(c[i].className == 'selectedMenu'){
  		document.getElementById(c[i].id).classList.remove('selectedMenu');
  	}
  }
	document.getElementById(id).classList.add('selectedMenu');
	  
	// var d = document.getElementById("content2").children;
	// for (i = 0; i < d.length; i++) {
	// 	var page = id + "-page";
	// 	console.log(page);
	// 	if(d[i].id == page){
	// 		console.log(d[i].id);
	// 		d[i].style.visibility = "visible";
	// 	}
	// 	else if (d[i].style.visibility == "visible"){
	// 		console.log(d[i].id);
	// 		d[i].style.visibility = "hidden";		
	// 	}
	// 	else{
	// 		console.log(d[i].style.visibility);
	// 	}
 //  }

	//console.log(document.getElementById("content").innerHTML);
	var url = id + '.html';
	// console.log(url);
	document.getElementById("content").src = url;
	document.getElementById("content").innerHTML = document.getElementById("content").innerHTML + id;
	//console.log(document.getElementById("content").innerHTML);
	//document.getElementById("content").src = "test.html";
}

