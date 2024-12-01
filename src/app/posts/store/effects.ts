import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';
import { PostsService } from '../services/posts.service';
import * as PostsActions from './actions';

@Injectable()
export class PostsEffects {
  private actions$ = inject(Actions);

  private postsService = inject(PostsService);

  getPosts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PostsActions.getPosts),
      mergeMap(() => {
        return this.postsService.getPosts().pipe(
          map((posts) => PostsActions.getPostsSuccess({posts})),
          catchError((error) =>
            of(PostsActions.getPostsFailure({error: error.message}))
          )
        );
      })
    )
  );
}
