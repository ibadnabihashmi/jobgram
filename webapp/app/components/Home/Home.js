import React from 'react';
import { connect } from 'react-redux'
import Messages from '../Partials/Messages/Messages';
import { fetchFeed,applyFilters,fetchTags } from '../../actions/feed';
import PlaceHolder from './FeedPlaceholder';
import Tag from './Tag/Tag';
import TimeAgo from 'timeago-react';
import { Filters } from './Filters/Filters';

class Home extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      feed:props.feed,
      from: 0,
      filters: {
        keyword:'',
        location:'',
        salaryMin:'',
        salaryMax:'',
        tags:[],
        source:'',
        provider:''
      },
      isFilterDirty:false
    };
    this.gotoPrevious = this.gotoPrevious.bind(this);
    this.gotoNext = this.gotoNext.bind(this);
    this.applyFilters = this.applyFilters.bind(this);
    this.clearFilters = this.clearFilters.bind(this);
  }

  componentDidMount() {
    this.props.dispatch(fetchFeed(this.state.from));
    this.props.dispatch(fetchTags(0,10));
  }

  gotoNext() {
    let current = this.state.from + 10;
    this.setState({
      from:current
    });
    this.props.dispatch(this.state.isFilterDirty ? applyFilters(this.state.filters,current) : fetchFeed(current));
    window.scrollTo(0, 0);
  }

  gotoPrevious() {
    let current = this.state.from - 10;
    this.setState({
      from:current
    });
    this.props.dispatch(this.state.isFilterDirty ? applyFilters(this.state.filters,current) : fetchFeed(current));
    window.scrollTo(0, 0);
  }

  applyFilters(e) {
    if(this.state.filters.keyword === '' &&
    this.state.filters.location === '' &&
    this.state.filters.salaryMax === '' &&
    this.state.filters.salaryMin === '' &&
    this.state.filters.source === '' &&
    this.state.filters.provider === '' &&
    this.state.filters.tags.length === 0) {
      this.setState({
        from: 0,
        isFilterDirty: false
      });
      this.props.dispatch(fetchFeed(0));
    }else{
      this.setState({
        from: 0,
        isFilterDirty: true
      });
      this.props.dispatch(applyFilters(this.state.filters,0));
    }
  }

  clearFilters(e) {
    this.setState({
      filters: {
        keyword:'',
        location:'',
        salaryMin:'',
        salaryMax:''
      }
    });
  }

  renderTags(tags,context) {
    if(!tags.length){
      return;
    }
    let _tags = [];
    tags.forEach(function (tag) {
      if(tag.name !== ''){
        _tags.push(
          <Tag name={tag.name} count={tag.count} key={tag._id} applyFilters={context.applyFilters} filters={context.state.filters}/>
        );
      }
    });
    return _tags;
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
        <a href={job._source.jobUrl} target="_blank" key={job._id}>
          <div className="col-lg-12 job">
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
                  <i className="material-icons">schedule</i><TimeAgo datetime={job._source.jobDatePosted} locale='en' />
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
              <p>via <span>{job._source.jobSource}</span> <img className={`img-${job._source.jobSource}`} src={job._source.jobSourceLogo}/></p>
            </div>
          </div>
        </a>
      );
    });
    return jobs;
  }

  render() {
    return (
      <div className="col-md-12 home">
        <Messages messages={this.props.messages}/>
        <div className="col-lg-3 search">
          <Filters applyFilters={this.applyFilters} filters={this.state.filters}/>
        </div>
        <div className="col-lg-6 feed">
          {
            this.props.feed.isLoaded ? (
              <div className="col-lg-12 job result-header">
                <span>showing {(this.state.from) + 1} - {(this.state.from) + 10}</span>
                <span className="pull-right">total {this.props.feed.jobs.total}</span>
              </div>
            ) : ''
          }
          {
            !this.props.feed.isLoaded ? <PlaceHolder/> : this.props.feed.jobs.hits ? this.renderFeed() : ''
          }
          {
            this.props.feed.isLoaded ? (
              <div className="btn-group pagination-btn" role="group" aria-label="...">
                <button type="button" className="btn btn-default" disabled={this.state.from === 0 ? true : false} onClick={this.gotoPrevious.bind(this)}>previous</button>
                <button type="button" className="btn btn-default" disabled={(this.state.from + 10) >= this.props.feed.jobs.total ? true : false} onClick={this.gotoNext.bind(this)}>next</button>
              </div>
            ) : ''
          }
        </div>
        <div className="col-lg-3 hashtag-container">
          {
            this.renderTags(this.props.feed.tags,this)
          }
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
