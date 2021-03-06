class App extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			data: this.props.data,
			chartData: this.props.data[0]
		};
	}

	setSelectedDay = data => {
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
			this.setState({data: initDATA, chartData: initDATA[0]});
		})
	}

	render(){

		const dayComponents = [];
		this.state.data.forEach((day, index) => {
			dayComponents.push(<Day data={day} setSelectedDay={this.setSelectedDay} />);
		});

		return (
			<div>
				<TopPart setData={this.getData} />
				{dayComponents}
				<ChartComponent data={this.state.chartData}/>
			</div>
		)
	}
};


class TopPart extends React.Component {
	constructor(props){
		super(props);
	}

	locationChanged = e => {
		this.props.setData(e.target.value);
	}

	render() {
		return (
			<div className="selectArea">
				<h1 className="title">React.js Weather App</h1>

				<p className="selectLabel">Select a location: </p>
				<select className="select" onChange={this.locationChanged}>
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
				<div>
					<p className="maxTemp">Max: {this.props.data.maxTemperature} &deg;C</p>
					<p className="minTemp">Min: {this.props.data.minTemperature} &deg;C</p>
				</div>
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

        ctx.canvas.width = 600;
		ctx.canvas.height = 300;

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
				<h2 className="chartTitle">{this.props.data.day}</h2>	
				<canvas ref="chart"></canvas>
			</div>
		)
	}	
};


const initDATA = [
	{day: "Monday", temperature: "-", maxTemperature: "-", minTemperature: "-", weatherIconUrl: "#"},
	{day: "Tuesday", temperature: "-", maxTemperature: "-", minTemperature: "-", weatherIconUrl: "#"},
	{day: "Wednesday", temperature: "-", maxTemperature: "-", minTemperature: "-", weatherIconUrl: "#"},
	{day: "Thursday", temperature: "-", maxTemperature: "-", minTemperature: "-", weatherIconUrl: "#"},
	{day: "Friday", temperature: "-", maxTemperature: "-", minTemperature: "-", weatherIconUrl: "#"},
	{day: "Saturday", temperature: "-", maxTemperature: "-", minTemperature: "-", weatherIconUrl: "#"}
];


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
		ReactDOM.render(
			<App data={initDATA} />,
			document.getElementById("app")
		);
	})
}

const id = "Helsinki";
init(id);


function getWeekDay(dateStr) {
	const date = new Date(dateStr);
	const weekdayNo = date.getDay();
	const weekdays = {0: "Sunday", 1: "Monday", 2: "Tuesday", 3: "Wednesday", 4: "Thursday", 5: "Friday", 6: "Saturday"};
	return weekdays[weekdayNo];
};