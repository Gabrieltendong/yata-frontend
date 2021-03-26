import React, { Component } from 'react';
import RLDD from 'react-list-drag-and-drop/lib/RLDD';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import icon_circle from './assets/images/circle-regular.svg'
import './App.css';
import AddTaks from './components/AddTaks'; 
import { getAllTask, addTask, removeTask, removeAllTask, updateTask } from './api'
import TaskItem from './components/TaskItem';
import ComfirmRemove from './components/ComfirmRemove';
import DetailTask from './components/DetailTask';

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export default class componentName extends Component {
  state = {
    listTask: [],
    memoryListTask: [],
    selectedTabs: '',
    isVisible: false,
    title: '',
    description: '',
    detailTask: '',
    isVisibleDelete: false,
    isVisibleDetail: false
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

  toggleModalDelete = () => {
    this.setState({isVisibleDelete: !this.state.isVisibleDelete})
  }

  toggleModalDetail = (item) => {
    console.log('data', item)
    if(item){
      this.setState({
        isVisibleDetail: !this.state.isVisibleDetail,
        detailTask: item
      })
    }else{
      this.setState({isVisibleDetail: !this.state.isVisibleDetail})
    }
  }

  handleAddTask = async () => {
    const { title, description } = this.state
    const data = { title, description }
    const res = await addTask(data)
    this.setState({
      title: '',
      description: '',
    })
    this.loadTasks()
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
    this.toggleModalDelete()
  } 

  renderItem = (item, index) => {
    return(
      <TaskItem
        item = {item}
        handleCompleted = {() => this.handleCompleted(item)}
        handleRemoveTask = {() => this.handleRemoveTask(item._id)}
      />
    )
  }

  getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: "none",
    // change background colour if dragging
    background: isDragging ? "lightgreen" : "white",
  
    // styles we need to apply on draggables
    ...draggableStyle
  });
  
  getListStyle = isDraggingOver => ({
    background: isDraggingOver ? "lightblue" : "white",
  });

  onDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const listTask = reorder(
      this.state.listTask,
      result.source.index,
      result.destination.index
    );

    this.setState({
      listTask
    });
  }

  render() {
    const { isVisible,
            isVisibleDelete, 
            selectedTabs, 
            memoryListTask, 
            title, description, 
            detailTask, isVisibleDetail } = this.state
    const numActiveTask = memoryListTask.filter((task) => task.isActive).length
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
        <ComfirmRemove
          isVisible = {isVisibleDelete}
          toggle = {this.toggleModalDelete}
          handleRemove = {this.handleRemoveAllTask}
        />
        <DetailTask 
           isVisible = {isVisibleDetail}
           toggle = {this.toggleModalDetail}
           item = {detailTask}
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
          <a className = "App-content-textBtn">Créer une nouvelle tâche</a>
        </button>
        <div className = "App-content-card">
          <DragDropContext onDragEnd={this.onDragEnd}>
            <Droppable droppableId="droppable">
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={this.getListStyle(snapshot.isDraggingOver)}
                >
                  {this.state.listTask.map((item, index) => (
                    <Draggable key={item._id} draggableId={item._id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={this.getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style
                          )}
                        >
                          <TaskItem
                            item = {item}
                            handleCompleted = {() => this.handleCompleted(item)}
                            handleRemoveTask = {() => this.handleRemoveTask(item._id)}
                            handleShowDetail = {this.toggleModalDetail}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
        <div className = "App-content-tabs">
          <span className = "App-firstTest-tabs">{numActiveTask} Tâche(s) restante(s)</span>
          <a 
            className = {`App-content-btnTabs mobile-hide ${selectedTabs == 'all' && 'selectedTabs'}`} 
            onClick = {this.loadTasks}
          >Toute(s)</a>
          <a 
            className = {`App-content-btnTabs mobile-hide ${selectedTabs == 'active' && 'selectedTabs'}`}
            onClick = {this.getActiveTask}
          >Active(s)</a>
          <a 
            className = {`App-content-btnTabs mobile-hide ${selectedTabs == 'completed' && 'selectedTabs'}`}
            onClick = {this.getCompletedTask}
          >Complétée(s)</a>
          <a 
            className = "App-content-btnTabs"
            onClick = {this.toggleModalDelete}
          >Effacer les tâches terminées</a>
        </div>
        <div className = "mobile-tabs">
          <a 
            className = {`App-content-btnTabs ${selectedTabs == 'all' && 'selectedTabs'}`}
            onClick = {this.loadTasks}
          >Toute(s)</a>
          <a 
            className = {`App-content-btnTabs ${selectedTabs == 'active' && 'selectedTabs'}`}
            onClick = {this.getActiveTask}
          >Active(s)</a>
          <a 
            className = {`App-content-btnTabs ${selectedTabs == 'completed' && 'selectedTabs'}`}
            onClick = {this.getCompletedTask}
          >Completée(s)</a>
        </div>
      </div>
      <div className = "App-footer">
        <p className = "App-footer-title">Faites glisser et déposer pour réorganiser la liste</p>
      </div>
    </div>
    );
  }
}