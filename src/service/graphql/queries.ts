import gql from 'graphql-tag';

export const CURRENT_USER_QUERY = gql`
  query {
    me {
      id
      uid
      name
      email
      profilePicture
      birthdate
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_PROFILE_MUTATION = gql`
  mutation updateProfile($data: UpdateUserProfileInput!) {
    updateProfile(data: $data) {
      id
      uid
      name
      email
      profilePicture
      birthdate
      createdAt
      updatedAt
    }
  }
`;
