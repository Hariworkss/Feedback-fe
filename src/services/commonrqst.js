import axios from "axios";

export const commonrequest= async (method,url,body,header)=>{
    let config={
        method,
        url,
        headers:header?header:{
            "Content-Type":"application/json"
        },
        data:body
    }
    // request instance
    return axios(config).then(response=>{      
        return response
    }).catch(err=>{
        return err
    })
}