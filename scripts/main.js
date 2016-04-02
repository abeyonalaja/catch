var React = require('react');
var ReactDOM = require('react-dom');

var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var Navigation = ReactRouter.Navigation;
var History = ReactRouter.History;
var createBrowserHistory = require('history/lib/createBrowserHistory');

var helpers = require('./helpers.js');

// Firebase
var Rebase = require('re-base');
var base = Rebase.createClass('https://luminous-heat-722.firebaseio.com/');

/*

  StorePicker
  this will let us make

*/
var App = React.createClass({

    getInitialState : function() {
        return {
            fishes : {},
            order  : {}
        }  
    },

    componentDidMount : function() {
        base.syncState(this.props.params.storeID + '/fishes', {
            context : this,
            state : 'fishes'
        });

        var localStorageRef = localStorage.getItem('order-' + this.props.params.storeID);

        if(localStorageRef) {
            this.setState({
                order : JSON.parse(localStorageRef)
            })
        }
    },

    componentWillUpdate : function(nextProps, nextState) {
        console.log(nextState);
        localStorage.setItem('order-' + this.props.params.storeID, JSON.stringify(nextState.order) );
    },

    addToOrder : function(key) {
        this.state.order[key] = this.state.order[key] + 1 || 1;
        this.setState({ order : this.state.order })
    },

    addFish : function(fish) {

        console.log('added fish')
        var timestamp = (new Date()).getTime();
        // update state object
        this.state.fishes['fish-' + timestamp] = fish;
        // set the state
        this.setState({ fishes : this.state.fishes });
    },

    loadSamples : function() {
        this.setState({
            fishes : require('./sample-fishes.js')
        })
    },

    renderFish : function(key){
        return <Fish key={key} index={key} details={this.state.fishes[key]} addToOrder={ this.addToOrder } />
    },

    render: function() {
        return (
            <div className="catch-of-the-day">
                <div className="menu">
                  <Header tagline="Fresh Seafood Market" />
                  <ul className="list-of-fishes">
                {Object.keys(this.state.fishes).map(this.renderFish)}
                  </ul>
                </div>
                <Order fishes={ this.state.fishes } order={ this.state.order }/>
                <Inventory addFish={this.addFish} loadSamples={this.loadSamples} />
            </div>
        );
    }
});

var StorePicker = React.createClass({

    mixins : [History],
    goToStore : function(event) {
        event.preventDefault();
        // get the data from the input
        var storeID = this.refs.storeID.value;
        this.history.pushState(null, '/store/' + storeID);
        // transition from the <StorePicker/> to <App/>
    },

    render: function() {
        return (
                <form className="store-selector" onSubmit={this.goToStore}>
                    <h2>Please Enter A Store </h2>
                    <input name="" ref="storeID" type="text" defaultValue={helpers.getFunName()} required />
                    <input type="submit" />
                </form>
        )

    }
});

var Header = React.createClass({

    render : function() {
        return (
            <header className="top">
                  <h1>Catch
                    <span className="ofThe">
                      <span className="of">of</span>
                      <span className="the">The</span>
                    </span>
                  Day</h1>
                <h3 className="tagline">{this.props.tagline}</h3>
            </header>
        );
    }
});

var Order = React.createClass({

    renderOrder : function(key) {
        
        var fish = this.props.fishes[key];
        var count = this.props.order[key];
        if(!fish){
            return <li key={ key }>Sorry, fish no longer available</li>
        }

        return (
                <li key={ key }>
                { count }lbs
                { fish.name }
                <span>{ helpers.formatPrice( count * fish.price) }</span> 
                </li>
        );
    },

    render : function() {

        var orderIds = Object.keys(this.props.order);
        var total = orderIds.reduce((prevTotal, key) => {
            var fish = this.props.fishes[key];
            var count = this.props.order[key];
            var isAvailable = fish && fish.status === 'available';
            if(fish && isAvailable) {
                return prevTotal + (count * parseInt(fish.price) || 0);
            }

            return prevTotal;
        }, 0);

        return (
                <div className="order-wrap">
                <h2 className="order-title">Your Order</h2>
                <ul className="order">
                { orderIds.map(this.renderOrder) }
                    <li className="total">
                    <strong>Total:</strong>
                    { helpers.formatPrice(total) }
                    </li>
                </ul>
            </div>
        );
    }
});

var Inventory = React.createClass({

    render : function(){
        return (
            <div>
                <h2>Inventory</h2>
                <AddFishForm addFish={this.props.addFish} />
                <button onClick={this.props.loadSamples}>Load Sample Fishes</button>
            </div>
        );
    }
});


/*
  Fish
  <Fish />
*/
var Fish = React.createClass({
  
    onButtonClick : function(){
        this.props.addToOrder(this.props.index);
        console.log('grrr')
    },
    render: function(){

      var details = this.props.details;
        var isAvailable = ( details.status === 'available' ? true : false );
        var buttonText = ( isAvailable ? 'Add To Oder' : 'Sold Out!' );
      return(
              <li className="menu-fish">
                <img alt={ details.name } src={ details.image }/>
                <h3 className="fish-name">
                  { details.name }
              <span className="price">{ helpers.formatPrice(details.price) }</span>
                </h3>
                <p>{ details.desc }</p>
              <button disabled={ !isAvailable } onClick={ this.onButtonClick }>{ buttonText }</button>
              </li>
              
      );
  }
});


/*
  AddFishForm
*/
var AddFishForm = React.createClass({

    createFish : function(event) {
        event.preventDefault();select
        console.log('Grrr')
        var fish =  {
            name   : this.refs.name.value,
            price  : this.refs.price.value,
            status : this.refs.status.value,
            desc   : this.refs.desc.value,
            image  : this.refs.image.value
        }

        this.props.addFish(fish);
        this.refs.fishForm.reset();
    },

    render : function(){
        return(
                <form className="fish-edit" ref="fishForm" onSubmit={this.createFish}>
                    <input name="" type="text" placeholder="Fish Name" ref="name"/>
                    <input ref="price" type="text" placeholder="Fish Price"/>
                    <select id="" name="" ref="status">
                        <option value="available">Fresh!</option>
                        <option value="unavailable">Sold Out!</option>
                    </select>
                    <textarea type="text" id="" ref="desc" placeholder="Desc"></textarea>
                    <input ref="image" type="text" placeholder="URL to Image"/>
                <button type="submit">+ Add Item</button>
                </form>
        );
    }
});

/*
  Not Found
*/

var NotFound = React.createClass({

    render : function() {
        return <h1>Not Found</h1>
    }
});


/*

  Routes

*/


var routes = (
   <Router history={createBrowserHistory()}>
        <Route path="/" component={StorePicker} />
        <Route path="/store/:storeID" component={App} />
        <Route path="*" component={NotFound}></Route>
    </Router>
);

ReactDOM.render(routes,document.querySelector('#main'))
