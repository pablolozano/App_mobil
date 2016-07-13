//sms_solicitud.html
$(document).on("pageshow","#sms-main",function(event, ui){
    //VERIFICAMOS SI SE ENVIARON VARIABLES POR URL
    loc = window.location.href;
    if(loc.indexOf("?") > -1){
        //OBTENEMOS LAS VARIABLES CON LA FUNCION vars_url
        var datos = vars_url(loc);
        //CONSULICITAMOS LAS SOLICITUDES CORRESPONDIENTES AL NUMERO DE PAGINA ENVIADO Y CARGAMOS EL CONTENIDO
        var pagina = post(globalURL,{case:'solicitudes',param:1,pag:datos['pag'],direc:datos['direc']},true);
        contenido(pagina);
        //CALCULAMOS EL NUMERO DE PAGINAS TOTALES Y MOSTRAMOS EL NUMERO QUE CORRESPONDA
        var total_pages = post(globalURL,{case:'total_pages',table:'solicitud_sms',rows:10,where:"SOLICITADO"},false);
        if(total_pages > 1){
            $('#contenido').after('<div class="ui-nodisc-icon" align="center"><a href="#" id="left-page" class="ui-btn ui-shadow ui-corner-all ui-icon-arrow-l ui-btn-icon-notext ui-btn-b ui-btn-inline btn-page">left</a><a href="#" id="right-page" class="ui-btn ui-shadow ui-corner-all ui-icon-arrow-r ui-btn-icon-notext ui-btn-b ui-btn-inline btn-page">right</a><label id="paginacion">1</label> de '+total_pages+'</div>');
        }
        if(datos['direc'] == 'left'){
            $('#paginacion').text(parseInt(datos['pag'])-1);
        }else{
            $('#paginacion').text(parseInt(datos['pag'])+1);
        }
    }else{
        //CONSULICITAMOS LAS SOLICITUDES Y CARGAMOS EL CONTENIDO
        var json = {case:'solicitudes',param:1};
        var solicitudes = post(globalURL,json,true);
        contenido(solicitudes);
        //CALCULAMOS EL NUMERO DE PAGINAS TOTALES Y MOSTRAMOS EL NUMERO QUE CORRESPONDA
        var total_pages = post(globalURL,{case:'total_pages',table:'solicitud_sms',rows:10,where:"SOLICITADO"},false);
        if(total_pages > 1){
            $('#contenido').after('<div class="ui-nodisc-icon" align="center"><a href="#" id="left-page" class="ui-btn ui-shadow ui-corner-all ui-icon-arrow-l ui-btn-icon-notext ui-btn-b ui-btn-inline btn-page">left</a><a href="#" id="right-page" class="ui-btn ui-shadow ui-corner-all ui-icon-arrow-r ui-btn-icon-notext ui-btn-b ui-btn-inline btn-page">right</a><label id="paginacion">1</label> de '+total_pages+'</div>');
        }
    }
    $('.popup').click(function(){
      $('.popup').fadeOut();
    });
    $('#logoutbtn').click(function(){   
        logout();
    });
    $(".sms-solicitudes").click(function(){
        var id = this.id;
        $('.acciones').fadeOut();
        $('#'+id.split("-")[1]).fadeIn();
    });
    $(".sms-visualizar").click(function(){
        var mensaje = this.id;
        $('.popup').html('<p>'+mensaje+'</p>');
        $('.popup').fadeIn();
    });
    $(".sms-gestion").click(function(){
        var parametros = this.id;
        var id = parametros.split("-")[0];
        var opc = parametros.split("-")[1];
        var json = {case:'solicitudes',param:3,id:id,opc:opc};
        var request = post(globalURL,json,true);
        if(request){
            if(opc == '1'){
                alert("La solicitud ha sido descartada exitosamente");
                $('#estatus-'+id).text('DESCARTADO');
            }else if(opc == '2'){
                alert("La solicitud ha sido eliminada exitosamente");
                $('#'+id).fadeOut();
                $('#id-'+id).fadeOut();
            }else if(opc == '3'){
                alert("La solicitud ha sido reenviada exitosamente");
                $('#estatus-'+id).text('REENVIADO');
            }else if(opc == '4'){
                alert("La solicitud se ha marcado como enviada");
                $('#estatus-'+id).text('ENVIADO');
            }else if(opc == '5'){
                alert("La solicitud ha cambiado a 'Envio directo'");
                $('#estatus-'+id).text('ENVIO DIRECTO');
            }
        }else{
            alert("Error de solicitud");
        }
    });
    $('.btn-page').click(function(){
        var direc = this.id.split("-")[0];
        var pag = parseInt($('#paginacion').text());
        if((direc == 'left' && pag != 1) || (direc == 'right' && pag != total_pages)){
            $.mobile.changePage('sms_solicitud.html', { data : { pag : pag, direc: direc }});
        }
    });
    $('.sms-edit').click(function(){
        var datos = this.id;
        $.mobile.changePage('sms_crear.html', { data : { datos : datos }});
    });
    linkLoader();
});
//sms_crear.html
$(document).on("pageshow","#sms-crear",function(event, ui){
    //CARGAMOS LA LISTA DE COLEGIOS A UN SELECT
    var json = {case:'planteles'};
    var planteles = post(globalURL,json,true);
    var jsonparse = JSON.parse(planteles);
    var html = '<option value="0">Seleccione...</option>';
    $.each(jsonparse, function(i,val){
        html += '<option value="'+val['cod']+'">'+val['plantel']+'-'+val['cod']+'</option>';
    });
    $('#colegio').html(html);
    //VERIFICAMOS SI SE ENVIARON VARIABLES POR URL
    loc = window.location.href;
    var edit = 0;
    if(loc.indexOf("?") > -1){
        //OBTENEMOS LAS VARIABLES DEL URL
        var data_url = decodeURIComponent(loc.split("?")[1]).replace(/[+]/g," ").replace("datos=","").split("|");
        //CARGAMOS LOS DATOS A CADA INPUT Y SELECT DEL DOM
        $('#colegio').val(data_url[1]).trigger('change');
        $('#tipo').val(data_url[2]).trigger('change');
        $('#prioridad').val(data_url[3]).trigger('change');
        //DAMOS FORMATO AAAA-MM-DD A LA FECHA PARA QUE EL INPUT LO RECONOZCA
        fecha = data_url[4].split("-");
        fecha = fecha[2]+"-"+fecha[1]+"-"+fecha[0];
        $('#fecha').val(fecha);
        //DAMOS FORMATO A LA HORA 00:00 PARA QUE LO RECONOZCA EL INPUT
        hora = data_url[5];
        hora = hora.split(":");
        if(hora[1].indexOf("PM") > -1){
            if(hora[0] != '12'){
                hora[0] = parseInt(hora[0]) + 12;
            }
        }else{
            if(hora[0] == '12'){
                hora[0] = '00';
            }else if(hora[0] != '10' && hora[0] != '11'){
                hora[0] = '0'+hora[0];
            }
        }
        hora[1] = hora[1].substr(0,2);
        $('#hora').val(hora.join(":"));
        $('#mensaje').val(data_url[6]);
        //ASIGNAMOS EL ID DE LA SOLICITUD A LA VARIABLE edit PARA PODER IDENTIFICAR EL REGISTRO Y ACTUALIZARLO
        edit = data_url[0];
        cargar_grados(data_url[1]);
    }
    $('#send').click(function(){
        var colegio = $('#colegio').val();
        var tipo = $('#tipo').val();
        var prioridad = $('#prioridad').val();
        var fechaF = $('#fecha').val();
        var horaFull = $('#hora').val();
        var mensaje = $('#mensaje').val();
        
        //OBTENER FECHA ACTUAL (function.js)
        var fechaI = curr_date();
        
        //VALIDAMOS VARIABLES
        if(mensaje == ""){
            alert("Ingrese un contenido de mensaje");
            return;
        }
        if(horaFull == ""){
            alert("Ingrese una hora de envio");
            return;
        }
        if(fechaF == ""){
            alert("Ingrese una fecha de envio");
            return;
        }
        
        //CAMBIAR HORA A FORMATO 12h
        hora = horaFull.split(':')[0];
        minuto = horaFull.split(':')[1];
        if(parseInt(hora) > 12){
            hora = parseInt(hora) - 12;
            ampm = " PM";
        }else{ 
            if(parseInt(hora) == 0){
                hora = 12;
            }
            ampm = " AM";
        }
        horaFull = hora+":"+minuto+ampm;
        
        var fToday = new Date();
        //FORMATO AAA-MM-DD
        var fi = fechaI.split("-");
        var ff = fechaF.split("-");
        var f1 = new Date(fi[0],fi[1]-1,fi[2],fToday.getHours(),fToday.getMinutes());
        var f2 = new Date(ff[0],ff[1]-1,ff[2],hora,minuto);
        
        //FORMATO DD-MM-AAAA
        var fechaBack = ff[2]+'-'+ff[1]+'-'+ff[0];
        
        // MODIFICAR PARA AGREGAR OPCION A VARIOS COLEGIOS
        if(f2 > f1){
            var select = $('.select:checked').serializeArray();
            select = JSON.stringify(select);
            var grados_check = $('.grados:checked').serializeArray();
            grados_check = JSON.stringify(grados_check);
            json = {case:'solicitudes',param:4,colegio:colegio,tipo:tipo,prioridad:prioridad,fecha:fechaBack,hora:horaFull,mensaje:mensaje,seleccion:select,grados:grados_check,edit:edit};
            var request = post(globalURL,json,true);
            if(request){
                alert('Solicitud de sms enviada satisfactoriamente');
                $.mobile.changePage("sms_crear.html",{ transition : "fade"});
            }else{
                alert('Error al enviar la solicitud de sms, intente de nuevo');
            }
        }else{
            alert('Fecha no valida');
        }
    });
    $('#check_grados').change(function(){
        var check = $( this );
        if(check.prop('checked')){
            $('#div-grados').fadeIn();
        }else{
            $('#div-grados').fadeOut();
        }
    });
    $('#colegio').change(function(){
        var colegio = $('#colegio').val();
        cargar_grados(colegio);
    });
    $('.check-esp').change(function(){
        var check = $( this );
        if(check.prop('checked')){
            $('.select').prop('checked',false);
            check.prop('checked',true);
            $('.select').prop('disabled',true);
            check.prop('disabled',false);
        }else{
            $('.select').prop('disabled',false);
        }
    });
    linkLoader();
});
//CARGA LAS SOLICITUDES EN EL content DE LA PAGINA
function contenido(solicitudes){
    var parse = JSON.parse(solicitudes);
    var html = "";
    var estatus = "";
    var directo = false;
    $.each(parse, function(i,val){
        //VERIFICAMOS EL ESTATUS DE LA SOLICITUD
        if(val['sms_estatus'] == '0'){
            estatus = "SOLICITADO";
            directo = true;
        }else if(val['sms_estatus'] == '1'){
            estatus = "EN COLA";
            directo = true;
        }else if(val['sms_estatus'] == '2'){
            estatus = "EN PROCESO";
            directo = false;
        }else if(val['sms_estatus'] == '3'){
            estatus = "ENVIADO";
            directo = false;
        }else if(val['sms_estatus'] == '4'){
            estatus = "DESCARTADO";
            directo = false;
        }else if(val['sms_estatus'] == '5'){
            estatus = "ENVIO DIRECTO";
            directo = false;
        }
        
        //LA VARIABLE html CONTIENE TODAS LAS SOLICITUDES SEPARADAS POR UN div
        html += "<div class='sms-solicitudes solicitud' id='id-"+val['id']+"'>";
        
        html += "<table cellpadding='1'><thead><tr><th>Plantel</th><th>Estatus</th><th>Hora</th></tr></thead>";
        html += "<tbody><tr><td>"+val['nombre_corto']+"</td><td id='estatus-"+val['id']+"'>"+estatus+"</td><td>"+val['sms_hora']+"</td></tr></tbody></table>";
        
        html += "<table cellpadding='1'><thead><tr><th>Selecci&oacute;n</th><th>Fecha</th></tr></thead>";
        html += "<tbody><tr><td>"+val['sms_seleccion']+"</td><td>"+val['sms_fecha']+"</td></tr></tbody></table>";
        
        html += "<br>";
        //OPCIONES PARA CADA SOLICITUD
        html += "<div id='"+val['id']+"' class='acciones'>";
        html += '<ul data-role="listview">';
        html += '<li data-role="list-divider">Elegir acci&oacute;n</li>';
        html += '<li><a href="#" class="sms-visualizar" id="'+val['sms_mensaje']+'">Visualizar</a></li>';
        html += '<li><a href="#" class="sms-edit" id="'+val['id']+"|"+val['codigo_plantel']+"|"+val['sms_tipo']+"|"+val['sms_prioridad']+"|"+val['sms_fecha']+"|"+val['sms_hora']+"|"+val['sms_mensaje']+'">Editar</a></li>';
        html += '<li><a href="#" class="sms-gestion" id="'+val['id']+'-1">Descartar</a></li>';
        html += '<li><a href="#" class="sms-gestion" id="'+val['id']+'-2">Eliminar</a></li>';
        html += '<li><a href="#" class="sms-gestion" id="'+val['id']+'-3">Reenviar</a></li>';
        html += '<li><a href="#" class="sms-gestion" id="'+val['id']+'-4">Marcar como enviado</a></li>';
        if(directo){
            html += '<li><a href="#" class="sms-gestion" id="'+val['id']+'-5">Env&iacute;o directo</a></li>';
        }
        html += "</ul></div></div>";
    });
    html += "<br>";
    //CARGAMOS EL HTML EN EL content
    $('#contenido').html(html);
    //SE RECARGAN LOS ELEMENTOS INCRUSTADOS PARA APLICAR LOS ESTILOS CSS
    $(".sms-solicitudes").trigger('create');
}
//CARGA LOS GRADOS DEL COLEGIO SELECCIONADO
function cargar_grados(colegio){
    var grados = post(globalURL,{case:'grados',codPlantel:colegio},true);
    html = "";
    if(grados){
        var gds = JSON.parse(grados);
        $.each(gds, function(i,val){
            html += '<label><input type="checkbox" class="grados" value="'+val['codGrado']+'" name="grados[]"/>'+val['nombre']+'</label>';
        });
        $('#div-grados').html(html);
    }
}