import update from "immutability-helper";

const actions = {
  setLoading: loading => ({ setState, getState }) => {
    const state = getState();
    const newState = update(state, {
      ui: {
        loading: { $set: loading }
      }
    });
    setState(newState);
  }
};

export default actions;
