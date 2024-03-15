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

236 - attach data to actions

>>counter.actions.ts
export const increment = createAction(
  '[Counter] Increment',
  props<{ value: number }>()
);

>>counter.reducer.ts
export const counterReducer = createReducer(
  initialState,
  on(increment, (state, action) => state + action.value)
);

>>counter-controls.component.ts
  increment() {
    this.store.dispatch(increment({ value: 2 }));
  }

237 - handling actions without createReducer (old syntax)

>>counter.reducer.ts

export function counterReducer(state = initialState, action: CounterActions | Action) {
  if (action.type === INCREMENT) {
    return state + action!.value;
  }
  return state;
}

>>counter.actions.ts

const INCREMENT = "[Counter] Increment";

export class IncrementAction implements Action {
  readonly type = INCREMENT;

  constructor(public value: number) {}
}

export type Counter Actions = IncrementAction | DecrementAction;

>>counter-controls.component.ts
increment() {
  this.store.dispatch(new IncrementAction(2));
}

238 - selectors.
Use selectors to select desired parts of state

>>counter.selectors.ts

export const selectCount = (state: { counter: number }) => state.counter;
export const selectDoubleCount = createSelector(
  selectCount,
  (state) => state * 2
);


>>counter-output.component.ts
  
constructor(private store: Store<{ counter: number }>) {
  this.count$ = store.select(selectCount);
  this.doubleCount$ = store.select(selectDoubleCount);
}

239 - effects.

Side effect - anything that's not directly related to an immediate UI update

eg: http req, localStorage, log to console

avoid effects in reducers, logic in reducers has to be synchronous, no console.logs
should be focussed on state modifications

This is what effects are for.

setup:

ng add @ngrx/effects

240 - create effect

>>counter.effects.ts

@Injectable()
export class CounterEffects {
  constructor(private actions$: Actions) {}

  public saveCount = createEffect(
    () =>
      this.actions$.pipe( // all actions
        ofType(increment, decrement), // filter to specific actions
        tap((action) => {
          console.log(action);
          localStorage.setItem("count", action.value.toString());
        })
      ),
    { dispatch: false } // inform that this effect doesn't dispatch  another action
  );
}

old syntax:

@Injectable()
export class CounterEffects {
  @Effect({dispatch: false})
  
  constructor(private actions$: Actions) {}

  public saveCount = 
      this.actions$.pipe( // all actions
        ofType(increment, decrement), // filter to specific actions
        tap((action) => {
          console.log(action);
          localStorage.setItem("count", action.value.toString());
        })
      ),
}

241 - Register effect
>>app.module.ts

  EffectsModule.forRoot([CounterEffects]),

242 - using store data in effects

@Injectable()
export class CounterEffects {
  constructor(
    private actions$: Actions,
    private store: Store<{ counter: number }>
  ) {}

  public saveCount = createEffect(
    () =>
      this.actions$.pipe(
        // all actions
        ofType(increment, decrement), // filter to specific actions
        withLatestFrom(this.store.select(selectCount)), //combine action with store data
        tap(([action, counter]) => { //destructure what we recieve - action and store data (counter)
          console.log(action);
          console.log("counter: " + counter);
          localStorage.setItem("count", counter.toString());
        })
      ),
    { dispatch: false } // inform that this effect doesn't dispatch  another action
  );
}

243 - effect that uses localStorage to load initial data

>>app.component.ts - here the action is dispatched
  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(init());
  }

>>counter.actions.ts
export const init = createAction("[Counter] Init");

export const set = createAction("[Counter] Set", props<{ value: number }>());

>counter.reducer.ts - we determine how action modifies the state. Init action is not here, because it doesn't modify the state
export const counterReducer = createReducer(
  initialState,
  on(increment, (state, action) => state + action.value),
  on(decrement, (state, action) => state - action.value),
  on(set, (state, action) => action.value)
);

>counter.effects.ts
  public loadCount = createEffect(() =>
    this.actions$.pipe(
      ofType(init), // on init effect
      switchMap(() => { // we switch to pipeline
        const storedCounter = localStorage.getItem("count");
        if (storedCounter) {
          return of(set({ value: +storedCounter })); // trigger set action, we add of to make it an observable
        }
        return of(set({ value: 0 }));
      })
    )
  );
