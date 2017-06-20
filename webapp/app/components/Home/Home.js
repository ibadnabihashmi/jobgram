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
      from: 0
    };
    this.gotoPrevious = this.gotoPrevious.bind(this);
    this.gotoNext = this.gotoNext.bind(this);
  }

  componentDidMount() {
    this.props.dispatch(fetchFeed(this.state.from));
  }

  gotoNext() {
    let current = this.state.from + 10;
    this.setState({
      from:current
    });
    this.props.dispatch(fetchFeed(current));
  }

  gotoPrevious() {
    let current = this.state.from - 10;
    this.setState({
      from:current
    });
    this.props.dispatch(fetchFeed(current));
  }

  renderFeed() {
    const jobs = [];
    const renderLocation = function(jlo) {
      var location = [];
      jlo.forEach(function (loc) {
        location.push(
          <span className="location" key={loc}>{loc}</span>
        );
      });
      return location;
    };

    this.props.feed.jobs.hits.forEach(function (job) {
      jobs.push(
        <div className="col-lg-12 job" key={job._id}>
          <div className="col-lg-12 job-head">
            <div className="row">
                <span className="col-lg-2">
                  <img src={job._source.jobProviderLogo ? job._source.jobProviderLogo : job._source.jobSourceLogo}/>
                </span>
              <span className="col-lg-8">
                  <h2>{job._source.jobTitle}</h2>
                  <h4><i className="material-icons">business</i> {job._source.jobProvider}</h4>
                </span>
              <span className="col-lg-2 text-right">
                  <i className="material-icons">schedule</i><TimeAgo date={new Date(job._source.jobDatePosted)} />
                </span>
            </div>
          </div>
          <div className="col-lg-12 job-content">
            {
              job._source.jobSalary ? (
                <span><i className="material-icons">attach_money</i> {job._source.jobSalary.min} - {job._source.jobSalary.max}</span>
              ) : ''
            }
            <p>{job._source.shortDescription}</p>

            {
              job._source.jobLocation ? (
                <div>
                  <i className="material-icons">place</i>
                  {
                    renderLocation(job._source.jobLocation)
                  }
                </div>
              ) : ''
            }

          </div>
          <div className="col-lg-12 job-footer">
            <p>via <span>{job._source.jobSource}</span> <img src={job._source.jobSourceLogo}/></p>
          </div>
        </div>
      );
    });
    return jobs;
  }

  render() {
    return (
      <div className="col-md-12 home">
        <Messages messages={this.props.messages}/>
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
          {
            this.props.feed.jobs.hits ? this.renderFeed() : ''
          }
          <div className="btn-group pagination-btn" role="group" aria-label="...">
            <button type="button" className="btn btn-default" disabled={this.state.from === 0 ? true : false} onClick={this.gotoPrevious.bind(this)}>previous</button>
            <button type="button" className="btn btn-default" onClick={this.gotoNext.bind(this)}>next</button>
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
