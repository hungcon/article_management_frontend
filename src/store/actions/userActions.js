const signIn = (currentUser) => ({
  type: 'SIGN_IN',
  currentUser,
});

const signOut = () => ({
  type: 'SIGN_OUT',
});

export default {
  signIn,
  signOut,
};
