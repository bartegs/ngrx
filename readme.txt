229 - NgRx
NgRx - state management solution.
State - data that changes overtime, possibly reflected on UI.

230 - building blocks
1. Store - this is where data is stored, component can read data from the store
2. Selector (optional) - used to provide only a part of the overall store to the components, limit what is accesible
3. Action - dispatch actions, which describe changes that should be performed. Standardized messages "events" to which reducers can listen
4. Reducer - contains state changing logic. (eg. increment counter by 1)
5. Effects - side-effects that should be triggered for certain actions (eg. send http req)

231 - setup
ng add @ngrx/store

232 - First reducer and store setup. Setup reducer and register it.

A - module

@NgModule({
  declarations: [
    AppComponent,
    CounterOutputComponent,
    CounterControlsComponent,
  ],
  imports: [
    BrowserModule,
    StoreModule.forRoot({
      counter: counterReducer,
      // secondPartOfState: anotherReducer
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})

>>counter.reducer.ts

import { createReducer } from '@ngrx/store';

const initialState = 0;

export const counterReducer = createReducer(initialState);

B - standalone

>> main.ts

boorstrapApplication(AppComponent, {
  providers: [provideStore({
    counter: counterReducer
  })]
})

233 - alternate way to create reducer - older syntax

export function counterReducer(state = initialState) {
  return state;
}

234 - inject store
That's the global store.


>>counter-output.component.ts
  public count$: Observable<number>;

//inject store
//select method to get the value of a given reducer as an observable
//the key 'counter' is the key from app.module

  constructor(private store: Store<{ counter: number }>) {
    this.count$ = store.select('counter');
  }

>>counter-output.component.html
<div *ngIf="count$ | async as count">
  <p class="counter">{{ count }}</p>
  <p class="counter">Double: {{ count * 2 }}</p>
</div>

235 - create actions
create action:

>>counter.actions.ts
export const increment = createAction('[Counter] Increment');

connect action to the reducer and
>>counter.reducer.ts
export const counterReducer = createReducer(
  initialState,
  on(increment, (state) => state + 1)
);

dispatch action
>>counter-controls.component.ts
  increment() {
    this.store.dispatch(increment());
  }