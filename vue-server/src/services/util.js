export default {
    resAuthCheck(res, component) {
        if(res.data.success) {
            return res.data;
        } else {
            if(res.data.badAuth) {
                component.$store.dispatch('setBadAuthASec');
                component.$store.dispatch('userLogout', {
                    noRequest: true,
                    noRedirect: true,
                });
            } else if (res.data.badPrivilege) {
                component.$store.commit('setBadPrivilege', true);
            } else if (res.data.msg) {
                alert(res.data.msg);
            } else {
                return null;
            }
        }
    }   
}