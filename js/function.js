var globalURL = 'http://micolegio.com/app-movil/include/ajax.php';
//ENVIO DE DATOS MEDIANTE AJAX HACIA PHP
function post(url,json,loader){
    if(loader){
       $(".loader").fadeIn();
    }
    var r;
    $.ajax({
       url: url,
       data: json,
       type: 'post',
       async: false,
       success: function(request){
           if(loader){
               $(".loader").fadeOut();
           }
           r = request;
       },
       error: function( jqXHR, textStatus, errorThrown ){
            if (jqXHR.status === 0) {
                alert('Not connected: Verify Network.');
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
               $(".loader").fadeOut();
           }
       }
    });
    return r;
}
//VALIDAR SESION
function check_session(){
    var json = {case:'session'};
    var session = post(globalURL,json,true);
    return session;
}
//CERRAR SESION
function logout(){
    var json = {case:'logout'};
    var logoutV = post(globalURL,json,true);
    if(!logoutV){
        alert("No se pudo cerrar sesion");
    }else{
        alert("Se ha cerrado la sesion");
        window.location = "../index.html";
    }
}
//OBTENER VARIABLES DEL URL (NO USAR)
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
            var datos = new Array();
            v = variables.split('=')[0];
            d = variables.split('=')[1];
            datos[''+v] = d;
            return datos;
        }
    }else{
        
        return false;
    }
}
//OBTENER FECHA ACTUAL
function curr_date(){
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();

    if(dd<10) {
        dd='0'+dd;
    } 

    if(mm<10) {
        mm='0'+mm;
    } 

    today = yyyy+'-'+mm+'-'+dd;
    return(today);
}

function goBack() {
    $.mobile.changePage("admin_menu.html",{ transition : "none"});
}

function linkLoader (){
    $(".link").click(function(){
        var id = this.id;
        $.mobile.changePage(id,{ transition : "fade" });
    });
}
function selectorColegios(){
    /*  se debe agregr este html
        
        <label>Colegio</label>
        <select name="colegio" id="colegio">
            <!-- CARGA DE PLANTELES -->
        </select>
    
    */
    var json = {case:'planteles'};
    var planteles = post(globalURL,json,true);
    var jsonparse = JSON.parse(planteles);
    var html = '<option value="0">Seleccione...</option>';
    $.each(jsonparse, function(i,val){
        html += '<option value="'+val['cod']+'">'+val['plantel']+'-'+val['cod']+'</option>';
    });
    $('#colegio').html(html);
}