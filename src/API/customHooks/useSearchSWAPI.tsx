import { useEffect, useState } from "react";
import { IApi, SEARCH_FIELDS } from "../APIService";

interface IResult {
    data: any
    isLoading: boolean
}

type planetPopulation = { name: string, population: number }

export const useSearch = (apiService: IApi, searchField: SEARCH_FIELDS, toSearch: string[]) => {
    const [state, setState] = useState({ data: undefined, isLoading: true } as IResult);

    useEffect(() => {
        async function getSearchedPlanets() {
            const promises: Promise<any>[] = []
            let result: planetPopulation[] = []
            let p: number
            setState({ data: undefined, isLoading: true })
            toSearch.forEach(value => {
                promises.push(
                    apiService.searchWithParams(searchField, value).then(apiResult => {
                        p = +apiResult.results[0].population
                        result.push({ name: value, population: p })
                    })
                )
            });
            await Promise.all(promises);
            setState({ data: result, isLoading: false })
        }
        getSearchedPlanets()
    }, [apiService, searchField, toSearch])

    return state
}