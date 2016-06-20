var user_data;
$(document).ready(function(){
    if(!check_session()){
        window.location = "../login.html";
    }else{
        user_data = vars_url(document.location.href);
    }
    
    $('#send').click(function(){
        var curr_time = new Date();
        var hour = $('#twitHora').val();
        var minute = $('#twitMinutos').val();
    });
});