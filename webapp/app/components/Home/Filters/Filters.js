import React from 'react';

export class Filters extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      filters: {
        keyword:'',
        location:'',
        salaryMin:'',
        salaryMax:'',
        tags:[],
        source:'',
        provider:''
      },
    };
    this.handleKeywordChange = this.handleKeywordChange.bind(this);
    this.handleLocationChange = this.handleLocationChange.bind(this);
    this.handleMinSalaryChange = this.handleMinSalaryChange.bind(this);
    this.handleMaxSalaryChange = this.handleMaxSalaryChange.bind(this);
    this.handleSourceChange = this.handleSourceChange.bind(this);
    this.handleProviderChange = this.handleProviderChange.bind(this);
  }

  handleKeywordChange(e) {
    let filters = this.state.filters;
    filters.keyword = e.target.value;
    this.props.filters.keyword = filters.keyword;
    this.setState({
      filters: filters
    });
  }

  handleSourceChange(e) {
    let filters = this.state.filters;
    filters.source = e.target.value;
    this.props.filters.source = filters.source;
    this.setState({
      filters: filters
    });
  }

  handleProviderChange(e) {
    let filters = this.state.filters;
    filters.provider = e.target.value;
    this.props.filters.provider = filters.provider;
    this.setState({
      filters: filters
    });
  }

  handleLocationChange(e) {
    let filters = this.state.filters;
    filters.location = e.target.value;
    this.props.filters.location = filters.location;
    this.setState({
      filters: filters
    });
  }

  handleMinSalaryChange(e) {
    let filters = this.state.filters;
    filters.salaryMin = e.target.value;
    this.props.filters.salaryMin = filters.salaryMin;
    this.setState({
      filters: filters
    });
  }

  handleMaxSalaryChange(e) {
    let filters = this.state.filters;
    filters.salaryMax = e.target.value;
    this.props.filters.salaryMax = filters.salaryMax;
    this.setState({
      filters: filters
    });
  }

  render(){
    return (
      <div className="col-lg-3 bs-docs-sidebar hidden-print hidden-sm hidden-xs affix">
        <div className="form-group">
          <input type="text" className="form-control" value={this.state.filters.keyword} onChange={this.handleKeywordChange} onBlur={this.props.applyFilters} placeholder="keyword or hashtag"/>
        </div>
        <div className="form-group">
          <input type="text" className="form-control" value={this.state.filters.location} onChange={this.handleLocationChange} onBlur={this.props.applyFilters} placeholder="Location"/>
        </div>
        <div className="form-group">
          <input type="text" className="form-control" value={this.state.filters.source} onChange={this.handleSourceChange} onBlur={this.props.applyFilters} placeholder="Job Source ,e.g : Linkedin etc"/>
        </div>
        <div className="form-group">
          <input type="text" className="form-control" value={this.state.filters.provider} onChange={this.handleProviderChange} onBlur={this.props.applyFilters} placeholder="job provider"/>
        </div>
        <div className="input-group">
          <div className="input-group-addon">min</div>
          <input type="number" className="form-control" value={this.state.filters.salaryMin} onChange={this.handleMinSalaryChange} onBlur={this.props.applyFilters} placeholder="$$$"/>
          <input type="number" className="form-control" value={this.state.filters.salaryMax} onChange={this.handleMaxSalaryChange} onBlur={this.props.applyFilters} placeholder="$$$"/>
          <div className="input-group-addon">max</div>
        </div>
      </div>
    );
  };
}
