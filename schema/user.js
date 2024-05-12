import * as yup from 'yup';

const schema = yup
  .object()
  .shape({
    email: yup.string().required('Email is required').email('This field must be an e-mail address'),
    username: yup.string().required('Username is required').min(4),
    fullname: yup.string().required('Fullname is required').min(4),
    password: yup.string().required('Password is required').min(4),
    confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match'),
    role: yup.string().default('user'),
    createdAt: yup.date().default(() => new Date()),
    updatedAt: yup.date().default(() => new Date()),
  });

export default schema;
