import * as Yup from 'yup';

export const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

export const signupSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .required('Name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password is required'),
});

export const newGroupSchema= Yup.object().shape({
  groupName: Yup.string().min(2, 'Group name must be at least 2 characters').required('Group name is required'),

  searchFriends: Yup.string().min('2, Enter atleast 2 character for suggestion'),

  selectedUsers: Yup.array()
  .min(1, "You must select at least 1 user")
  .required("Members are required"),
})