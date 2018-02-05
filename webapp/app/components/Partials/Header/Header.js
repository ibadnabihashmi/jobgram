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
      <header role="banner" className="navbar-fixed-top">
        <nav id="navbar-primary" className="navbar" role="navigation">
          <div className="container-fluid">
            <div id="navbar-primary-collapse">
              <ul className="nav navbar-nav">
                {/*<li><a href="#">Link</a></li>*/}
                {/*<li><a href="#">Link</a></li>*/}
                <li><a href="#" className="main-logo">Jobtiv<span> beta</span></a></li>
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
