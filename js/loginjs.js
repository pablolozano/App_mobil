//CUANDO EL DOM ESTE CARGADO
$(document).ready(function(){
    //VALIDAR SESION
    if(check_session()){
        window.location = "admin/admin_menu.html#inicio";
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
                var l = JSON.parse(login);
                window.location = "admin/admin_menu.html#inicio?codWeb="+l['codigo']+"&userName="+l['coduser']+"&nivel_acceso="+l['nivel_acceso'];
            }
        });
    }
});