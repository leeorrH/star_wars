import { useEffect, useState } from "react";
import { IApi, initResult } from "../APIService";

interface IResult { 
    data : initResult | undefined
    isLoading : boolean
}
export const useFetch = (apiService : IApi) => {
    const [state,setState] = useState({data: undefined ,isLoading: true} as IResult);

    useEffect(()=> { 
        setState({data: undefined, isLoading: true})
        apiService.initializeServiceData().then(apiResult => {
            setState({data: apiResult as initResult, isLoading: false })
        })
    },[apiService])

    return state
}