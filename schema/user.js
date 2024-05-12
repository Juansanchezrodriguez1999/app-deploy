import * as yup from 'yup';

const schema = yup
  .object()
  .shape({
    email: yup.string().required().email('This field must be an e-mail address'),
    username: yup.string().required().min(4),
    fullname: yup.string().required().min(4),
    password: yup.string().required().min(4),
    confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match'),
    role: yup.string().oneOf(['user', 'admin']).default('user'),
    createdAt: yup.date().default(() => new Date()),
    updatedAt: yup.date().default(() => new Date()),
  })
  .required();

export default schema;
