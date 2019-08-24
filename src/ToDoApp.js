import ID from './utils/ID.js';
import Bucket from './bucket.js';
import createElement from './utils/createElement.js';
import removeChildrenNodes from './utils/removeChildrenNodes.js';

export default class ToDoApp {
  constructor() {
    this.buckets = [];
    this.container = createElement('div', { class: 'todo', id: 'todo' });

    this.container.addEventListener('dragover', (e) => {
      this.handleDragOver(e);
    });

    this.container.addEventListener('drop', (e) => {
      this.handleDrop(e);
    });

  }

  handleDragOver(e) {
    e.preventDefault(); 
  }
  
  handleDrop(e) {
    if (!e.target.classList.contains('dropzone')) {
      return;
    }

    let { target } = e; 
    let { buckets } = this; 
    let data = JSON.parse(e.dataTransfer.getData("application/data"));
    
    let draggedElement = document.getElementById(`task-${data.id}`);
    let oldBucketId = data.dataFor;
    let newBucketId = target.dataset.for;

    let oldBucket = buckets.find((bucket) => oldBucketId === bucket.id);

    let task = oldBucket.getTask(data.id);
    oldBucket.removeTask(data.id);

    let newBucket = buckets.find((bucket) => newBucketId === bucket.id);

    newBucket.addTask(Object.assign(data, { dataFor: newBucketId}));
    draggedElement.dataset.for = newBucketId;

    target.appendChild(draggedElement);
  }
  
  createBucket() {
    let { buckets } = this;
    let bucket = new Bucket({ title: ''});

    buckets.push(bucket);

    return bucket;
  }

  deleteBucket(id) {
    this.buckets = this.buckets.filter((bucket) => 
      bucket.id !== id
    );

    return this.buckets;
  }

  renderBuckets() {
    let { buckets, container } = this;
    let fragment = document.createDocumentFragment();

    buckets.forEach((bucket) => {
      fragment.appendChild(bucket.element);
    });

    removeChildrenNodes(container);
    container.appendChild(fragment);
  }
}
