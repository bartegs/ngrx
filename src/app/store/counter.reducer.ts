import { createReducer, on } from '@ngrx/store';
import { increment } from './counter.actions';

const initialState = 1;

export const counterReducer = createReducer(
  initialState,
  on(increment, (state) => state + 1)
);
