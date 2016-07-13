
var user_data;
var cont;
var fecha;
var hora;
var minuto;
var ampm;
var img = false;
var codigo_plantel;
$(document).on("pageshow","#twitter-main",function(event, ui){
    var aux;
    selectorColegios();
    var user =  check_session();
    if(!user){
        logout();
    }else{
        //arreglo dado por ajax ej: user_data['nivel_acc'], user_data['userName'] ,user_data['codPlantel'], user_data['codWeb']
        user_data = JSON.parse(user);
        //si esta en la pagina de listas twitter
        if(window.location.href.indexOf('twitter_lista') > -1){
            var currPage = 1;
            var params = vars_url(window.location.href);
            if(params){
                currPage = params['lastPage'];
            }
            //parametro 2 es query a listas twitter (ilegible gracias a jose) todo: modificar para varios colegios 
            var json = {case:'solicitudes',param:2,page:currPage};
            var solicitudes = post(globalURL,json,true);
            if(solicitudes && solicitudes != 'false'){
                var parse = JSON.parse(solicitudes);
                var estatus = "";
                var html = "<div data-role='content' id='contenido'>";
                $.each(parse, function(i,val){
                    html += "<div data-role='content' id='"+val['id']+"-div' class='solicitud card'>";
                    html += "<table><thead><tr><th>Plantel</th><th>Estatus</th><th>Fecha</th><th>Hora</th></tr></thead>";
                    html += "<tbody><tr><td>"+val['nombre_corto']+"</td><td>"+getEstatus(val['tuit_estatus'])+"</td><td id='"+val['id']+"-fecha'>"+val['tuit_fecha']+"</td><td id='"+val['id']+"-hora'>"+val['tuit_hora']+"</td></tr></tbody></table>";
                    html += "<table><thead><tr><th>Mensaje</th></tr></thead>";
                    html += "<tbody><tr><td id='"+val['id']+"-msj'>"+val['tuit_mensaje']+"</td></tr></tbody></table>";
                    html += "</div>";
                    html += "<div id='"+val['id']+"-menu' class='menu'>";
                    html += '<ul class="opc-list" data-role="listview">';
                    html += '<li data-role="list-divider">Elegir acci&oacute;n</li>';
                    html += '<li><a href="#" class="action-link" id="'+val['id']+'-edit">Editar</a></li>';                
                    html += '<li><a href="#" class="twitter-gestion" id="'+val['id']+'-Descartar">Descartar</a></li>';
                    html += '<li><a href="#" class="twitter-gestion" id="'+val['id']+'-Eliminar">Eliminar</a></li>';
                    html += '<li><a href="#" class="twitter-gestion" id="'+val['id']+'-Reenviar">Reenviar</a></li>';
                    html += '<li><a href="#" class="twitter-gestion" id="'+val['id']+'-Enviar">Marcar como enviado</a></li>';             html += "</ul></div>";
                    /*  formato de clases:
                            div : card -> div : menu -> div : opc-list -> a : twitter-gestion
                    */
                });
                html += "</div>";
                $('#head').after(html);   
                if(currPage != 1){
                    $('#contenido').after('<div class="ui-nodisc-icon" align="center"><a href="#" id="left-page" class="ui-btn ui-shadow ui-corner-all ui-icon-arrow-l ui-btn-icon-notext ui-btn-b ui-btn-inline btn-page"></a><a href="#" id="right-page" class="ui-btn ui-shadow ui-corner-all ui-icon-arrow-r ui-btn-icon-notext ui-btn-b ui-btn-inline btn-page"></a><label id="paginacion">'+currPage+'</label></div>');
                }else{
                    $('#contenido').after('<div class="ui-nodisc-icon" align="center"><a href="#" class="ui-btn ui-shadow ui-corner-all ui-icon-arrow-l ui-btn-icon-notext ui-btn-b ui-btn-inline"></a><a href="#" id="right-page" class="ui-btn ui-shadow ui-corner-all ui-icon-arrow-r ui-btn-icon-notext ui-btn-b ui-btn-inline btn-page"></a><label id="paginacion">'+currPage+'</label></div>');
                }
                //Recargar css luego de añadir contenido dinamico
                $("#contenido").trigger('create');
            }else{
                var html;
                html = "<div data-role='content' id='contenido'>"
                html += "<lable> Ha llegado al fin del contenido </lable>";
                //html += "";
                html += "</div>";
                $('#contenido').after('<div class="ui-nodisc-icon" align="center"><a href="#" id="left-page" class="ui-btn ui-shadow ui-corner-all ui-icon-arrow-l ui-btn-icon-notext ui-btn-b ui-btn-inline btn-page"></a><a href="#" class="ui-btn ui-shadow ui-corner-all ui-icon-arrow-r ui-btn-icon-notext ui-btn-b ui-btn-inline"></a><label id="paginacion">'+currPage+'</label></div>');
                $('#head').after(html);                
                //Recargar css luego de añadir contenido dinamico
                $("#contenido").trigger('create');
            }
            
            /*<ul>
                        <li><a href="#" data-icon="grid" class="ui-btn-active">Inicio</a></li>
                        <li><a href="#" data-icon="search">Colegios</a></li>
                        <li><a href="#usuario" data-icon="user" data-transition="flow">Usuario</a></li>
                    </ul>*/
        }else if(window.location.href.indexOf('twitter_menu') > -1){
            var params = vars_url(window.location.href);
            if(params){
                $('#id').val(params['id']);
                var b = params['tuit_fecha'].split('-');
                b = b[2] +'-'+ b[1] +'-'+ b[0];
                $('#sFecha').val(b);
                //var a = arreglar hora
                $('#hora').val(params['tuit_hora']);
                $('#twitMensaje').val(decodeURI(params['tuit_mensaje']).replace(/[+]/g,' '));
            }
        }
        
    }
    $(".action-link").click(function(){
        var id = this.id;
        idSplt = id.split('-');
        cont = $('#'+idSplt[0]+'-msj').text();
        fecha = $('#'+idSplt[0]+'-fecha').text();
        hora = $('#'+idSplt[0]+'-hora').text();
        $.mobile.changePage('twitter_menu.html', { data : { id : idSplt[0], tuit_mensaje : cont , tuit_fecha : fecha , tuit_hora : hora }});
    });
    $('.btn-page').click(function(){
        var direc = this.id.split("-")[0];
        var pag = parseInt($('#paginacion').text());
        if(direc == 'left'){
            pag = pag - 1;
        }else if(direc == 'right'){
            pag = pag + 1;
        }
        $.mobile.changePage('twitter_lista.html', { data : { lastPage : pag}});
    });
    $(".card").click(function(){
        var id = this.id;
        idSplt = id.split('-');
        if(idSplt[1] == 'div'){
            //esconder todos los menus luego abrir el clickeado
            $('.menu').fadeOut();
            $('#'+idSplt[0]+'-menu').fadeIn();
        }
    });    
    //boton de logout
    $('#logoutbtn').click(function(){      
        logout();
    });
    //enviar tweet
    $('#send').click(function(){
        var hora2;
        cont = $('#twitMensaje').val();
        horaFullVal = $('#hora').val();        
        codigo_plantel = $('#colegio').val();
        if(img){
            //process img
        }
        //fecha actual funcion en documento function
        var fechaI = curr_date();
        var fechaF = $('#sFecha').val();
        //validacion de variables
        if(cont == ""){
            alert("ingrese un contenido");
            return;
        }
        if(codigo_plantel == "0"){
            alert("seleccione un plantel");
            return;
        }
        if(horaFullVal == ""){
            alert("ingrese una hora");
            return;
        }
        if(fechaF == ""){
            alert("ingrese una fecha");
            return;
        }
        if(cont.length > 140){
            alert("solo puede ingresar 140 characteres");
            return;
        }
        //input time llega en formato de 24h
        hora = horaFullVal.split(':')[0];
        minuto = horaFullVal.split(':')[1];
        if(parseInt(hora) > 12){
            hora = parseInt(hora) - 12;
            ampm = " PM";
        }else{ 
            if(parseInt(hora) == 0){
                hora = 12;
            }
            ampm = " AM";
        }
        //variable creada para obtener hora y minutos actuales
        var fToday = new Date();
        if(fechaI != '' && fechaF != ''){
            //formato AAA-MM-DD
            var fi = fechaI.split("-");
            var ff = fechaF.split("-");
            var f1 = new Date(fi[0],fi[1]-1,fi[2],fToday.getHours(),fToday.getMinutes());
            var f2 = new Date(ff[0],ff[1]-1,ff[2],hora,minuto);
            //formato para ingresar la fecha en la base de datos
            var fechaBack = ff[2]+'-'+ff[1]+'-'+ff[0];
            var empty = '';
            var twitId = $('#id').val();
            if(f2 > f1){
                var json = { 
                    case:'tuits',
                    twitMensaje:cont,
                    twitEnlace:empty,
                    twitImg:empty,
                    twitFecha:fechaBack,
                    twitHora:hora,
                    twitMinutos:minuto,
                    twitAmPm:ampm,
                    sendMsj:$('input[name=sendMsj]:checked').val(),
                    twitId:twitId,
                    cod:codigo_plantel
                };
                var response = post(globalURL,json,false);                
                if(!response){
                    alert('no response');
                }else{
                    res = JSON.parse(response);
                    alert(res["message"]);
                    goBack();
                }
            }else{
                alert('Fecha no valida');
            }
        }else{
            alert('Debe completar los campos de fecha');
        }
    });
    $(".twitter-gestion").click(function(){
        var parametros = this.id;
        var id = parametros.split("-")[0];
        var opc = parametros.split("-")[1];
        //parametro 5 es ajax al switch de gestion twitter (ilegible gracias a jose) todo: modificar para varios colegios 
        var json = {case:'solicitudes',param:5,id:id,opc:opc};
        var request = post(globalURL,json,true);
        if(request){
            if(opc == 'Descartar'){
                alert("La solicitud ha sido descartada exitosamente");
            }else if(opc == 'Eliminar'){
                alert("La solicitud ha sido eliminada exitosamente");
                $('#'+id+'-div').fadeOut();
                $('#'+id+'-menu').fadeOut();
            }else if(opc == 'Reenviar'){
                alert("La solicitud ha sido reenviada exitosamente");
            }else if(opc == 'Enviar'){
                alert("La solicitud se ha marcado como enviada");
            }else{
                echo(request);
            }
        }else{
            alert("Error de solicitud");
        }
    });
    linkLoader();
});
//traducir estados de la base de datos a español
function getEstatus(twit_estatus){
    var estatus = 'sin definir';
    switch(twit_estatus){
        case '0':
            estatus = 'Mensaje Solicitado';
        break;
        case '1':
            estatus = 'En cola';
        break;	
        case '2':
            estatus = 'En Proceso';
        break;	
        case '3':
            estatus = 'Mensaje Enviado';
        break;	
        case '4':
            estatus = 'Descartado';
        break;	
        case '5':
            estatus = 'Eliminado';
        break;	
    }
    return estatus;
}
    