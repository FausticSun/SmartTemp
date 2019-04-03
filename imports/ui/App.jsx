import React from 'react';
import Temperatures from '../api/collections/Temperatures';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visibleRooms: [1, 2, 3, 4, 5, 6],
      dateTimeRange: []
    };
  }

  render() {
    return (
      <div>
        <h1>Welcome to Meteor!</h1>
      </div>
    );
  }
}

export default App;
