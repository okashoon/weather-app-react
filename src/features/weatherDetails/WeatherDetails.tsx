import React from 'react';
import { useSelector } from 'react-redux';

import { RootState } from '../../app/store';
import { Card, CardContent, CardHeader, CircularProgress, Grid, makeStyles, Typography } from '@material-ui/core';
import { mdiTemperatureCelsius, mdiTemperatureKelvin, mdiTemperatureFahrenheit} from '@mdi/js';
import {Icon as MdiIcon}  from '@mdi/react';
const useStyles = makeStyles((theme) => ({
    weatherCard: {
      width: "80%",
    },
    container: {
        marginTop: 100,
        display: "flex",
        justifyContent: "center"
    }
}))


function EmptyDetails(){
    const classes = useStyles();
    return (
        <div className={classes.container}>
            <Card className={classes.weatherCard}>
                <CardHeader
                    title={"Type in a city to show weather for"}
                    />
            </Card>
        </div>
    )
}

function Fetching(){
    const classes = useStyles();
    return (
        <div className={classes.container}>
            <CircularProgress />
        </div>
    )
}

export default function WeatherDetails() {
    const classes = useStyles();
    const { city, unit, weatherDetails, fetching } = useSelector(
        (state: RootState) => state.searchOptions
    )
    if (fetching){
        console.log("fetching")
        return <Fetching/>
    }
        
    if(!city || !weatherDetails){
        return <EmptyDetails/>;
    }

    function temperatureIcon(unit:string):any{
        switch (unit){
            case "metric":
                return mdiTemperatureCelsius;
            case "imperial":
                return mdiTemperatureFahrenheit;
            case "kelvin":
                return mdiTemperatureKelvin;
        }    
    }

    return (
        <div className={classes.container}>
            <Card className={classes.weatherCard}>
                <CardHeader
                    title={`${city}`}
                    subheader={`${new Date().toDateString()}`}
                    align="left"
                />
                <CardContent>
                <Grid container  spacing={2}>
                    <Grid item xs={6} container alignItems="flex-start" justify="flex-start" direction="column">
                        <div>
                            <Typography variant="h1" color="textSecondary" component="span">
                                {`${ weatherDetails.weather.temperature.feelsLike}`}
                            </Typography>
                            <MdiIcon path={temperatureIcon(unit)} size={2} style={{position:"absolute"}}/>

                        </div>
                        <Typography style={{marginLeft:"20px"}} variant="h4" component="p" display="block">{`${ weatherDetails.weather.summary.description}`}</Typography>
                    </Grid>
                    <Grid item xs={6} container  alignItems="flex-start"  justify="flex-start" direction="column">
                        <Typography  variant="h6" component="div" display="block" >Clouds: {`${ weatherDetails.weather.clouds.all}`}</Typography>
                        <Typography  variant="h6" component="div" display="block">Humidity: {`${ weatherDetails.weather.clouds.humidity}`} %</Typography>
                        <Typography  variant="h6" component="div" display="block">Visibility: {`${ weatherDetails.weather.clouds.visibility}`}</Typography>
                        <Typography  variant="h6" component="div" display="block">Wind: {`${ weatherDetails.weather.wind.speed} ${unit=="imperial"?"mph":"Km/h"}, ${weatherDetails.weather.wind.deg} Degree`}</Typography>

                    </Grid>
                </Grid>

                </CardContent>
            </Card>
        </div>
    );
}
