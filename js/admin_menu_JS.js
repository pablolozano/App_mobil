var user_data;
$(document).on("pageshow","#inicio",function(event, ui){
    var user =  check_session();
    if(!user){
        logout();
    }else{
        //arreglo dado por ajax ej: user_data['nivel_acc'], user_data['userName'] ,user_data['codPlantel'], user_data['codWeb']
        user_data = JSON.parse(user);
        var accesos = new Array();
        if(user_data['nivel_acc'].indexOf(',') > 0){
            accesos = user_data['nivel_acc'].split(',');
        }else{
            accesos[0] = user_data['nivel_acc'];
        }
        var n = accesos.length;
        if(n > 0){
            var opciones = "";
            for(i = 0; i < n; i++){
                if(accesos[i] == '10' || accesos[i] == '400'){
                    opciones += '<div class="ui-block-a"><a href="#panelsub" id="sms" class="ui-btn ui-shadow ui-corner-all"><img src="../img/sms-icon.png" width="50px" height="50px" /></a></div>';
                    opciones += '<div class="ui-block-b"><a id="mail" class="ui-btn ui-shadow ui-corner-all"><img src="../img/mailchimp-icon.png" width="50px" height="50px" /></a></div>';
                    opciones += '<div class="ui-block-c"><a href="#panelsub" id="twit" class="ui-btn ui-shadow ui-corner-all"><img src="../img/twitter-icon.png" width="50px" height="50px" /></a></div>';
                }
            }
            if(opciones != ''){
                $("#opc").html(opciones);
            }
        }
    }
    //los links dados por las opciones se agregan luego de que se carguen
    $('#twit').click(function(){
        var html = '<center><p><h3>Twitter</h3></p></center>';
        html += '<div><ul>';
        html += '<li><a href="#" class="link" id="twitter_menu.html" style="text-decoration:none">Solicitud de twitter</a></li>';
        html += '<li><a href="#" class="link" id="twitter_lista.html" style="text-decoration:none">Lista de Solicitudes twitter</a></li>';
        $('#panelsub').html(html);
        linkLoader();
    });
    $('#sms').click(function(){
        var html = '<center><p><h3>SMS</h3></p></center>';
        html += '<div><ul>';
        html += '<li><a href="#" class="link" id="sms_solicitud.html" style="text-decoration:none">Gesti&oacute;n de solicitudes</a></li>';
        html += '<li><a href="#" class="link" id="sms_crear.html" style="text-decoration:none">Crear solicitud sms</a></li>';
        html += '</ul></div>';
        $('#panelsub').html(html);
        linkLoader();
    });
    $('#logoutbtn').click(function(){        
        logout();
    });
    
});


