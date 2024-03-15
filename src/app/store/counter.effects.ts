import { Actions, createEffect, ofType } from "@ngrx/effects";
import { decrement, increment } from "./counter.actions";
import { tap, withLatestFrom } from "rxjs";
import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { selectCount } from "./counter.selectors";

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
        withLatestFrom(this.store.select(selectCount)),
        tap(([action, counter]) => {
          console.log(action);
          console.log("counter: " + counter);
          localStorage.setItem("count", counter.toString());
        })
      ),
    { dispatch: false } // inform that this effect doesn't dispatch  another action
  );
}
