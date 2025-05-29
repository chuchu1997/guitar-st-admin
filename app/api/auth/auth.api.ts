



import api from "../interceptor";




export interface LoginPayload { 
     email:string;
     password:string;

}


const authApi =  {
    login:async(data:LoginPayload)=>{
        return await api({
            method:"POST",
            url:"/auth/admin/login",
            data
        })
    },
    getUserProfile:async()=>{
        return await api({

            method:'GET',
            url:"/auth/profile"
        })
    }
}

export default authApi;
