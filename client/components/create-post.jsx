import React from 'react';

export default class CreatePost extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      img: '',
      title: '',
      body: '',
      tags: '',
      tagsTrimmed: '',
      imgError: false,
      rawImg: null,
      isValidPost: false
    };
  }

  stateUpdate(e) {
    const id = e.currentTarget.id;
    const value = e.currentTarget.value;
    if (id === 'img') {
      const file = e.currentTarget.files[0];
      if (file.size < 10000) {
        const fr = new FileReader();
        fr.onload = () => this.setState({
          img: file,
          imgError: false,
          rawImg: fr.result
        });
        fr.onerror = () => console.error(fr.error);
        fr.readAsDataURL(file);
      } else this.setState({ img: '', rawImg: '', imgError: true });
    } else if (id === 'tags') {
      let newVal = value;
      if (value.length > this.state.tags.length) {
        if (newVal[0] !== '#') newVal = '#' + newVal;
        if (/\s/.test(newVal.substr(-1))) newVal += '#';
        newVal = newVal
          .replace(/#{2,}|#\s#/g, '#')
          .split('#')
          .map(item => item.replace(/\W/g, ''))
          .join(' #');
      }
      newVal = newVal.trim();
      e.currentTarget.value = newVal;
      this.setState({ tags: newVal, tagsTrimmed: newVal });
      if (/#/.test(newVal.substr(-1))) {
        this.setState({ tagsTrimmed: newVal.substr(0, newVal.length - 2) });
      }
    } else this.setState({ [id]: value.trim() });
    if (id === 'body') {
      const style = e.currentTarget.style;
      style.height = 0;
      style.height = e.currentTarget.scrollHeight + 10 + 'px';
    }
  }

  render() {
    const isValidPost = !!this.state.img || (!!this.state.title && this.state.body);
    return (
      <div className="create-post container">
        <div className="row">
          <div className="col-6 d-flex justify-content-center">
            <img
              src={this.state.rawImg || '/assets/images/default-image.svg'}
              alt=""
              className="img-window border border-secondary bg-primary"/>
          </div>
          <div className="col-6 d-flex justify-content-center align-items-center">
            <div>
              <label htmlFor="img"
                className="btn btn-custom d-flex justify-content-center align-items-center text-capitalize mt-2">
                upload image
              </label>
              <input
                onChange={e => this.stateUpdate(e)}
                type="file"
                id="img"
                accept=".jpg, .jpeg, .png, .svg"
                className="d-none" />
              {this.state.img && (
                <button
                  onClick={() => { this.setState({ img: '', rawImg: null }); }}
                  type="button"
                  className="btn btn-custom text-capitalize">
                    cancel
                </button>
              )}
            </div>
          </div>
        </div>
        {this.state.imgError && (
          <div className="alert alert-danger mt-1" role="alert">
            <p>Image exceeds maximum filesize (10KB)!</p>
            <p className="mb-0">
                Since this is a simple proof of concept, space must be conserved.
            </p>
          </div>
        )}
        <h3 className="text-primary text-capitalize mt-3">post title</h3>
        <input
          onChange={e => this.stateUpdate(e)}
          id="title"
          type="text"
          className="col-12 rounded  border-secondary bg-primary p-3" />
        <h3 className="text-primary text-capitalize mt-2">post body</h3>
        <textarea
          onChange={e => this.stateUpdate(e)}
          id="body"
          type="text"
          style={{ minHeight: '110px' }}
          className="col-12 rounded border-secondary bg-primary p-3" />
        <h3 className="text-primary text-capitalize mt-2">post tags</h3>
        <input
          onChange={e => this.stateUpdate(e)}
          id="tags"
          type="text"
          className="col-12 rounded border-secondary bg-primary p-3" />
        <div className="text-center">
          <button
            disabled={!isValidPost}
            onClick={() => this.props.createPost({
              img: this.state.img,
              title: this.state.title,
              body: this.state.body,
              tags: this.state.tagsTrimmed
            })}
            type="button"
            className="btn btn-custom text-capitalize mt-4">
            create post
          </button>
        </div>
      </div>
    );
  }
}
