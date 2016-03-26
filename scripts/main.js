var React = require('react');
var ReactDOM = require('react-dom');

var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var Navigation = ReactRouter.Navigation;
var History = ReactRouter.History;
var createBrowserHistory = require('history/lib/createBrowserHistory');

var helpers = require('./helpers.js');

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

    addFish : function(fish) {

        console.log('added fish')
        var timestamp = (new Date()).getTime();
        // update state object
        this.state.fishes['fish-' + timestamp] = fish;
        // set the state
        this.setState({ fishes : this.state.fishes });
    },

    render: function() {
        return (
            <div className="catch-of-the-day">
                <div className="menu">
                  <Header tagline="Fresh Seafood Market" />
                </div>
                <Order />
                <Inventory addFish={this.addFish} />
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

    render : function() {

        return (
            <p>Order</p>
        );
    }
});

var Inventory = React.createClass({

    render : function(){
        return (
            <div>
                <h2>Inventory</h2>
                <AddFishForm addFish={this.props.addFish} />
            </div>
        );
    }
});


/*
  AddFishForm
*/
var AddFishForm = React.createClass({

    createFish : function(event) {
        event.preventDefault();
        console.log('Grrr')
        var fish =  {
            name   : this.refs.name.value,
            price  : this.refs.price.value,
            status : this.refs.status.value,
            desc   : this.refs.desc.value,
            image  : this.refs.image.value
        }

        this.props.addFish(fish)
    },

    render : function(){
        return(
                <form className="fish-edit" onSubmit={this.createFish}>
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
