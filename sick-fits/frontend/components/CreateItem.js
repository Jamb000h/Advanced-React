import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import Form from './styles/Form';
import gql from 'graphql-tag';
import Router from 'next/router'
import formatMoney from '../lib/formatMoney';
import Error from './ErrorMessage'

const CREATE_ITEM_MUTATION = gql`
  mutation CREATE_ITEM_MUTATION(
    $title: String!
    $description: String!
    $price: Int!
    $image: String
    $largeImage: String
  ) {
    createItem(
      title: $title
      description: $description
      price: $price
      image: $image
      largeImage: $largeImage
    ) {
      id
    }
  }
`;

class CreateItem extends Component {
  state = {
    title: '',
    description: '',
    image: '',
    largeImage: '',
    price: 0,
  }

  handleChange = e => {
    const { name, type, value } = e.target

    const val = type === 'number' ? parseFloat(value) : value;

    this.setState({
      [name]: val
    })
  }

  uploadFile = async e => {
    const files = e.target.files;
    const data = new FormData();
    data.append('file', files[0]);
    data.append('upload_preset', 'sickfits');

    const res = await fetch('https://api.cloudinary.com/v1_1/j5jg88sgjlj/image/upload', {
      method: 'POST',
      body: data
    })

    const file = await res.json();

    console.log(file)
    this.setState({
      image: file.secure_url,
      largeImage: file.eager[0].secure_url
    })
  }

  render() {
    return (
      <Mutation mutation={CREATE_ITEM_MUTATION} variables={this.state}>
        {(createItem, { loading, error }) => (
          <Form onSubmit={async e => {
            e.preventDefault();
            const res = await createItem();
            Router.push({
              pathname: '/id',
              query: { id: res.data.createItem.id }
            })
          }}>
            <Error error={error} />
            <fieldset disabled={loading} aria-busy={loading}>
            <label htmlFor="file">
                File
                <input
                  type="file"
                  id="file"
                  name="file"
                  placeholder="Upload an image"
                  required
                  onChange={this.uploadFile}
                />
              </label>
              {this.state.image && <img src={this.state.image} width="200" alt="Upload Preview" />}
              <label htmlFor="title">
                Title
                <input
                  type="text"
                  id="title"
                  name="title"
                  placeholder="Title"
                  required
                  value={this.state.title}
                  onChange={this.handleChange}
                />
              </label>

              <label htmlFor="price">
                Price
                <input
                  type="number"
                  id="price"
                  name="price"
                  placeholder="Price"
                  required
                  value={this.state.price}
                  onChange={this.handleChange}
                />
              </label>

              <label htmlFor="title">
                Description
                <textarea
                  id="description"
                  name="description"
                  placeholder="Description"
                  required
                  value={this.state.description}
                  onChange={this.handleChange}
                />
              </label>
              <button type="submit">Submit</button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    );
  }
}

export default CreateItem;
export { CREATE_ITEM_MUTATION };