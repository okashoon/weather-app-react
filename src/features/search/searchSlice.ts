import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from '../../app/store';
import { request, gql } from 'graphql-request'

// interface Weather {
//     temperature
// }

type Nullable<T> = T | null;

interface Temperature {
    actual: number,
    feelsLike: number,
    max:number,
    min:number
}

interface Clouds{
    all:number,
    humidity:number,
    visibility:number
}

interface Summary {
    description:string, 
    title:string
}
interface Wind {
    speed:number,
    deg:number
}

interface Weather {
    clouds: Clouds,
    summary: Summary
    temperature: Temperature,
    wind: Wind
}
interface WeatherDetails {
    country?: number,
    weather: Weather
}


interface OptionsState {
    city: string,
    unit: string,
    fetching: boolean,
    weatherDetails: Nullable<WeatherDetails>
}

const initialState: OptionsState = {
    city: '',
    unit: 'metric',
    fetching: false,
    weatherDetails: null
};

export const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        changeCity: (state, action: PayloadAction<string>) => {
            // Redux Toolkit allows us to write "mutating" logic in reducers. It
            // doesn't actually mutate the state because it uses the Immer library,
            // which detects changes to a "draft state" and produces a brand new
            // immutable state based off those changes
            state.city = action.payload;
        },
        changeUnit: (state, action: PayloadAction<string>) => {
            state.unit = action.payload
        },
        requestStarted: (state) => {
            state.fetching = true
        },
        requestFinished: (state) => {
            state.fetching = false
        },
        updateWeatherDetails: (state, action: PayloadAction<WeatherDetails>) => {
            state.weatherDetails = action.payload
        }
    },
});

export const { changeCity, changeUnit, requestStarted, requestFinished, updateWeatherDetails } = searchSlice.actions;

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched
export const changeOptionsAsync = (options: {city:string, unit:string}): AppThunk => dispatch => {
    
    dispatch(requestStarted())
    dispatch(changeCity(options.city))
    dispatch(changeUnit(options.unit))

    //TODO enter country too
    const query = gql`
    {
        getCityByName(name:"${options.city}", config:{units:${options.unit}}) { 
            country
            weather {
                temperature { 
                    actual 
                    feelsLike 
                    min
                    max 
                }
                summary { 
                    title
                    description
                } 
                wind {
                    speed
                    deg 
                }
                clouds { 
                    all
                    visibility
                    humidity 
                }
            }
        }
    }
    `

    request('https://graphql-weather-api.herokuapp.com/', query).then((data) => {
        console.log(data);
        
        dispatch(requestFinished());
        dispatch(updateWeatherDetails(data.getCityByName))
    })

    
};

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
// export const selectCount = (state: RootState) => state.counter.value;

export default searchSlice.reducer;
