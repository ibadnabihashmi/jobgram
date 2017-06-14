import React from 'react';
import Header from './Partials/Header/Header';
import Footer from './Partials/Footer/Footer';

class App extends React.Component {
  render() {
    return (
      <div>
        <Header/>
        {this.props.children}
        <Footer/>
      </div>
    );
  }
}

export default App;
