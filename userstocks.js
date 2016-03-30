
var React = require('react-native');

// Destructuring modules
var {
	Component,
	View,
	TouchableHighlight,
	ListView,
	Text,
	StyleSheet,
	ActivityIndicatorIOS
} = React;


class UserStocks extends Component {


	constructor(props) {
		super(props);

		// Define datasource and method for checking is rows change
		var dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id});
		// Setting initial data source as empty array
		this.state = {
			stocks: dataSource.cloneWithRows([]),
			isLoading: true,
			leagueId: this.props.leagueId,
			userId: this.props.userId
		}

		console.log('userstocks props', this.props.leagueId, this.props.userId)
	};

	componentDidMount(){
    // Getting the User's stocks initially
		this.getUserStocks(this.state.leagueId, this.state.userId)
  }

	// Updates the user's stocks to current market price, and resets them
	updateUserStocks(leagueId, userId) {
		this.setState({isLoading: true})

		fetch('https://portfolioio.herokuapp.com/api/portfolios/stocks/'+leagueId+'/'+userId, {
			method: 'PUT'
		}, {
        headers: {
          'x-access-token' : this.props.token
        }})
		.then((response) => response.json())
		.then((data) => {
			
			this.getUserStocks(leagueId, userId)

		})
		.catch((error) => {
			console.log(error)
		})
	}

	// Retrives the users purchased stocks
	getUserStocks(leagueId, userId) {

		fetch('https://portfolioio.herokuapp.com/api/portfolios/stocks/'+leagueId+'/'+userId, {
              headers: {
                'x-access-token' : this.props.token
              }})
		.then((response) => response.json())
		.then((data) => {
			// Setting state (thus re-rendering template)
			var dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id});
			this.setState({ 
				stocks: dataSource.cloneWithRows(data),
				isLoading: false
			});
		})
		.catch((error) => {
			console.log(error)
		})
	};

	renderRow(stockData) {
		return (
			<View style={styles.tableRow}>
				<Text style={styles.tableData}>{ stockData.symbol.toUpperCase() }</Text>
				<Text style={styles.tableData}>{ stockData.shares }</Text>
				<Text style={styles.tableData}>{ stockData.price.toFixed(2) }</Text>
				<Text style={styles.tableData}>{ stockData.marketPrice.toFixed(2) }</Text>
				<Text style={styles.tableData}>{ stockData.return.toFixed(2) }%</Text>
			</View>
		);
	}

	render() {

		var spinner = this.state.isLoading ?
			( <ActivityIndicatorIOS
					hidden='true'
					size='large' /> )  : 
			( <View /> );

		return (
			<View style={styles.container}>
				<View style={styles.table}>
					<View style={styles.tableRow}>
						<Text style={styles.tableHeader}>Stock</Text>
						<Text style={styles.tableHeader}>Shares</Text>
						<Text style={styles.tableHeader}>$ Paid</Text>
						<Text style={styles.tableHeader}>Market $</Text>
						<Text style={styles.tableHeader}>Return</Text>
					</View>
					<ListView dataSource={this.state.stocks}
									initialListSize={15}
									style={styles.listview}
									automaticallyAdjustContentInsets={false}
									renderRow={this.renderRow.bind(this)} />
				</View>
				{ spinner }
			</View>
		)
	}
}

var styles = StyleSheet.create({
	listview:{
		margin: 0
	},
	container: {
		marginTop: 65,
		padding: 0,
		flex: 1,
		backgroundColor: '#F5FCFF'
	},
	table:{
		marginBottom: 10
	},
	tableRow:{
		flexDirection: 'row',
		borderColor: '#bdbdbd',
    borderBottomWidth: 1,
	},
	tableHeader:{
		backgroundColor: '#e0f2f1',
		textAlign: 'center',
		fontSize: 12,
		paddingTop: 20,
		paddingBottom: 20,
		fontWeight: 'bold',
		flex: 3,
		alignSelf: 'center'
	},
	tableDataWrapper: {
		borderColor: '#bdbdbd',
    borderBottomWidth: 1,
	},
	tableData: {
		flex: 3,
		paddingTop: 20,
		paddingBottom: 20,
		fontSize: 15,
		textAlign: 'center'
	}
});

module.exports = UserStocks;