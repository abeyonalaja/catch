var React = require('react');
var ReactDOM = require('react-dom');

/*

  StorePicker
  this will let us make

*/

var StorePicker = React.createClass({

    render: function() {
        return (
              <form className="store-selector">
              <h2>Please Enter A Store </h2>
              <input name="" type="text" value="" required />
              <input type="submit" />
                </form>
        )

    }
});


ReactDOM.render(<StorePicker />,document.querySelector('#main'))
