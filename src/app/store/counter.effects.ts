import { Actions, createEffect, ofType } from "@ngrx/effects";
import { decrement, increment } from "./counter.actions";
import { tap } from "rxjs";
import { Injectable } from "@angular/core";

@Injectable()
export class CounterEffects {
  constructor(private actions$: Actions) {}

  public saveCount = createEffect(
    () =>
      this.actions$.pipe(
        // all actions
        ofType(increment, decrement), // filter to specific actions
        tap((action) => {
          console.log(action);
          localStorage.setItem("count", action.value.toString());
        })
      ),
    { dispatch: false } // inform that this effect doesn't dispatch  another action
  );
}
