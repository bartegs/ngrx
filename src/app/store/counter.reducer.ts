import { createReducer, on } from "@ngrx/store";
import { decrement, increment, set } from "./counter.actions";

const initialState = 0;

export const counterReducer = createReducer(
  initialState,
  on(increment, (state, action) => state + action.value),
  on(decrement, (state, action) => state - action.value),
  on(set, (state, action) => action.value)
);

// export function counterReducer(state = initialState, action: CounterActions | Action) {
//   if (action.type === INCREMENT) {
//     return state + action!.value;
//   }
//   return state;
// }
