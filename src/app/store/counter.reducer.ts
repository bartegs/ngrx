import { createReducer, on } from "@ngrx/store";
import { increment } from "./counter.actions";

const initialState = 1;

export const counterReducer = createReducer(
  initialState,
  on(increment, (state, action) => state + action.value)
);

// export function counterReducer(state = initialState, action: CounterActions | Action) {
//   if (action.type === INCREMENT) {
//     return state + action!.value;
//   }
//   return state;
// }
