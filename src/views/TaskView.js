import taskCreator from './task.js';
import task from './task.js';

const CREATE_TASK = 'create-task';
const UPDATE_TASK = 'update-task';
const DELETE_TASK = 'delete-task';
const TOGGLE_TASK = 'toggle-task';

export default class TaskView {
  constructor({ model }) {
    this.creator = taskCreator; // creates elements
    this.model = model;
    this.model.register(this);
  }

  updateTask(payload) {
    let taskElement = document.getElementById(`task-${payload.id}`);
    let taskData = this.model.get(payload.id);
    let newTaskElement = this.creator.content({
      id: taskData.id,
      title: taskData.title,
      description: taskData.description,
      dataFor: taskData.belongsTo
    });
    let parentNode = taskElement.parentNode;
    let newParent = document.getElementById(taskData.belongsTo);

    parentNode.removeChild(taskElement);
    newParent.appendChild(newTaskElement);
  }

  createTask(payload) {
    let task = this.model.get(payload.id);
    let taskElement = this.creator.content({
      id: task.id,
      title: task.title,
      description: task.description,
      dataFor: task.dataFor
    });

    let parentNode = document.getElementById(payload.belongsTo);

    parentNode.appendChild(taskElement);
  }

  deleteTask(payload) {
    let taskElement = document.getElementById(`task-${payload.id}`);
    let parentNode = taskElement.parentNode;

    if (taskElement) {
      parentNode.removeChild(taskElement);
    }
  }

  toggleTask(payload) {
    let taskElement = document.getElementById(`task-${payload.id}`);
    let parentNode = taskElement.parentNode;
    let taskData = this.model.get(payload.id);
    let newElement = null;

    if (!taskElement) {
      return false;
    }

    let { title, description, belongsTo } = taskData;
    let { type } = taskElement.dataset;
    let { id } = payload;

    if (type === 'form') {
      newElement = this.creator.content({
        id,
        title,
        description,
        dataFor: belongsTo
      });
    } else {
      newElement = this.creator.editForm({
        id,
        title,
        description,
        dataFor: belongsTo
      });
    }

    parentNode.replaceChild(newElement, taskElement);
  }

  update(msg) {
    switch (msg.action) {
      case CREATE_TASK:
        this.createTask(msg.payload);
        break;
      case UPDATE_TASK:
        this.updateTask(msg.payload);
        break;
      case DELETE_TASK:
        this.deleteTask(msg.payload);
        break;
      case TOGGLE_TASK:
        this.toggleTask(msg.payload);
    }
  }
}
