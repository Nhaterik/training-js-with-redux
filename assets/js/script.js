// Importing createStore from the Redux package hosted on Skypack
import { createStore } from 'https://cdn.skypack.dev/redux';

// Reducer function to handle state changes
function reducer(state = 0, action) {
    switch (action.type) {
        case 'increment':
            return state + action.payload;
        case 'decrease':
            return state - action.payload;
        default:
            return state;
    }
}

// Create a Redux store with the reducer
const store = createStore(reducer);
// Action creators
function increment(payload) {
    return { type: 'increment', payload  };
}

function decrease(payload) {
    return { type: 'decrease', payload  };
}
document.querySelector('.deposit').onclick= ()=> {
    store.dispatch(increment(10))
    render()
}
document.querySelector('.withdraw').onclick= ()=> {
    store.dispatch(decrease(10))
    render()
}
function render() {
    document.querySelector('.output').innerText=store.getState()
}
render()

