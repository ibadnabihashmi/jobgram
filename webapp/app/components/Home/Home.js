import React from 'react';
import { connect } from 'react-redux'
import Messages from '../Partials/Messages/Messages';
import TimeAgo from 'react-timeago';

class Home extends React.Component {
  render() {
    return (
      <div className="container home">
        <Messages messages={this.props.messages}/>
        <div className="col-lg-8 col-lg-offset-2 feed">
          <div className="col-lg-12 job">
            <div className="col-lg-12 job-head">
              <div className="row">
                <span className="col-lg-2">
                  <img src="https://conferencecloud-assets.s3.amazonaws.com/default_avatar.png"/>
                </span>
                <span className="col-lg-8">
                  <h2>Some Title</h2>
                  <h4>provider</h4>
                </span>
                <span className="col-lg-2 text-right">
                  <TimeAgo date={new Date(1497371817000)} />
                </span>
              </div>
            </div>
            <div className="col-lg-12 job-content">
              <p>PKR 30000 - 40000</p>
              <p>Projecting surrounded literature yet delightful alteration but bed men. Open are from long why cold. If must snug by upon sang loud left. As me do preference entreaties compliment motionless ye literature.</p>
              <span>lahore</span><span>karachi</span>
            </div>
            <div className="col-lg-12 job-footer">
              <p>via linkedin <img src="http://1000logos.net/wp-content/uploads/2017/03/LinkedIn-Logo.png" width="13" height="13"/></p>
            </div>
          </div>
          <div className="col-lg-12 job">
            <div className="col-lg-12 job-head">
              <div className="row">
                <span className="col-lg-2">
                  <img src="https://conferencecloud-assets.s3.amazonaws.com/default_avatar.png"/>
                </span>
                <span className="col-lg-8">
                  <h2>Some Title</h2>
                  <h4>provider</h4>
                </span>
                <span className="col-lg-2 text-right">
                  <TimeAgo date={new Date(1497371817000)} />
                </span>
              </div>
            </div>
            <div className="col-lg-12 job-content">
              <p>PKR 30000 - 40000</p>
              <p>Projecting surrounded literature yet delightful alteration but bed men. Open are from long why cold. If must snug by upon sang loud left. As me do preference entreaties compliment motionless ye literature.</p>
              <span>lahore</span><span>karachi</span>
            </div>
            <div className="col-lg-12 job-footer">
              <p>via linkedin <img src="http://1000logos.net/wp-content/uploads/2017/03/LinkedIn-Logo.png" width="13" height="13"/></p>
            </div>
          </div>
          <div className="col-lg-12 job">
            <div className="col-lg-12 job-head">
              <div className="row">
                <span className="col-lg-2">
                  <img src="https://conferencecloud-assets.s3.amazonaws.com/default_avatar.png"/>
                </span>
                <span className="col-lg-8">
                  <h2>Some Title</h2>
                  <h4>provider</h4>
                </span>
                <span className="col-lg-2 text-right">
                  <TimeAgo date={new Date(1497371817000)} />
                </span>
              </div>
            </div>
            <div className="col-lg-12 job-content">
              <p>PKR 30000 - 40000</p>
              <p>Projecting surrounded literature yet delightful alteration but bed men. Open are from long why cold. If must snug by upon sang loud left. As me do preference entreaties compliment motionless ye literature.</p>
              <span>lahore</span><span>karachi</span>
            </div>
            <div className="col-lg-12 job-footer">
              <p>via linkedin <img src="http://1000logos.net/wp-content/uploads/2017/03/LinkedIn-Logo.png" width="13" height="13"/></p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    messages: state.messages
  };
};

export default connect(mapStateToProps)(Home);
