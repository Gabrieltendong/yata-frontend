import React, { Component } from 'react';
import RLDD from 'react-list-drag-and-drop/lib/RLDD';

import icon_circle from './assets/images/circle-regular.svg'
import './App.css';
import AddTaks from './components/AddTaks';

import { getAllTask, addTask, removeTask, removeAllTask, updateTask } from './api'
import TaskItem from './components/TaskItem';

export default class componentName extends Component {
  state = {
    listTask: [],
    memoryListTask: [],
    selectedTabs: '',
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
      memoryListTask: res,
      selectedTabs: 'all'
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
    this.setState({
      listTask: listActiveTask,
      selectedTabs: 'active'
    })
  }

  getCompletedTask = () => {
    const listActiveTask = this.state.memoryListTask.filter((task) => !task.isActive)
    this.setState({
      listTask: listActiveTask,
      selectedTabs: 'completed'
    })
  }

  handleCompleted = async (item) => {
    const { selectedTabs } = this.state
    this.state.listTask.map(async (task, index) => {
      if(item.id == task.id){
        item.isActive = !item.isActive
        const res = await updateTask(item._id, item)
        console.log(res)
        if(selectedTabs == 'active'){
          this.getActiveTask()
        }
        else if(selectedTabs == 'completed'){
          this.getCompletedTask()
        }
        this.forceUpdate()
      }
    })
  }

  handleRemoveTask = async (taskId) => {
    const res = await removeTask(taskId)
    if(res.status == 200) this.loadTasks()
  }

  handleRemoveAllTask = async () => {
    const res = await removeAllTask()
    if(res.status == 200) this.loadTasks()
  } 

  renderItem = (item, index) => {
    return(
      <TaskItem 
        key = {index}
        item = {item}
        handleCompleted = {() => this.handleCompleted(item)}
        handleRemoveTask = {() => this.handleRemoveTask(item._id)}
      />
    )
  }

  render() {
    const { isVisible, selectedTabs, memoryListTask, title, description } = this.state
    const numActiveTask = memoryListTask.filter((task) => task.isActive).length
    console.log('data', memoryListTask)
    return (
      <div className="App">
        <AddTaks
          title = {title}
          description = {description}
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
          <span className = "App-firstTest-tabs">{numActiveTask} taches restantes</span>
          <a 
            className = {`App-content-btnTabs mobile-hide ${selectedTabs == 'all' && 'selectedTabs'}`} 
            onClick = {this.loadTasks}
          >Tout</a>
          <a 
            className = {`App-content-btnTabs mobile-hide ${selectedTabs == 'active' && 'selectedTabs'}`}
            onClick = {this.getActiveTask}
          >Activé</a>
          <a 
            className = {`App-content-btnTabs mobile-hide ${selectedTabs == 'completed' && 'selectedTabs'}`}
            onClick = {this.getCompletedTask}
          >Complété</a>
          <a 
            className = "App-content-btnTabs"
            onClick = {this.handleRemoveAllTask}
          >Effacer les taches terminées</a>
        </div>
        <div className = "mobile-tabs">
          <a 
            className = {`App-content-btnTabs ${selectedTabs == 'all' && 'selectedTabs'}`}
            onClick = {this.loadTasks}
          >Tout</a>
          <a 
            className = {`App-content-btnTabs ${selectedTabs == 'active' && 'selectedTabs'}`}
            onClick = {this.getActiveTask}
          >Activé</a>
          <a 
            className = {`App-content-btnTabs ${selectedTabs == 'completed' && 'selectedTabs'}`}
            onClick = {this.getCompletedTask}
          >Completé</a>
        </div>
      </div>
      <div className = "App-footer">
        <p className = "App-footer-title">Faites glisser et déposer pour réorganiser la liste</p>
      </div>
    </div>
    );
  }
}