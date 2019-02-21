function denyAccess(user_type){
    let is_admin = sessionStorage.getItem('is_admin');

    if(user_type == 'admin'){
        if (is_admin == 'true'){
            navigate_to('403.html');
            return;
        }
    }else if(user_type == 'non-admin'){
        if (is_admin == 'false'){
            navigate_to('403.html');
            return;
        }
    }
}

function goBack(){
    let is_admin = sessionStorage.getItem('is_admin');
    if (is_admin == 'true'){
        navigate_to('admin_dashboard.html');
    }else if(is_admin == 'false'){
        navigate_to('home.html');
    }

}