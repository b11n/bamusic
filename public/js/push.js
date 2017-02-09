window.addEventListener('load', function() {



    if ('serviceWorker' in navigator) {
        console.log('Service Worker is supported');
        if (Notification.permission != 'granted') {
            navigator.serviceWorker.register('service-worker.js').then(function(reg) {
                console.log(':^)', reg);
                reg.pushManager.subscribe({
                    userVisibleOnly: true
                }).then(function(sub) {
                    console.log('endpoint:', sub.endpoint);
                    sendClientIDToServer(sub.endpoint);
                });
            }).catch(function(error) {
                console.log(':^(', error);
            });
        }
    }else{

    }




});


function sendClientIDToServer(clientid){
	$.ajax({
        type:"POST",
		url:"/api/addgcmclient",
		data:{clientid:clientid},
		success:function (data) {
			console.log(data);
		}
	})
}