import { CreateStoreInterface, UpdateStoreInterface } from "@/types/store"
import api from "../interceptor"
import { CreateNewArticleInterface, UpdateArticleInterface,} from "@/types/news";




let url = "/articles"



export interface GetArticleRelateWithStoreDTO {
    storeId: number;
    currentPage?: number;
    limit?: number;
    slug?: string;
}
const ArticleAPI = {
    getArticlesWithStoreID : async (data:GetArticleRelateWithStoreDTO)=>{

        return await api({
            method: "GET",
            url: url,
            params: {
                 slug: data.slug,
                storeId: data.storeId,
                currentPage: data.currentPage || 1,
                limit: data.limit || 4,
               
            }
        })
    },
    createArticle:async(data:CreateNewArticleInterface)=>{
        return await api({
            method: "POST",
            url: url,
            data: data
        })
    },
    updateArticle:async(id:number,data:UpdateArticleInterface)=>{
        return await api({
            method:"PATCH",
            url:`${url}/${id}`,
            data:data
        })
    },
    deleteArticle:async(id:number)=>{
        return await api({
            method:"DELETE",
            url:`${url}/${id}`
        })
    }

}


export default ArticleAPI