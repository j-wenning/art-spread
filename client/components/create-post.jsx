import React from 'react';

class CreatePost extends React.Component {
  constructor(props) {
    super(props);
    this.goToDashboard = this.goToDashboard.bind(this);
  }

  goToDashboard(event) {
    this.props.setView('dashboard', {});
  }

  render() {
    return (
      <div>
        <nav className="d-flex justify-content-space-between navbar">
          <h2 className="ml-5">Create Post</h2>
          <button onClick={this.goToDashboard}><i className="fas fa-arrow-left"></i></button>
        </nav>
      </div>
    );
  }
}

export default CreatePost;
