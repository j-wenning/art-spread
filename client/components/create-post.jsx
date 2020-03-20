import React from 'react';

class CreatePost extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      postBody: '',
      postTags: '',
      post: null,
      image: ''
    };
    this.goToViewPost = this.goToViewPost.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  goToViewPost(event) {
    this.props.setView('viewPost', {});
  }

  handleChange(event) {
    this.setState({ [event.target.id]: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    const newSubmission = {
      postBody: this.state.postBody,
      postTags: this.state.postTags
    };
    const formData = new FormData();
    formData.append('image', this.state.image);
    fetch(`/api/r/art/${formData}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    }).then(res => {
      console.warn(res);
    });
    this.props.sendPost(newSubmission);
    this.setState({
      postBody: '',
      postTags: ''
    });
    event.currentTarget.reset();
  }

  componentDidMount() {
    fetch(`/api/r/art/${this.props.viewParams.postId}`)
      .then(response => response.json())
      .then(data => {
        return this.setState({ post: data });
      });
  }

  onChange(event) {
    const files = event.target.files;
    this.setState({
      image: files[0]
    });
  }

  render() {
    return (
      <div className="w-100 d-flex align-items-center flex-column">
        <form encType="multipart/form-data"
          className="d-flex justify-content-center w-100 align-items-center
        flex-column form" id={this.props.postId}
          onSubmit={this.handleSubmit}>
          <label htmlFor="image-file" className="custom-file-upload btn btn-custom
          text-custom-primary">
            Upload image</label>
          <input onChange={this.onChange}
            id="image-file" type="file" className="imageInput"/>

          <div className="w-100">
            <div className="text-custom-primary ml-1 mb-1 mt-1">
              Post body
            </div>
            <textarea
              className="generalText form-control"
              type="text"
              id="postBody"
              placeholder="post body"
              onChange={this.handleChange}
            />
          </div>
          <div className="w-100">
            <div className="text-custom-primary ml-1 mb-1 mt-1">
              Post tags
            </div>
            <textarea
              className="generalText form-control"
              type="text"
              id="postTags"
              placeholder="post tags"
              onChange={this.handleChange}
            />
          </div>
          <div className="mt-2 d-flex flex-row w-100 justify-content-center createPostButton">
            <button
              className="btn btn-custom text-custom-primary"
              onSubmit={this.handleSubmit}
              onClick={() => this.props.makePost(this.state.post)}
              type="submit"
              value="Submit">
              Create post
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default CreatePost;
