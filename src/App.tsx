import { useEffect } from 'react';
//import { StarWarApi } from './API/StarWarsAPI';
import {IApi} from './API/APIService'
import { useFetch } from './API/customHooks/useFetchSWAPI';
import LargestPopulation from './API/components/LargestPopulation/LargestPopulation';
import PopulationGraph from './API/components/PopulationGraph/PopulationGraph';

interface IProps {
  api : IApi;
}

function App({api}:IProps) {
  const {data, isLoading}  = useFetch(api)
    //move to custom hook as in the react tips file 
    //move that logic up as const [data, isLoad] = useCustomFetch() and dependencies as [isLoad]
    //generate the table - using the sum function in the class passed as dependencie 
    //generate the css flat graph 
  useEffect(() => {
  }, [data])
  return (
    isLoading ? <h1>Loading...</h1> : 
     <div className="App">
     { data ? 
     <>
      <LargestPopulation
      apiResult={data} 
      apiService={api}/>
      <PopulationGraph 
        displayPlanets={['Tatooine', 'Alderaan', 'Naboo', 'Bespin', 'Endor']}
        service={api}
      />
     </>
      : 
      <div>
        error ocured
      </div>
     }
    </div> 
  );
}

export default App;
