import React, { ChangeEvent, ReactNode, useState } from 'react';
import  Autocomplete  from '@material-ui/lab/Autocomplete'
import  {Box, FormControl, InputLabel, Select, TextField, withStyles}  from '@material-ui/core'
import { useSelector, useDispatch } from 'react-redux';
import {changeUnit,changeOptionsAsync} from './searchSlice';
import { RootState } from '../../app/store';
import { AutocompleteChangeDetails, AutocompleteChangeReason } from '@material-ui/lab/useAutocomplete';
import "./citySearch.css"
const styles = {
    button: {
        borderRadius: 3,
        border: 0,
        color: 'white',
        height: 48,
        padding: '0 30px',
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    },
};

const WAIT_BEFORE_FETCH:number = 1000

function CitySearch(props: any) {
    const dispatch = useDispatch();
    let fetchTimer:ReturnType<typeof setTimeout>;

    const { city, unit } = useSelector(
        (state: RootState) => state.searchOptions
    )

    const [cities, setCities] = useState([{title:city,name:""}]);
    const handleUnitChange = (event: ChangeEvent<{name?: String; value: unknown}>,child: ReactNode)=>{
        console.log(event.target.value)
        dispatch(changeUnit(event.target.value as string))
        if(city){
            dispatch(changeOptionsAsync({city:city, unit:event.target.value as string}))
        }
    }

    const handleCityChange = (event: ChangeEvent<{}>,value: {name:string, title:string} | null, reason: AutocompleteChangeReason, details?: AutocompleteChangeDetails<{name:string,title:string}>)=>{
        console.log(value)
        if (value){
            dispatch(changeOptionsAsync({city:value.name, unit:unit}))
        }
    }

    const updateCities = (event: any)=>{
        let cityName = event.target.value
        if(!cityName){
            return
        }
        //the api has a maximum requests per second
        clearTimeout(fetchTimer);
        fetchTimer = setTimeout(()=>{
            console.log(cityName)
            fetch(`https://wft-geo-db.p.rapidapi.com/v1/geo/cities?limit=10&namePrefix=${cityName}`, {
                "method": "GET",
                "headers": {
                    "x-rapidapi-key": "f993073904mshed292993491e1dfp1f8fd6jsn607c72cfd78c",
                    "x-rapidapi-host": "wft-geo-db.p.rapidapi.com"
                }
            })
            .then(response => response.json())
            .then(res => {
                if(res.data.length>0){
                    setCities(res.data.map((city:{name:string,country:string})=>({title:`${city.name}, ${city.country}`,name:city.name})))
                } else { //in case the api didnt work, just add the typed name
                    let cities:any = [{title: cityName, name: cityName}]
                    setCities(cities) 
                }
            })
            .catch(err => {
                console.error(err);
                let cities:any = [{title: cityName, name: cityName}]
                setCities(cities) 
            });

        },WAIT_BEFORE_FETCH)
        
    }

    return (
        <Box style={{display:"flex"}}>
            <Autocomplete
                className="city-search"
                options={cities}
                getOptionLabel={(option) => option.title}
                renderInput={(params) => <TextField {...params} />}
                onChange={handleCityChange}
                onInputChange={updateCities}
                getOptionSelected={(option,value)=>option.name===value.name}
            />
            
            <FormControl variant="outlined" className="unit-select">
                <InputLabel >Unit</InputLabel>
                <Select
                    native
                    value={unit}
                    onChange={handleUnitChange}
                    label="Unit"
                >
                    <option value={"metric"}>metric</option>
                    <option value={"imperial"}>imperial</option>
                    <option value={"kelvin"}>kelvin</option>
                </Select>
            </FormControl>
        
        </Box>
    );
}
export default withStyles(styles)(CitySearch);
