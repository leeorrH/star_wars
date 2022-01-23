import { IApi, initResult } from '../../APIService'
import '../LargestPopulation/LargestPopulation.css'
interface Props {
    apiResult: initResult
    apiService: IApi
}

function computeLargetsPopulation(service: IApi, apiResult: initResult) {
    let maxPopulation: number = 0
    let vehicles = computeVehiclesPopulation(service, apiResult);
    vehicles.forEach(vehicle => {
        maxPopulation = maxPopulation < vehicle.totalPopulation ? vehicle.totalPopulation : maxPopulation
    });
    return {
        maxPopulation: maxPopulation,
        vehicles: vehicles
    }
}

function computeVehiclesPopulation(service: IApi, apiResult: initResult) {
    let vehiclesPopulations: any[] = []
    apiResult.vehicles.forEach(vehicle => {
        let totalPopulation = service.sumPlanetsPopulation(vehicle)
        vehiclesPopulations.push({
            ...vehicle,
            totalPopulation: totalPopulation
        })
    })

    return vehiclesPopulations
}

const LargestPopulation = (props: Props) => {
    const { maxPopulation, vehicles } = computeLargetsPopulation(props.apiService, props.apiResult)
    const maxPopulationVehicles = vehicles.filter(vehicle => vehicle.totalPopulation == maxPopulation)

    const Planets = (vehicle: any) => {
        let pilots = props.apiService.getPilotsByUrl(vehicle.pilots)
        let planets = props.apiService.getPilotsPlanetsByUrl(pilots)
        return (
            planets.map(planet => (
                <p key={planet.name}>
                    name : {planet.name}, poplation: {planet.population}
                </p>
            ))
        )
    }

    return (
        <table className='tableContainer'>
            <tbody>
                {maxPopulationVehicles.map(vehicle => (
                    <tr key={vehicle.name} style={{ border: '1px solid' }}>
                        <td>
                            <div>
                                <p>Vehicle name with the largest sum : {vehicle.name}</p>
                            </div>
                            <div>
                                <p>Related home planets and their respective population</p>
                                {Planets(vehicle)}
                            </div>
                            <div>
                                <p>Related pilot names</p>
                                <p> names : </p>
                                {props.apiService.getPilotsByUrl(vehicle.pilots).map(pilot => (
                                    <span key={pilot.name}>
                                        {pilot.name}, &nbsp;
                                    </span>
                                ))}
                            </div>

                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

export default LargestPopulation
