import React from 'react';
import { connect } from 'react-redux';
import { logout } from '../../../actions/auth';

class Header extends React.Component {
  handleLogout(event) {
    event.preventDefault();
    this.props.dispatch(logout());
  }

  render() {
    return (
      <header role="banner">
        <nav id="navbar-primary" className="navbar" role="navigation">
          <div className="container-fluid">
            <div className="navbar-header">
              <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#navbar-primary-collapse">
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
              </button>
            </div>
            <div className="collapse navbar-collapse" id="navbar-primary-collapse">
              <ul className="nav navbar-nav">
                {/*<li><a href="#">Link</a></li>*/}
                {/*<li><a href="#">Link</a></li>*/}
                <li><a href="#">Jobgram</a></li>
                {/*<li><a href="#">Link</a></li>*/}
                {/*<li><a href="#">Link</a></li>*/}
              </ul>
            </div>
          </div>
        </nav>
      </header>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
    user: state.auth.user
  };
};

export default connect(mapStateToProps)(Header);
