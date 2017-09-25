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
	console.log(id);

	var url = {
		prjList: '/projects', 
		prjManage: '/', 
		apply: "/", 
		announce: "/",
		studentForm: "/",
		letterForm: "/users",  
		rmdPerson: "/users/login",
		userManage: '/users/me'
	};
	console.log(url[id]);
	// alert('hold');
	var i;
  var c = document.getElementById("menu").children;
  for (i = 0; i < c.length; i++) {
  	if(c[i].className == 'selectedMenu'){
  		document.getElementById(c[i].id).classList.remove('selectedMenu');
  	}
  }
	document.getElementById(id).classList.add('selectedMenu');
	  
	//var url = id + '.ejs';

	document.getElementById("content").src = url[id];
	//document.getElementById("content").innerHTML = document.getElementById("content").innerHTML + id;
}

