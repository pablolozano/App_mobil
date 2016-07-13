//CUANDO EL DOM ESTE CARGADO
$(document).on("pageshow","#login-main",function(event, ui){
    //VALIDAR SESION
    if(check_session()){
        $.mobile.changePage("admin/admin_menu.html",{ transition : "none"});
    }else{
        //HACER FOCUS EN EL INPUT DEL USUARIO
        $('#user').focus();
        //VALIDAR USUARIO Y CONTRASEÑA AL HACER CLIC
        $('#loginbtn').click(function(){
            var user = $('#user').val();
            var pass = $('#pass').val();
            var json = {case:'login',user:user,pass:pass};
            var login = post(globalURL,json,true);
            if(!login){
                alert("Usuario o Contraseña no validos");
            }else{
                //REDIRECCIONAR Y ENVIAR VARIABLES POR URL
                $.mobile.changePage("admin/admin_menu.html",{ transition : "fade"});
            }
        });
    }
});