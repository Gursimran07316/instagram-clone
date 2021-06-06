export default (state, action) => {
  switch (action.type) {
    case "USER":
      return action.payload;
    case "CLEAR":
      return null;
    case "UPDATE":
      return {
        ...state,
        followers: action.payload.followers,
        following: action.payload.following,
      };
    case "UPDATEPIC":
      return {
        ...state,
        img: action.payload,
      };
    default:
      return state;
  }
};
