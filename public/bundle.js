function getTimeDiff (date1, date2) {
  const diff = new Date(date2.getTime() - date1.getTime())
  return `${(`0${diff.getUTCHours()}`).slice(-2)}:${
    (`0${diff.getMinutes()}`).slice(-2)}:${
    (`0${diff.getSeconds()}`).slice(-2)}`
}

class Timer extends React.Component {
  constructor () {
    super()
    this.handleSubmit = this.handleSubmit.bind(this) // this is for 'this' working in this context.
    this.updateTimer = this.updateTimer.bind(this) // this is for 'this' working in this context.
    this.handleInputChange = this.handleInputChange.bind(this) // this is for 'this' working in this context.
    // is this clear?
    this.state = {
      interval: null,
      play: false,
      username: '',
      project_name: '',
      task_name: '',
      timer: '00:00:00'
    }
  }

  validateForm () {
    return true
  }

  sendRecord (event, callback) {
    const message = new FormData()
    const data = event.target
    message.append('username', this.state.username)
    message.append('project_name', this.state.project_name)
    message.append('task_name', this.state.task_name)
    message.append('action', this.state.play ? 'start' : 'stop')
    if (!this.state.play) message.append('stop_time', (new Date()).getTime() / 1000)
    message.append('start_time', this.state.start.getTime() / 1000)

    const Http = new XMLHttpRequest()
    const url = '/records'
    Http.open('POST', url)
    Http.send(message)
    callback()
  };

  handleSubmit (event) {
    event.preventDefault()
    if (this.validateForm()) {
      if (!this.state.interval) {
        this.setState({
          play: true,
          start: new Date(),
          interval: setInterval(this.updateTimer, 1000)
        }, () => this.sendRecord(event))
      } else {
        this.setState({
          play: false
        }, () => this.sendRecord(event,
          () => {this.setState({
            interval: null,
            timer: '00:00:00'
          })}))
        clearInterval(this.state.interval)
      }
    }
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
    return (<form id="timer" className="pane" name="timer" onSubmit={this.handleSubmit}>
      <label htmlFor="username">Your name:</label>
      <input type="text" id="username" name="username" value={this.state.username} minLength="5" required
             readOnly={this.state.play} onChange={this.handleInputChange}/>

      <input id="button" className="button" type="image" src={this.state.play ? 'img/stop.jpg' : 'img/play.png'}
             alt="Submit"/>

      <div id="time"> {this.state.timer} </div>

      <label htmlFor="project_name">Project title:</label>
      <input type="text" id="project_name" name="project_name" value={this.state.project_name} minLength="3" required
             readOnly={this.state.play} onChange={this.handleInputChange}/>

      <label htmlFor="task_name">Task name:</label>
      <input type="text" id="task_name" name="task_name" value={this.state.task_name} minLength="5" required
             readOnly={this.state.play} onChange={this.handleInputChange}/>
    </form>)
  };
}

class Record extends React.Component {

  updateTime () {
    this.setState({
      stop: new Date()
    })
  }

  constructor (props) {
    super(props)
    this.state = {}
    if (this.props.stop === undefined) {
      this.state.stop = new Date()
      this.updateTime = this.updateTime.bind(this)
      setInterval(this.updateTime, 1000)
    } else
      this.state.stop = this.props.stop
  }

  render () {
    return (<tr className="table_record">
      <td className="table_time">{getTimeDiff(this.props.start, this.state.stop)}</td>
      <td className="table_user">{this.props.user}</td>
      <td className="table_project">{this.props.project}</td>
      <td className="table_task">{this.props.task}</td>
    </tr>)
  }
}

class RecordsTable extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      records: []
    }
    this.getMoreRecords = this.getMoreRecords.bind(this) // this is for 'this' working in this context.
  }

  getRecords (offset, limit) {
    const Http = new XMLHttpRequest()
    const url = `/records?offset=${offset}&limit=${limit}`
    Http.open('GET', url)
    Http.send()
    Http.onload = () => {
      if (Http.status === 200) {
        const records = JSON.parse(Http.responseText)
        this.setState((state) => {
          return {
            records: [...state.records, ...records]
          }
        })
      } else {
        console.error(`Muhaha, I lied, I will log into console till I die!\nResponse status: ${Http.status}`)
      }
    }
  }

  getMoreRecords () {
    this.getRecords(this.state.records.length, 10)
  }

  componentDidMount () {
    this.getMoreRecords()
  }

  render () {
    return (<div id="records_table">
      <table style={{ 'width': '100%' }}>
        <tbody>
        <tr className="table_header">
          <th>Time</th>
          <th>Username</th>
          <th>Project</th>
          <th>Task</th>
        </tr>
        {
          this.state.records.map((record) => {
            return (
              <Record key={record.id} user={record.student} start={new Date(record.start)}
                      stop={record.stop ? new Date(record.stop) : undefined}
                      project={record.project} task={record.task}/>)
          })
        }
        </tbody>
      </table>
      <div id="load-more">
        <button onClick={this.getMoreRecords}>
          Load more
        </button>
      </div>
    </div>)
  }
}

try {
  ReactDOM.render(<div className="wholesite">
    <Timer/>
    <RecordsTable initialLength={10}/>
  </div>, document.getElementById('root'))
} catch (e) {
  console.error(e)
}
