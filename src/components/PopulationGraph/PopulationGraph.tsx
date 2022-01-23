import { IApi, SEARCH_FIELDS } from '../../API/APIService'
import { useSearch } from '../../customHooks/useSearchSWAPI'
import './PopulationGraph.css'
interface Props {
    displayPlanets: string[];
    service: IApi;
}

const PopulationGraph = ({ displayPlanets, service }: Props) => {
    const planetsPopulation = useSearch(service, SEARCH_FIELDS.PLANETS, displayPlanets)
    let maxPopulation = planetsPopulation.isLoading ? 0 : Math.max(...(Array.from(planetsPopulation.data, (({ population }) => population))))
    return (
        planetsPopulation.isLoading ?
            <p>planets population loading...</p>
            :
            <div className='graphContainer'>
                {
                    planetsPopulation.data.map((planet: any) => {
                        let height = ((planet.population / maxPopulation) * 100) * 5

                        return (
                            <div key={planet.name} style={{ position:'relative', marginRight:30, width: 100, height: height, border: '1px solid', display: 'flex', backgroundColor: 'chocolate' }}>
                                <span style={{width: '100%',position:'absolute', bottom:'-22px'}}>{planet.name}</span>
                                <span style={{width: '100%',position:'absolute', top:'-22px', }}>{planet.population}</span>
                            </div>
                        )
                    })
                }
            </div>
    )
}

export default PopulationGraph
