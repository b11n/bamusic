

var iframe = document.createElement('iframe');
iframe.style.display = "none";
if(location.pathname == "/BusSelect/Index"){
  	iframe.src = "https://mobweb-prod2.redbus.in/search" + location.search;
}else if(location.pathname == "/Seatlayout/Summary"){
  	iframe.src = "https://mobweb-prod2.redbus.in/seats" + location.search+"&oid=1";
}else if(location.pathname == "/"){
	iframe.src = "https://mobweb-prod2.redbus.in";
}else{
	iframe.src = "https://mobweb-prod2.redbus.in";
}
document.body.appendChild(iframe);
