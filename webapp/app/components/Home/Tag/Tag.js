import React from 'react';
import { connect } from 'react-redux'

class Tag extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSelected : false
    };
    this.toggleSelect = this.toggleSelect.bind(this);
  }

  toggleSelect(tag) {
    let filters = this.props.filters;
    if(filters.tags.includes(tag)){
      let index = filters.tags.indexOf(tag);
      filters.tags.splice(index,1);
    }else{
      filters.tags.push(tag);
    }
    this.props.filters.tags = filters.tags;
    this.setState({
      isSelected: !this.state.isSelected
    });
    this.props.applyFilters();
  }

  render() {
    return (
      <span onClick={this.toggleSelect.bind(this,this.props.name)} className={this.state.isSelected ? `tag-selected` : `tag`}>
          #{this.props.name}
        {/*<span className="tag-count">*/}
            {/*{this.props.count}*/}
        {/*</span>*/}
      </span>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isSelected: state.isSelected
  };
};

export default connect(mapStateToProps)(Tag);
