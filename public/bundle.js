function getTimeDiff (date1, date2) {
  const diff = new Date(date2.getTime() - date1.getTime())
  return `${(`0${diff.getUTCHours()}`).slice(-2)}:${
    (`0${diff.getMinutes()}`).slice(-2)}:${
    (`0${diff.getSeconds()}`).slice(-2)}`
}

class Timer extends React.Component {
  constructor () {
    super()
    this.sendRecord = this.sendRecord.bind(this) // this is for 'this' working in this context.
    // is this clear?
    this.state = {
      interval: null
    }
  }

  setInputsLocked (isLocked) {
    const form = document.forms.record
    form.username.readOnly = isLocked
    form.project_name.readOnly = isLocked
    form.task_name.readOnly = isLocked
  }

  validateForm () {
    return true
  }

  sendRecord () {
    const data = new FormData(document.forms.record)
    data.append('action', this.state.play ? 'start' : 'stop')
    if (this.state.play) data.append('stop_time', (new Date()).getTime() / 1000)
    data.append('start_time', start.getTime() / 1000)
    data.delete('x')
    data.delete('y')
    data.delete('time') // we already sending unix time;

    const Http = new XMLHttpRequest()
    const url = '/records'
    Http.open('POST', url)
    Http.send(data)
  };

  handleSubmit (e) {
    e.preventDefault()
    if (this.validateForm()) {
      if (!this.state.interval) {
        this.setState({
          play: true,
          start: new Date()
        })
        this.sendRecord()
        this.setState({
          interval: setInterval(this.render, 1000)
        })
        this.setInputsLocked(true)
      } else {
        this.sendRecord()
        clearInterval(this.state.interval)
        this.setState({
          play: false,
          start: new Date(),
          interval: null
        })
        this.setInputsLocked(false)
      }
    }
  }

  render () {
    return (<div id="timer">
      <form id="record" className="pane" name="record" onSubmit={this.handleSubmit}>
        <label htmlFor="username">Your name:</label>
        <input type="text" id="username" name="username" minLength="5" required/>

        <input id="button" className="button" type="image" src={this.state.play ? 'img/stop.jpg' : 'img/play.png'}
               alt="Submit"/>

        <label htmlFor="time"/>
        <input type="text" id="time" name="time" value={this.state.interval?getTimeDiff(this.state.start, new Date()):"00:00:00"} readOnly/>

        <label htmlFor="project_name">Project title:</label>
        <input type="text" id="project_name" name="project_name" minLength="3" required/>

        <label htmlFor="task_name">Task name:</label>
        <input type="text" id="task_name" name="task_name" minLength="5" required/>
      </form>
    </div>)
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
    this.state = {};
    if (this.props.stop === undefined) {
      this.state.stop = new Date();
      this.updateTime = this.updateTime.bind(this);
      setInterval(this.updateTime, 1000);
    } else
      this.state.stop = this.props.stop;
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
          };
        });
      } else {
        console.error(`Muhaha, I lied, I will log into console till I die!\nResponse status: ${Http.status}`)
      }
    }
  }

  getMoreRecords () {
    this.getRecords(this.state.records.length, 10);
  }

  componentDidMount () {
    this.getMoreRecords()
  }

  render () {
    return (<div id="records_table">
      <table style={{"width": "100%"}}>
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
              <Record key={record.id} user={record.student} start={new Date(record.start)} stop={record.stop?new Date(record.stop):undefined}
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
