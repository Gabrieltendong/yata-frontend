import React, { Component } from 'react';
import Rodal from 'rodal';
import Loader from "react-loader-spinner";
import 'rodal/lib/rodal.css';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import './style.css'
import img_alert from '../../assets/images/alert.png'

class DetailTask extends Component {
    constructor(props){
        super(props)
        console.log('input')
    }
    render() {
        console.log('input')
        const { isVisible, toggle, item } = this.props
        return (
            <div className = "container">
                <Rodal 
                    visible={isVisible} 
                    onClose={toggle}
                    width = {270}
                    height = {300}
                >
                    <div>Detail de la tâche</div>
                    <div className = "content">
                        <h4>Titre de la tâche</h4>
                        <p>{item.title}</p>
                        <h4>Description de la tâche</h4>
                        <p className = "title">{item.description}</p>
                    </div>
                    <button 
                        className = "btn"
                        onClick = {toggle}
                    >
                        Ok
                    </button>
                </Rodal>
            </div>
        );
    }
}

export default DetailTask;