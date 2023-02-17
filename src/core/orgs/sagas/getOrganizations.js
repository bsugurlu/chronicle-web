/*
 * @flow
 */

import { call, put, takeEvery } from '@redux-saga/core/effects';
import { Map } from 'immutable';
import type { Saga } from '@redux-saga/core';
import type { SequenceAction } from 'redux-reqseq';

import * as OrganizationApi from '../../api/organization';
import { Logger, toSagaError } from '../../../common/utils';
import { GET_ORGANIZATIONS, getOrganizations } from '../actions';
import type { WorkerResponse } from '../../../common/types';

const LOG = new Logger('OrgsSagas');

function* getOrganizationsWorker(action :SequenceAction) :Saga<WorkerResponse> {

  let workerResponse :WorkerResponse;
  const { id, value } = action;

  try {
    yield put(getOrganizations.request(id, value));
    const response = yield call(OrganizationApi.getOrganizations);
    const organizations = Map().withMutations((mutableMap) => {
      response.forEach((org) => mutableMap.set(org.id, org));
    });
    workerResponse = { data: organizations };
    yield put(getOrganizations.success(id, organizations));
  }
  catch (error) {
    LOG.error(action.type, error);
    workerResponse = { error };
    yield put(getOrganizations.failure(id, toSagaError(error)));
  }
  finally {
    yield put(getOrganizations.finally(id));
  }

  return workerResponse;
}

function* getOrganizationsWatcher() :Saga<*> {

  yield takeEvery(GET_ORGANIZATIONS, getOrganizationsWorker);
}

export {
  getOrganizationsWorker,
  getOrganizationsWatcher,
};
