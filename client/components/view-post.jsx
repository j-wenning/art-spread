import React from 'react';

export default class ViewPost extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      analytics: null
    };
  }

  getAnalytics() {
    fetch('/api/analytics')
      .then(res => res.json())
      .then(data => this.setState({ analytics: data }));
  }

  getPosts() {
    fetch('/api/posts')
      .then(res => res.json())
      .then(data => {
        this.setState({ posts: data });
      });
  }

  componentDidMount() {
    this.getPosts();
  }

  render() {
    return (
      <div>
        <div className="d-flex justify-content-center">
          <img className="preview-image-lg" src="./assets/images/default-image.svg" alt=""/>
        </div>
        <div className="container-fluid mt-3 mb-3">
          <div className="horizontal-list overflow-auto row row-horizon flex-row
          flex-nowrap align-items-center">
            <div className="col-4">
              <div className="text-custom-primary">stats</div>
            </div>
            <div className="col-4">
              <div className="text-custom-primary">stats</div>
            </div>
            <div className="col-4">
              <div className="text-custom-primary">stats</div>
            </div>
            <div className="col-4">
              <div className="text-custom-primary">stats</div>
            </div>
            <div className="col-4">
              <div className="text-custom-primary">stats</div>
            </div>
            <div className="col-4">
              <div className="text-custom-primary">stats</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}