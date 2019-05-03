import Timer from './timer.js'
import {getRecords, deleteRecord} from './storage'

function getTimeDiff(date1, date2) {
    const diff = new Date(date2.getTime() - date1.getTime());
    return `${(`0${diff.getUTCHours()}`).slice(-2)}:${
        (`0${diff.getMinutes()}`).slice(-2)}:${
        (`0${diff.getSeconds()}`).slice(-2)}`
}

class Record extends React.Component {

    updateTime() {
        this.setState({
            stop: new Date()
        })
    }

    constructor(props) {
        super(props);
        this.state = {};
        if (this.props.stop === undefined) {
            this.state.stop = new Date();
            this.updateTime = this.updateTime.bind(this);
            setInterval(this.updateTime, 1000)
        } else
            this.state.stop = this.props.stop
    }

    deleteItself(event) {
        const date = this.props.start;
        const start_date = "" + date.getFullYear() + "-" + (date.getMonth() + 1)+ "-" + date.getDate() + " "
        + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + "." + ("00" + date.getMilliseconds()).slice(-3);
        deleteRecord(this.props.user, start_date).then(this.props.onDelete);
    }

    render() {
        return (<tr className="table_record">
            <td className="table_time">{getTimeDiff(this.props.start, this.state.stop)}</td>
            <td className="table_user">{this.props.user}</td>
            <td className="table_project">{this.props.project}</td>
            <td className="table_task">{this.props.task}</td>
            <td><button onClick={(e) => this.deleteItself(e)}>Remove</button></td>
        </tr>)
    }
}

class RecordsTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            records: []
        };
        this.getMoreRecords = this.getMoreRecords.bind(this) // this is for 'this' working in this context.
    }

    getMoreRecords() {
        getRecords(this.state.records.length, 10).then((recs) => {
            this.setState(state => ({
                records: [...state.records, ...recs],
            }));
        });
    }

    componentDidMount() {
        this.getMoreRecords()
    }

    updateRecords() {
        getRecords(0, this.state.records.length).then((recs) => {
            this.setState(state => ({
                records: [...recs],
            }));
        });
    }

    render() {
        return (<div id="records_table">
            <table style={{'width': '100%'}}>
                <tbody>
                <tr className="table_header">
                    <th>Time</th>
                    <th>Username</th>
                    <th>Project</th>
                    <th>Task</th>
                    <th>Remove</th>
                </tr>
                {
                    this.state.records.map((record) => {
                        return (
                            <Record key={record.id} user={record.student} start={new Date(record.start)}
                                    stop={record.stop ? new Date(record.stop) : undefined}
                                    project={record.project} task={record.task} onDelete={() => this.updateRecords()}/>)
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
    ReactDOM.render(<div>
        <Timer/>
        <RecordsTable initialLength={10}/>
    </div>, document.getElementById('root'))
} catch (e) {
    console.error(e)
}
