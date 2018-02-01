class App extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			data: this.props.data,
			chartData: this.props.data[0]
		};
	}

	setSelectedDay = data => {
		console.log("clicked APP");
		this.setState({chartData: data});
	}

	getData = location => {
		const value = location;
		fetch("/forecast/" + value).then(resp => resp.json())
		.then(data => {

			const DATA = [];
			Object.keys(data).forEach((key, index) => {
				const newObj = data[key];
				newObj.day = getWeekDay(key);
				DATA.push(newObj);
			});

			this.setState({data: DATA, chartData: DATA[0]});
		})
		.catch(error => {
			console.log(error);
		})
	}

	render(){

		const days = [];
		this.state.data.forEach((day, index) => {
			days.push(<Day data={day} setSelectedDay={this.setSelectedDay} />);
		});

		return (
			<div>
				<TopPart setData={this.getData} />
				{days}
				<ChartComponent data={this.state.chartData}/>
			</div>
		)
	}
};


class TopPart extends React.Component {
	constructor(props){
		super(props);
	}

	handleClick = e => {
		this.props.setData(e.target.value);
	}

	render() {
		return (
			<div className="selectArea">
				<h1 className="title">React.js Weather App</h1>

				<p className="selectLabel">Select location: </p>
				<select className="select" onChange={this.handleClick}>
					<option value="Helsinki">Helsinki</option>
					<option value="Los Angeles">Los Angeles</option>
					<option value="Dubai">Dubai</option>
					<option value="Tokyo">Tokyo</option>
					<option value="Barcelona">Barcelona</option>
				</select>
			</div>
		)
	}
}


class Day extends React.Component {
	constructor(props){
		super(props);
	}

	handleClick = () => {
		this.props.setSelectedDay(this.props.data);
	}

	render(){
		return (
			<div className="Day" onClick={this.handleClick}>
				<h2 className="dayTitle">{this.props.data.day}</h2>
				<img className="icon" src={this.props.data.weatherIconUrl} />
				<p className="temp">{this.props.data.temperature} &deg;C</p>
				<p className="maxTemp">Max: {this.props.data.maxTemperature} &deg;C</p>
				<p className="minTemp">Min: {this.props.data.minTemperature} &deg;C</p>
			</div>
		)
	}
};


class ChartComponent extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			forecastData: this.props.data.forecast,
			chart: null
		}
	}

	componentDidMount() {
        this.initializeChart();
    }

    initializeChart() {

    	if (this.refs.chart === undefined){
    		return
    	}
        const elem = ReactDOM.findDOMNode(this.refs.chart);
        const ctx = elem.getContext("2d");

        ctx.canvas.width = 500;
		ctx.canvas.height = 250;

        const data = [];
        const propsData = this.props.data.forecast;
        const keys = Object.keys(propsData).sort((a,b) => parseInt(a) > parseInt(b));

        keys.forEach((key, index) => {
        	data.push({x: parseInt(key), y: propsData[key].temperature});
        });

        const config = {
        	type: "line",
        	data: {
	        	labels: keys,
	        	datasets: [{
	        		data: data,
	        		fill: false,
	        		borderColor: "blue",
	        		pointRadius: 4,
	        		pointHitRadius: 8,
	        		pointBackgroundColor: "blue",
	        		label: "Temperature (°C)",
	        		cubicInterpolationMode: "monotone"
	        	}]
        	},
        	options: {
        		responsive: false,
        		scales: {
        			yAxes: [{
        				ticks: {
        					stepSize: 0.5
        				}
        			}]
        		}
        	}
        };

        if (this.state.chart === null){
        	let chart = new Chart(ctx, config);
        	this.setState({chart: chart});
        	return;
        }
        this.state.chart.data.datasets[0].data = data;
        this.state.chart.data.labels = keys;

        this.state.chart.update();
    }

	render(){

		this.initializeChart();

		return (
			<div className="Chart">
				<canvas ref="chart"></canvas>
			</div>
		)
	}	
};


const initDATA = [
	{day: "Monday", temperature: 15, maxTemperature: 18, minTemperature: 14, icon: "#"},
	{day: "Tuesday", temperature: 15, maxTemperature: 18, minTemperature: 14, icon: "#"},
	{day: "Wednesday", temperature: 15, maxTemperature: 18, minTemperature: 14, icon: "#"},
	{day: "Thursday", temperature: 15, maxTemperature: 18, minTemperature: 14, icon: "#"},
	{day: "Friday", temperature: 15, maxTemperature: 18, minTemperature: 14, icon: "#"},
	{day: "Saturday", temperature: 15, maxTemperature: 18, minTemperature: 14, icon: "#"},
	{day: "Sunday", temperature: 15, maxTemperature: 18, minTemperature: 14, icon: "#"},
];

const id = "Helsinki";
function init(id){

	fetch("/forecast/" + id).then(resp => resp.json())
	.then(data => {

		const DATA = [];
		Object.keys(data).forEach((key, index) => {
			const newObj = data[key];
			newObj.day = getWeekDay(key);
			DATA.push(newObj);
		});

		ReactDOM.render(
			<App data={DATA} />,
			document.getElementById("app")
		);
	})
	.catch(error => {
		console.log(error);
	})
}

init(id);

/*ReactDOM.render(
	<App data={DATA} />,
	document.getElementById("app")
);*/

function getWeekDay(dateStr) {
	const date = new Date(dateStr);
	const weekdayNo = date.getDay();
	const weekdays = {0: "Sunday", 1: "Monday", 2: "Tuesday", 3: "Wednesday", 4: "Thursday", 5: "Friday", 6: "Saturday"};
	return weekdays[weekdayNo];
};