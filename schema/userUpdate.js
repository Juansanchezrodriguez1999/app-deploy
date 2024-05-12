import * as yup from 'yup';

const schema = yup
  .object()
  .shape({
    fullname: yup.string().min(4),
    researchGroup: yup.array().min(1),
    password: yup.string().min(4),
    confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match'),
  })
  .required();

export default schema;
