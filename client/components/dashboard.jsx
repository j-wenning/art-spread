import React from 'react';

export default class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = { viewingPublished: true };
  }

  viewViewPost(index) {
    this.props.fetchAccounts()
      .then(data => this.props.viewViewPost({
        post: this.props.posts[index],
        index,
        canPublish: !!data.filter(item => item.isLinked).length
      })).catch(err => console.error(err));
  }

  createPostRender(item, index) {
    return (
      <div
        onClick={() => this.viewViewPost(index)}
        key={index}
        className="post col-12 px-0 mb-2">
        <div className="row d-flex align-items-center px-0 m-0">
          <div className="pl-2 pr-1">
            <img
              src={item.imgPath || '/assets/images/default-image.svg'}
              alt=""
              className="img-window border border-secondary bg-primary" />
          </div>
          <div className="col text-truncate pl-1 pr-2">
            <p
              className="col-12 rounded bg-primary text-truncate text-primary p-1 my-1">
              {item.title || <span className="text-capitalize">&lt;no title&gt;</span>}
            </p>
            <p
              className="col-12 rounded bg-primary text-truncate text-primary p-1 my-1">
              {item.body || <span className="text-capitalize">&lt;no body&gt;</span>}
            </p>
            <p
              className="col-12 rounded bg-primary text-truncate text-secondary p-1 my-1">
              {item.tags || <span className="text-capitalize">&lt;no tags&gt;</span>}
            </p>
          </div>
        </div>
      </div>
    );
  }

  componentDidMount() {
    this.props.fetchPosts();
  }

  render() {
    let hasNoPubs = true;
    let hasNoPosts = true;
    const defaultPfp = '/assets/images/default-profile.svg';
    const publications = this.props.posts.map((item, index) => {
      if (item.isPublished) {
        hasNoPubs = false;
        return this.createPostRender(item, index);
      }
    }).sort(() => -1);
    const savedPosts = this.props.posts.map((item, index) => {
      if (!item.isPublished) {
        hasNoPosts = false;
        return this.createPostRender(item, index);
      }
    }).sort(() => -1);
    return (
      <div className="dashboard container text-center">
        <div className="row">
          <div className="col-6">
            <a
              onClick={this.props.viewModifyProfile}
              className="btn btn-custom text-capitalize d-flex justify-content-center align-items-center mt-2">
              modify profile
            </a>
            <a
              onClick={this.props.viewSwitchProfile}
              className="btn btn-custom text-capitalize d-flex justify-content-center align-items-center mt-4">
              switch profile
            </a>
            <a
              onClick={this.props.viewCreatePost}
              className="btn btn-custom text-capitalize d-flex justify-content-center align-items-center mt-4">
              create post
            </a>
          </div>
          <div className="col-6">
            <img
              src={this.props.profile ? this.props.profile.imgPath || defaultPfp : defaultPfp}
              alt=""
              className="img-window border rounded-circle border-secondary bg-primary"/>
            <h4 className="text-primary mt-2 text-truncate">
              {this.props.profile ? this.props.profile.name || 'profile' : 'profile'}
            </h4>
            <div className="d-flex justify-content-end">
              <a
                onClick={this.props.viewSettings}
                className="btn btn-custom-menu d-flex justify-content-center align-items-center mr-3">
                <i className="fas fa-cog"/>
              </a>
            </div>
          </div>
        </div>
        <ul className="nav nav-tabs mt-3" role="tablist">
          <li className="nav-item bg-primary">
            <button
              className="nav-link text-primary text-capitalize active"
              id="publications-tab"
              data-toggle="tab"
              href="#publications"
              role="tab"
              aria-controls="publications"
              aria-selected="true">
                publications
            </button>
          </li>
          <li className="nav-item bg-primary">
            <button
              className="nav-link text-primary text-capitalize"
              id="saved-posts-tab"
              data-toggle="tab"
              href="#saved-posts"
              role="tab"
              aria-controls="saved-posts"
              aria-selected="false">
                saved posts
            </button>
          </li>
        </ul>
        <div className="tab-content bg-secondary">
          <div
            className="tab-pane fade vh-60 overflow-auto show active py-4"
            id="publications"
            role="tabpanel"
            aria-labelledby="publications-tab">
            {publications}
            {hasNoPubs && (
              <div className="col-12">
                <p
                  className="bg-primary rounded text-primary text-capitalize py-2">
                  no publications
                </p>
              </div>
            )}
            <div className="col-12">&nbsp;</div>
          </div>
          <div
            className="tab-pane fade vh-60 overflow-auto py-4"
            id="saved-posts"
            role="tabpanel"
            aria-labelledby="saved-posts">
            {savedPosts}
            {hasNoPosts && (
              <div className="col-12">
                <p
                  className="bg-primary rounded text-primary text-capitalize py-2">
                  no posts
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
