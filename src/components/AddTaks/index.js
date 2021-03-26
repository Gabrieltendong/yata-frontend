import React, { Component } from 'react';
import Rodal from 'rodal';
import Loader from "react-loader-spinner";
import 'rodal/lib/rodal.css';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import './style.css'

class AddTaks extends Component {
    constructor(props){
        super(props)
        console.log('input')
    }
    render() {
        console.log('input')
        const { isVisible, toggle, add, onChange, title, description } = this.props
        return (
            <div className = "container">
                <Rodal 
                    visible={isVisible} 
                    onClose={toggle}
                    width = {270}
                    height = {320}
                >
                    <div>Créer une nouvelle tache</div>
                    <div>
                        <p className = "label">Titre</p>
                        <input type="text"
                            value = {title}
                            className = "input-title"
                            onChange = {(e) => onChange(e, 'title')}
                        />
                        <p className = "label">Description</p>
                        <textarea
                            value = {description}
                            className = "input-textArea" 
                            onChange = {(e) => onChange(e, 'description')}
                        />
                    </div>
                    <button 
                        className = "btn"
                        onClick = {add}
                    >
                        Ajouter
                    </button>
                </Rodal>
            </div>
        );
    }
}

export default AddTaks;