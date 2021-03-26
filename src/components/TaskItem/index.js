import React, { Component } from 'react';

import icon_close from '../../assets/images/icon-cross.svg'
import icon_check from '../../assets/images/icon-check.svg'
import '../../App.css'

class TaskItem extends Component {

    render() {
        const { item, handleCompleted, handleRemoveTask } = this.props
        console.log('item', item)
        return (
            <div  className = "menuItem">
                <button 
                    className = {item.isActive?"btnRadio":"btn-gradient"}
                    onClick = {handleCompleted}
                >
                    <img src = {icon_check} className = "icon-check" />
                </button>
                <span className = {`labelMenuItem ${!item.isActive && 'line-through'}`}>{item.title}</span>
                <button 
                    className = "btnClose"
                    onClick = {handleRemoveTask}
                >
                    <img src = {icon_close} className = "icon-close" />
                </button>
            </div>
        );
    }
}

export default TaskItem;