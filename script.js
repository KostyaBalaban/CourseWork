class TodoList {
  constructor() {
    this.listsContainer = document.querySelector("[data-lists]");
    this.newListForm = document.querySelector("[data-new-list-form]");
    this.newListInput = document.querySelector("[data-new-list-input]");
    this.deleteListButton = document.querySelector("[data-delete-list-button]");
    this.listDisplayContainer = document.querySelector(
      "[data-list-display-container]"
    );
    this.listTitleElement = document.querySelector("[data-list-title]");
    this.listCountElement = document.querySelector("[data-list-count]");
    this.tasksContainer = document.querySelector("[data-tasks]");
    this.taskTemplate = document.getElementById("task-template");
    this.newTaskForm = document.querySelector("[data-new-task-form]");
    this.newTaskInput = document.querySelector("[data-new-task-input]");
    this.clearCompleteTasksButton = document.querySelector(
      "[data-clear-complete-tasks-button]"
    );

    this.LOCAL_STORAGE_LIST_KEY = "task.lists";
    this.LOCAL_STORAGE_SELECTED_LIST_ID_KEY = "task.selectedListId";
    this.lists =
      JSON.parse(localStorage.getItem(this.LOCAL_STORAGE_LIST_KEY)) || [];
    this.selectedListId = localStorage.getItem(
      this.LOCAL_STORAGE_SELECTED_LIST_ID_KEY
    );

    this.listsContainer.addEventListener(
      "click",
      this.handleListClick.bind(this)
    );
    this.tasksContainer.addEventListener(
      "click",
      this.handleTaskClick.bind(this)
    );
    this.clearCompleteTasksButton.addEventListener(
      "click",
      this.handleClearCompleteTasks.bind(this)
    );
    this.deleteListButton.addEventListener(
      "click",
      this.handleDeleteList.bind(this)
    );
    this.newListForm.addEventListener(
      "submit",
      this.handleNewListFormSubmit.bind(this)
    );
    this.newTaskForm.addEventListener(
      "submit",
      this.handleNewTaskFormSubmit.bind(this)
    );

    this.render();
  }

  save() {
    localStorage.setItem(
      this.LOCAL_STORAGE_LIST_KEY,
      JSON.stringify(this.lists)
    );
    localStorage.setItem(
      this.LOCAL_STORAGE_SELECTED_LIST_ID_KEY,
      this.selectedListId
    );
  }

  render() {
    this.clearElement(this.listsContainer);
    this.renderLists();

    const selectedList = this.lists.find(
      (list) => list.id === this.selectedListId
    );
    if (!this.selectedListId) {
      this.listDisplayContainer.style.display = "none";
    } else {
      this.listDisplayContainer.style.display = "";
      this.listTitleElement.innerText = selectedList.name;
      this.renderTaskCount(selectedList);
      this.clearElement(this.tasksContainer);
      this.renderTasks(selectedList);
    }
  }

  renderTasks(selectedList) {
    selectedList.tasks.forEach((task) => {
      const taskElement = document.importNode(this.taskTemplate.content, true);
      const checkbox = taskElement.querySelector("input");
      checkbox.id = task.id;
      checkbox.checked = task.complete;
      const label = taskElement.querySelector("label");
      label.htmlFor = task.id;
      label.append(task.name);
      this.tasksContainer.appendChild(taskElement);
    });
  }

  renderTaskCount(selectedList) {
    const incompleteTaskCount = selectedList.tasks.filter(
      (task) => !task.complete
    ).length;
    const taskString = incompleteTaskCount === 1 ? "task" : "tasks";
    this.listCountElement.innerText = `${incompleteTaskCount} ${taskString} remaining`;
  }

  renderLists() {
    this.lists.forEach((list) => {
      const listElement = document.createElement("li");
      listElement.dataset.listId = list.id;
      listElement.classList.add("list-name");
      listElement.innerText = list.name;
      if (list.id === this.selectedListId) {
        listElement.classList.add("active-list");
      }
      this.listsContainer.appendChild(listElement);
    });
  }

  clearElement(element) {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }

  handleListClick(event) {
    if (event.target.tagName.toLowerCase() === "li") {
      this.selectedListId = event.target.dataset.listId;
      this.saveAndRender();
    }
  }

  handleTaskClick(event) {
    if (event.target.tagName.toLowerCase() === "input") {
      const selectedList = this.lists.find(
        (list) => list.id === this.selectedListId
      );
      const selectedTask = selectedList.tasks.find(
        (task) => task.id === event.target.id
      );
      selectedTask.complete = event.target.checked;
      this.save();
      this.renderTaskCount(selectedList);
    }
  }

  handleClearCompleteTasks() {
    const selectedList = this.lists.find(
      (list) => list.id === this.selectedListId
    );
    selectedList.tasks = selectedList.tasks.filter((task) => !task.complete);
    this.saveAndRender();
  }

  handleDeleteList() {
    this.lists = this.lists.filter((list) => list.id !== this.selectedListId);
    this.selectedListId = null;
    this.saveAndRender();
  }

  handleNewListFormSubmit(event) {
    event.preventDefault();
    const listName = this.newListInput.value;
    if (!listName) return;
    const list = this.createList(listName);
    this.newListInput.value = null;
    this.lists.push(list);
    this.saveAndRender();
  }

  handleNewTaskFormSubmit(event) {
    event.preventDefault();
    const taskName = this.newTaskInput.value;
    if (!taskName) return;
    const task = this.createTask(taskName);
    this.newTaskInput.value = null;
    const selectedList = this.lists.find(
      (list) => list.id === this.selectedListId
    );
    selectedList.tasks.push(task);
    this.saveAndRender();
  }

  createList(name) {
    return { id: Date.now().toString(), name: name, tasks: [] };
  }

  createTask(name) {
    return { id: Date.now().toString(), name: name, complete: false };
  }

  saveAndRender() {
    this.save();
    this.render();
  }
}

const todoList = new TodoList();
