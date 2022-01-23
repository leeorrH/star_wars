

export class APIService implements IApi {
    private urls: Set<string> //use for homeworld and pilots urls
    private _allPlanets: Map<string, PlanetAPIResult>
    private _allPilots: Map<string, PilotAPIResult>
    private _vehiclesAPIRes: VehicleAPIResult[]
    private baseUrl = "https://swapi.dev/api/";

    constructor() {
        this.urls = new Set<string>(); //use for homeworld and pilots urls
        this._allPlanets = new Map<string, PlanetAPIResult>();
        this._allPilots = new Map<string, PilotAPIResult>();
        this._vehiclesAPIRes = [];
    }

    public async initializeServiceData(): Promise<initResult> {
        await this.getAllVehicles();
        await this.getVehiclesPilots();
        await this.getAllPilotsPlanets();

        return ({
            planets: this.allPlanets,
            pilots: this.allPilots,
            vehicles: this.vehiclesAPIRes
        } as unknown as initResult)
    }

    /********* GENERAL */

    private getEntityWithUrl(url: string): Promise<any> {
        return this.fetchData(url)
    }

    public sumPlanetsPopulation(vehicle : VehicleAPIResult): number {
        let sum: number = 0;
        let pilots = this.getPilotsByUrl(vehicle.pilots)
        let pilotsPlanets = this.getPilotsPlanetsByUrl(pilots)
        pilotsPlanets.forEach(planet => {
            sum += planet.population
        });

        return sum
    }

    public getPilotsByUrl(pilotsUrls : string []) {
        let pilots: PilotAPIResult[] = []
        pilotsUrls.forEach((url: string) => {
            let pilot = this._allPilots.get(url)
            pilot && pilots.push(pilot)
        });
        return pilots
    }

    public getPilotsPlanetsByUrl(pilots: PilotAPIResult[]) {
        let planets: PlanetAPIResult[] = []
        pilots.forEach((pilot: PilotAPIResult) => {
            let planet = this.allPlanets.get(pilot.planetUrl)
            planet && planets.push(planet)
        });
        return planets
    }

    private fetchData(endPoint: string) {
        return fetch(endPoint.includes(this.baseUrl) ? endPoint : `${this.baseUrl}/${endPoint}`)
            .then(res => {
                if (res.ok) {
                    return res.json()
                }
                else {
                    console.error(res.statusText);
                    return false
                }
            });
    }

    public get allPlanets(): Map<string, PlanetAPIResult> {
        return this._allPlanets;
    }

    public get allPilots(): Map<string, PilotAPIResult> {
        return this._allPilots;
    }

    public get vehiclesAPIRes(): VehicleAPIResult[] {
        return this._vehiclesAPIRes;
    }
    /******** VEHICLES */
    public getVehicles(pageNumber: number): Promise<any> {
        return this.fetchData(`vehicles/?page=${pageNumber}`)
    }

    private async getAllVehicles() {
        let pageNumber: number = 1;
        let promises: Promise<any>[] = [];
        do {
            promises.push(this.getVehicles(pageNumber));
            pageNumber++;
        }
        while (pageNumber < 5)

        let apiResults = await Promise.all(promises);
        apiResults.forEach(({ results }) => {
            this.extractVehiclesWithPilots(results);
        })
    }

    private extractVehiclesWithPilots(vehicles: any[]) {
        vehicles.forEach(vehicle => {
            if (vehicle.pilots.length) {
                this.vehiclesAPIRes.push({
                    name: vehicle.name as string,
                    pilots: vehicle.pilots as string[],
                })
                vehicle.pilots.forEach((pilotUrl: string) => this.urls.add(pilotUrl));
            }
        });
    }

    /********* PILOTS */

    private async getVehiclesPilots(): Promise<any> {
        let promises: Promise<any>[] = []
        this.urls.forEach(url => promises.push(this.getEntityWithUrl(url)));
        let pilotsRes = await Promise.all(promises);
        this.urls.clear();
        pilotsRes.forEach(pilot => {
            this.allPilots.set(pilot.url, {
                name: pilot.name,
                planetUrl: pilot.homeworld
            } as PilotAPIResult)
            this.urls.add(pilot.homeworld)
        });
    }

    /*********** Planets */
    private async getAllPilotsPlanets(): Promise<any> {
        let promises: Promise<any>[] = []
        this.urls.forEach(url => promises.push(this.getEntityWithUrl(url)));
        let planetsRes = await Promise.all(promises);
        this.urls.clear();
        planetsRes.forEach(planet => {
            this.allPlanets.set(planet.url, {
                name: planet.name,
                planetUrl: planet.url,
                population: +planet.population
            } as PlanetAPIResult)
        });
    }

    public async searchWithParams(searchFiled : SEARCH_FIELDS, value: string) : Promise<any>{
        const url = this.baseUrl + `${searchFiled}/?search=${value}`;
        return this.fetchData(url);
    }


}

export const enum SEARCH_FIELDS{
    PEOPLE = 'people',
    FILMS = 'films',
    STARSHIPS = 'starsships',
    VEHICLES = 'vehicles',
    SPECIES = 'species',
    PLANETS = 'planets'
}

export interface IApi {
    sumPlanetsPopulation(vehicle : VehicleAPIResult): number
    initializeServiceData(): Promise<initResult>
    getPilotsByUrl(pilotsUrls : string[]) : PilotAPIResult[]
    getPilotsPlanetsByUrl(pilots: PilotAPIResult[]) : PlanetAPIResult[]
    searchWithParams(searchFiled : SEARCH_FIELDS, value: string) : Promise<any>
}

export interface PilotAPIResult {
    name: string;
    planetUrl: string;
}


export interface VehicleAPIResult {
    name: string;
    pilots: string[];
}

export interface PlanetAPIResult {
    planetUrl: string;
    name: string;
    population: number;
}

export interface initResult {
    pilots: Map<string, PilotAPIResult>;
    planents: Map<string, PlanetAPIResult>;
    vehicles: VehicleAPIResult[];
}





