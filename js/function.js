var globalURL = 'http://micolegio.com/app-movil/include/ajax.php';
//ENVIO DE DATOS MEDIANTE AJAX HACIA PHP
function post(url,json,loader){
    if(!document.getElementById("loader")){
        $("body").append('<img src="jquery.mobile-1.4.5/images/ajax-loader.gif" alt="Cargando..." id="loader" style="display:none; position:fixed; left:45%; top:30%;"/>');
    }
    var r;
    $.ajax({
       url: url,
       data: json,
       type: 'post',
       async: false,
       beforeSend: function () {
           if(loader){
               $("#loader").fadeIn();
           }
        },
       success: function(request){
           if(loader){
               $("#loader").fadeOut();
           }
           r = request;
       },
       error: function( jqXHR, textStatus, errorThrown ){
            if (jqXHR.status === 0) {
                alert('Not connect: Verify Network.');
            } else if (jqXHR.status == 404) {
                alert('Requested page not found [404]');
            } else if (jqXHR.status == 500) {
                alert('Internal Server Error [500].');
            } else if (textStatus === 'parsererror') {
                alert('Requested JSON parse failed.');
            } else if (textStatus === 'timeout') {
                alert('Time out error.');
            } else if (textStatus === 'abort') {
                alert('Ajax request aborted.');
            } else {
                alert('Uncaught Error: ' + jqXHR.responseText);
            }
           if(loader){
               $("#loader").fadeOut();
           }
       }
    });
    return r;
}
//VALIDAR SESION
function check_session(){
    var json = {case:'session'};
    var session = post(globalURL,json,false);
    alert(session);
    return session;
}
//CERRAR SESION
function logout(url){
    var json = {case:'logout'};
    var logout = post(globalURL,json,true);
    if(!logout){
        alert("No se pudo cerrar sesion");
    }else{
        alert("Se ha cerrado la sesion");
        //$.mobile.changePage( url, { transition: "flip" });
        window.location = url;
    }
}
//OBTENER VARIABLES DEL URL
function vars_url(loc){
    if(loc.indexOf('?') > 0){
        var variables = loc.split('?')[1];
        if(variables.indexOf('&') > 0){
            var var_data = variables.split('&');
            var datos = new Array();
            var v;
            var d;
            $.each(var_data, function(i,val){
                v = val.split('=')[0];
                d = val.split('=')[1];
                datos[''+v] = d;
            });
            return datos;
        }else{
            return variables.split('=')[1];
        }
    }
}
//OBTENER FECHA ACTUAL
function curr_date(){
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();
    var hour = today

    if(dd<10) {
        dd='0'+dd
    } 

    if(mm<10) {
        mm='0'+mm
    } 

    today = yyyy+'/'+mm+'/'+dd;
    return(today);
}