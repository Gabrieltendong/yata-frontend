import React, { Component } from 'react';
import RLDD from 'react-list-drag-and-drop/lib/RLDD';

import icon_circle from './assets/images/circle-regular.svg'
import './App.css';
import AddTaks from './components/AddTaks';

import { getAllTask, addTask } from './api'
import TaskItem from './components/TaskItem';

export default class componentName extends Component {
  state = {
    listTask: [],
    memoryListTask: [],
    isVisible: false,
    title: '',
    description: ''
  }

  componentDidMount(){
    this.loadTasks()
  }

  loadTasks = async () => {
    const res = await getAllTask()
    this.setState({
      listTask: res,
      memoryListTask: res
    })
  }

  handleRLDDChange = (newItems) => {
    this.setState({
      listTask: newItems,
      memoryListTask: newItems
    })
  }

  toggleModal = () => {
    this.setState({isVisible: !this.state.isVisible})
  }

  handleAddTask = async () => {
    const { title, description } = this.state
    const data = { title, description }
    const res = addTask(data)
    this.setState({
      title: '',
      description: '',
      listTask:  await getAllTask()
    })
    this.toggleModal()
  }

  handleChange = (e, label) => {
    e.preventDefault();
    if(label == 'title'){
        this.setState({title: e.target.value})
    }
    if(label == 'description'){
      this.setState({description: e.target.value})
    }
  }

  getActiveTask = () => {
    const listActiveTask = this.state.memoryListTask.filter((task) => task.isActive)
    this.setState({listTask: listActiveTask})
  }

  getCompletedTask = () => {
    const listActiveTask = this.state.memoryListTask.filter((task) => !task.isActive)
    this.setState({listTask: listActiveTask})
  }

  handleCompleted = (item) => {
    this.state.listTask.map((task, index) => {
      if(item.id == task.id){
        item.isActive = !item.isActive
        this.forceUpdate()
      }
    })
  }

  renderItem = (item) => {
    return(
      <TaskItem 
        item = {item}
        handleCompleted = {() => this.handleCompleted(item)}
      />
    )
  }

  render() {
    const { isVisible } = this.state
    return (
      <div className="App">
        <AddTaks
          isVisible = {isVisible}
          toggle = {this.toggleModal}
          onChange = {this.handleChange}
          add = {this.handleAddTask}
        />
      {/* --------------- bloc header --------------- */}
      <header className="App-header">
      </header>
      {/* ---------------- bloc body ---------------- */}
      <div className = "App-content">
        <h1 className = "App-content-title">TODO</h1>
        <button 
          className = "App-content-btn"
          onClick = {this.toggleModal}
        >
          <img src = {icon_circle} className = "App-icon-circle" />
          <a className = "App-content-textBtn">Créer une nouvelle tache</a>
        </button>
        <div className = "App-content-card">
          <RLDD
            items={this.state.listTask}
            cssClasses = "App-content-item"
            itemRenderer={this.renderItem}
            onChange={this.handleRLDDChange}
          />
        </div>
        <div className = "App-content-tabs">
          <span className = "App-firstTest-tabs">4 taches restantes</span>
          <a 
            className = "App-content-btnTabs mobile-hide" 
            onClick = {this.loadTasks}
          >Tout</a>
          <a 
            className = "App-content-btnTabs mobile-hide"
            onClick = {this.getActiveTask}
          >Activé</a>
          <a 
            className = "App-content-btnTabs mobile-hide"
            onClick = {this.getCompletedTask}
          >Complété</a>
          <a className = "App-content-btnTabs">Effacer les taches terminées</a>
        </div>
        <div className = "mobile-tabs">
          <a className = "App-content-btnTabs">Tout</a>
          <a className = "App-content-btnTabs">Activé</a>
          <a className = "App-content-btnTabs">Completé</a>
        </div>
      </div>
      <div className = "App-footer">
        <p className = "App-footer-title">Faites glisser et déposer pour réorganiser la liste</p>
      </div>
    </div>
    );
  }
}