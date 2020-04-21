import React from 'react';
import io from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

class App extends React.Component {

  state = {
    tasks: [],
    taskName: '',
  }

  componentDidMount() {
    this.socket = io('http://localhost:8000');
    this.socket.on('addTask', task => {
      this.addTask(task);
    });
    this.socket.on('removeTask', task => {
      this.removeTask(task);
    });
    this.socket.on('updateData', (updateData) => {
      this.updateTasks(updateData)
    });
  }

  removeTask = (removedTask) => {
    this.setState({
      tasks:
        this.state.tasks.filter(task => task.id !== removedTask)
    });
  };

  notyfyRemoveTask = (task) => {
    this.socket.emit('removeTask', task);
  };

  handleDeleteTask = (task) => {
    this.notyfyRemoveTask(task);
    this.removeTask(task);
  }

  submitForm = (event) => {
    event.preventDefault();
    const taskName = { name: this.state.taskName, id: uuidv4() };
    this.addTask(taskName);
    this.socket.emit('addTask', taskName);
  };

  addTask = (task) => {
    this.setState({
      tasks: [...this.state.tasks, task],
    })
  };

  updateTasks = (updateData) => {
    this.setState({ tasks: updateData });
  }

  render() {
    const { tasks, taskName } = this.state;
    return (
      <div className="App">

        <header>
          <h1>ToDoList.app</h1>
        </header>

        <section className="tasks-section" id="tasks-section">
          <h2>Tasks</h2>

          <ul className="tasks-section__list" id="tasks-list">
            {tasks.map(task => (
              <li key={task.id} className="task">
                {task.name}
                <button className="btn btn--red"
                  onClick={() => this.handleDeleteTask(task.id)}>
                  Remove
                </button>
              </li>
            ))}
          </ul>

          <form id="add-task-form">
            <input
              className="text-input"
              autoComplete="off"
              type="text"
              placeholder="Type your description"
              id="task-name"
              value={taskName}
              onChange={(event) => this.setState({ taskName: event.target.value })}
            />
            <button className="btn" type="submit" onClick={event => this.submitForm(event)}>Add</button>
          </form>
        </section>
      </div>
    );
  };

};

export default App;