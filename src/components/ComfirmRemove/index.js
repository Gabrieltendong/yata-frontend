import React, { Component } from 'react';
import Rodal from 'rodal';
import Loader from "react-loader-spinner";
import 'rodal/lib/rodal.css';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import './style.css'
import img_alert from '../../assets/images/alert.png'

class ComfirmRemove extends Component {
    constructor(props){
        super(props)
        console.log('input')
    }
    render() {
        console.log('input')
        const { isVisible, toggle, handleRemove } = this.props
        return (
            <div className = "container">
                <Rodal 
                    visible={isVisible} 
                    onClose={toggle}
                    width = {270}
                    height = {200}
                >
                    <div>Supprimer</div>
                    <div className = "content">
                        <img src = {img_alert} className = "image_alert"/>
                        <p className = "title">Souhaitez vous vraiment supprimer toutes les taches?</p>
                    </div>
                    <div>
                        <button 
                            className = "btn btn-outline"
                            onClick = {toggle}
                        >
                            Non
                        </button>
                        <button 
                            className = "btn"
                            onClick = {handleRemove}
                        >
                            Oui
                        </button>
                    </div>
                </Rodal>
            </div>
        );
    }
}

export default ComfirmRemove;