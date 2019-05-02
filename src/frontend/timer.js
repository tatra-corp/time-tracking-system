function getTimeDiff(date1, date2) {
  const diff = new Date(date2.getTime() - date1.getTime());
  return `${(`0${diff.getUTCHours()}`).slice(-2)}:${
    (`0${diff.getMinutes()}`).slice(-2)}:${
    (`0${diff.getSeconds()}`).slice(-2)}`
}

export default class Timer extends React.Component {
  constructor () {
    super()
    this.handleSubmit = this.handleSubmit.bind(this) // this is for 'this' working in this context.
    this.updateTimer = this.updateTimer.bind(this) // this is for 'this' working in this context.
    this.handleInputChange = this.handleInputChange.bind(this) // this is for 'this' working in this context.
    this.handleUserChange = this.handleUserChange.bind(this) // this is for 'this' working in this context.
    this.handleProjectChange = this.handleProjectChange.bind(this) // this is for 'this' working in this context.
    // is this clear?
    this.state = {
      interval: null,
      play: false,
      username: 'default',
      project: 'default',
      task: 'default',
      timer: '00:00:00',
      users: [],
      projects: [],
      tasks: []
    }
  }

  downloadUsers () {
    const request = new XMLHttpRequest()
    const url = '/users_list'
    request.open('GET', url)
    request.onreadystatechange = () => {
      if (request.readyState === 4 && request.status === 200) {
        this.setState({
          users: JSON.parse(request.responseText)
        })
      }
    }
    request.send()
  }

  downloadProjects () {
    const request = new XMLHttpRequest()
    const url = `/projects_list?user=${this.state.username}`
    request.open('GET', url)
    request.onreadystatechange = () => {
      if (request.readyState === 4 && request.status === 200) {
        this.setState({
          projects: JSON.parse(request.responseText)
        })
      }
    }
    request.send()
  }

  downloadTasks () {
    const request = new XMLHttpRequest()
    const url = `/tasks_list?project=${this.state.project}`
    request.open('GET', url)
    request.onreadystatechange = () => {
      if (request.readyState === 4 && request.status === 200) {
        this.setState({
          tasks: JSON.parse(request.responseText)
        })
      }
    }
    request.send()
  }

  componentDidMount () {
    this.downloadUsers()
  }

  static validateForm () {
    return true
  }

  sendRecord (event, callback) {
    const message = new FormData()
    message.append('username', this.state.username)
    message.append('project', this.state.project)
    message.append('task', this.state.task)
    message.append('action', this.state.play ? 'start' : 'stop')
    if (!this.state.play) message.append('stop_time', (new Date()).getTime() / 1000)
    message.append('start_time', this.state.start.getTime() / 1000)

    const Http = new XMLHttpRequest()
    const url = '/records'
    Http.open('POST', url)
    Http.send(message)
    if (callback) callback()
  };

  handleSubmit (event) {
    event.preventDefault()
    if (Timer.validateForm()) {
      if (!this.state.interval) {
        this.setState({
          play: true,
          start: new Date(),
          interval: setInterval(this.updateTimer, 1000)
        }, () => {
          this.sendRecord(event)
        })
      } else {
        this.setState({
          play: false
        }, () => {
          this.sendRecord(event,
            () => {
              this.setState({
                interval: null,
                timer: '00:00:00'
              })
            })
        })
        clearInterval(this.state.interval)
      }
    }
  }

  handleUserChange (event) {
    this.setState({
      [event.target.name]: event.target.value
    }, () => {this.downloadProjects()})

  }

  handleProjectChange (event) {
    this.setState({
      [event.target.name]: event.target.value
    }, () => {
      this.downloadTasks()
      console.log(this.state)
    })
  }

  handleInputChange (event) {
    const target = event.target
    const name = target.name
    const value = target.value

    this.setState({
      [name]: value
    })
  }

  updateTimer () {
    this.setState({
      timer: getTimeDiff(this.state.start, new Date())
    })
  }

  render () { // we should add change handler for every field to keep internal state of HTML form and React component
    // consistent. But for now it works fine.
    return (
      <form id="timer" className="pane" name="timer" onSubmit={this.handleSubmit}>
        <label htmlFor="username">Your name:</label>
        <select id="username" name="username" value={this.state.username} disabled={this.state.play} required
                onChange={this.handleUserChange}>
          <option hidden disabled selected value="default"> -- select an option --</option>
          {this.state.users.map((username) => {
            return (<option value={username}>{username}</option>)
          })}
        </select>

        <input id="button" className="button" type="image" src={this.state.play ? 'img/stop.jpg' : 'img/play.png'}
               alt="Submit"/>

        <div id="time"> {this.state.timer} </div>


        <label htmlFor="project">Project title:</label>
        <select id="project" name="project" value={this.state.project} disabled={this.state.play} required
                onChange={this.handleProjectChange}>
          <option hidden disabled selected value="default"> -- select an option --</option>
          {this.state.projects.map((project) => {
            return (<option value={project}>{project}</option>)
          })}
        </select>

        <label htmlFor="task">Task name:</label>
        <select id="task" name="task" value={this.state.task} disabled={this.state.play} required
                onChange={this.handleInputChange}>
          <option hidden disabled selected value="default"> -- select an option --</option>
          {this.state.tasks.map((task) => {
            return (<option value={task}>{task}</option>)
          })}
        </select>
      </form>)
  }
}
