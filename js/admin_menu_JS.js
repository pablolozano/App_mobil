var user_data;
$(document).ready(function(){
    if(!check_session()){
        window.location = "../login.html";
    }else{
        user_data = vars_url(document.location.href);
        var accesos = new Array();
        /*
        if(user_data['nivel_acceso'].indexOf(',') > 0){
            accesos = user_data['nivel_acceso'].split(',');
        }else{
            accesos[0] = user_data['nivel_acceso'];
        }
        var n = accesos.length();
        if(n > 0){
            var opciones = "";
            for(i = 0; i < n; i++){
                if(accesos[i] == '10' || accesos[i] == '400'){
                    opciones += '<div class="ui-block-a"><img src="../img/sms-icon.png" width="50px" height="50px" /></div>';
                    opciones += '<div class="ui-block-b"><img src="../img/mailchimp-icon.png" width="50px" height="50px" /></div>';
                    opciones += '<div class="ui-block-c"><img src="../img/twitter-icon.png" width="50px" height="50px" /></div>';
                }
            }
            if(opciones != ''){
                $("#opc").html(opciones);
            }
        }
        */
    }
});