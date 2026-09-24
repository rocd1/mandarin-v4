import { ApiError } from '../errors/api-error.models';

export interface IdleRequestState {
  status: 'idle';
}

export interface LoadingRequestState {
  status: 'loading';
}

export interface SuccessRequestState<T> {
  status: 'success';
  data: T;
}

export interface ErrorRequestState {
  status: 'error';
  error: ApiError;
}

export type RequestState<T> =
  | IdleRequestState
  | LoadingRequestState
  | SuccessRequestState<T>
  | ErrorRequestState;