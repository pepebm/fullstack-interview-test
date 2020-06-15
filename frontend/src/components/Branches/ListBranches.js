import React, { Component } from 'react';

import backend from '../../utils/backend';
class ListBranches extends Component {

  constructor(props) {
    super(props);

    this.state = {
      "branches": []
    };
  }

  getBranches = async () => {
    const res = await backend.listBranches();
    if (res.branches) {
      this.setState({ branches: res.branches })
    } else {
      console.log(res.error);
    }
  }

  componentDidMount() {
    this.getBranches();
  }

  render(){
    return(<p>Hello</p>)
  }
}

export default ListBranches;