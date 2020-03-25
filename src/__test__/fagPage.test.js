import React from 'react';
import ReactDOM from 'react-dom'
import FaqPage from '../info/FaqPage'

it("render without crashing", ()=>{
    const Grid = document.createElement("Grid");
    ReactDOM.render(<FaqPage></FaqPage>,Grid)
})