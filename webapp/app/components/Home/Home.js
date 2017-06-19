import React from 'react';
import { connect } from 'react-redux'
import Messages from '../Partials/Messages/Messages';
import TimeAgo from 'react-timeago';
import { fetchFeed } from '../../actions/feed'

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      feed:props.feed,
    }
  }

  componentDidMount() {
    this.props.dispatch(fetchFeed());
  }

  render() {
    return (
      <div className="col-md-12 home">
        <Messages messages={this.props.messages}/>
        <div className="col-lg-10">
          {this.state.feed.length > 0 ? this.state.feed.length :'yolo'}
        </div>
        <div className="col-lg-3 search">
          <div className="form-group">
            <input type="text" className="form-control" placeholder="keyword or hashtag"/>
          </div>
          <div className="form-group">
            <input type="text" className="form-control" placeholder="Country"/>
          </div>
          <div className="form-group">
            <input type="text" className="form-control" placeholder="City"/>
          </div>
          <div className="input-group">
            <div className="input-group-addon">min</div>
            <input type="number" className="form-control" placeholder="$$$"/>
            <input type="number" className="form-control" placeholder="$$$"/>
            <div className="input-group-addon">max</div>
          </div>
          <div className="form-group">
            <button className="btn btn-default">Search</button>
          </div>
        </div>
        <div className="col-lg-6 feed">
          <div className="col-lg-12 job">
            <div className="col-lg-12 job-head">
              <div className="row">
                <span className="col-lg-2">
                  <img src="https://conferencecloud-assets.s3.amazonaws.com/default_avatar.png"/>
                </span>
                <span className="col-lg-8">
                  <h2>Some Title</h2>
                  <h4><i className="material-icons">business</i> provider</h4>
                </span>
                <span className="col-lg-2 text-right">
                  <i className="material-icons">schedule</i><TimeAgo date={new Date(1497371817000)} />
                </span>
              </div>
            </div>
            <div className="col-lg-12 job-content">
              <span><i className="material-icons">attach_money</i> PKR 30000 - 40000</span>
              <p>Projecting surrounded literature yet delightful alteration but bed men. Open are from long why cold. If must snug by upon sang loud left. As me do preference entreaties compliment motionless ye literature.</p>
              <i className="material-icons">place</i><span className="location">lahore</span><span className="location">karachi</span>
            </div>
            <div className="col-lg-12 job-footer">
              <p>via <span>linkedin</span> <img src="http://1000logos.net/wp-content/uploads/2017/03/LinkedIn-Logo.png"/></p>
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
                  <h4><i className="material-icons">business</i> provider</h4>
                </span>
                <span className="col-lg-2 text-right">
                  <i className="material-icons">schedule</i><TimeAgo date={new Date(1497371817000)} />
                </span>
              </div>
            </div>
            <div className="col-lg-12 job-content">
              <span><i className="material-icons">attach_money</i> PKR 30000 - 40000</span>
              <p>Projecting surrounded literature yet delightful alteration but bed men. Open are from long why cold. If must snug by upon sang loud left. As me do preference entreaties compliment motionless ye literature.</p>
              <i className="material-icons">place</i><span className="location">lahore</span><span className="location">karachi</span>
            </div>
            <div className="col-lg-12 job-footer">
              <p>via <span>linkedin</span> <img src="http://1000logos.net/wp-content/uploads/2017/03/LinkedIn-Logo.png"/></p>
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
                  <h4><i className="material-icons">business</i> provider</h4>
                </span>
                <span className="col-lg-2 text-right">
                  <i className="material-icons">schedule</i><TimeAgo date={new Date(1497371817000)} />
                </span>
              </div>
            </div>
            <div className="col-lg-12 job-content">
              <span><i className="material-icons">attach_money</i> PKR 30000 - 40000</span>
              <p>Projecting surrounded literature yet delightful alteration but bed men. Open are from long why cold. If must snug by upon sang loud left. As me do preference entreaties compliment motionless ye literature.</p>
              <i className="material-icons">place</i><span className="location">lahore</span><span className="location">karachi</span>
            </div>
            <div className="col-lg-12 job-footer">
              <p>via <span>linkedin</span> <img src="http://1000logos.net/wp-content/uploads/2017/03/LinkedIn-Logo.png"/></p>
            </div>
          </div>
        </div>
        <div className="col-lg-3 hashtag-container">
          <span className="tag">#businessdevelopment<span className="tag-count">45</span></span>
          <span className="tag">#java<span className="tag-count">4</span></span>
          <span className="tag">#accounts<span className="tag-count">25</span></span>
          <span className="tag">#industrialdevelopment<span className="tag-count">45</span></span>
          <span className="tag">#photoshop<span className="tag-count">8</span></span>
          <span className="tag">#css<span className="tag-count">5</span></span>
          <span className="tag">#illustrator<span className="tag-count">15</span></span>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    messages: state.messages,
    feed: state.feed
  };
};

export default connect(mapStateToProps)(Home);
