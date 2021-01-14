import React from 'react';
import './App.css';
import CitySearch from './features/search/CitySearch';
import WeatherDetails from './features/weatherDetails/WeatherDetails';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

function App() {
  return (
    <div className="App">
      <AppBar position="absolute">
        <Toolbar style={{display:"flex",justifyContent:"center"}}>
          <CitySearch/>
        </Toolbar>
      </AppBar>
      <WeatherDetails/>
    </div>
  );
}

export default App;
