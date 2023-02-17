/*
 * @flow
 */

import { call, put, takeEvery } from '@redux-saga/core/effects';
import type { Saga } from '@redux-saga/core';
import type { SequenceAction } from 'redux-reqseq';

import * as StudyApi from '../../../core/api/study';
import {
  CANDIDATE,
  ID,
  PARTICIPANT_ID,
  PARTICIPATION_STATUS,
  ParticipationStatuses,
  STUDY_ID,
} from '../../../common/constants';
import { Logger, toSagaError } from '../../../common/utils';
import { REGISTER_PARTICIPANT, registerParticipant } from '../actions';
import type { WorkerResponse } from '../../../common/types';

const LOG = new Logger('StudySagas');

function* registerParticipantWorker(action :SequenceAction) :Saga<WorkerResponse> {

  let workerResponse :WorkerResponse;
  const { id, type, value } = action;

  try {
    yield put(registerParticipant.request(id, value));
    const participant = {
      [CANDIDATE]: {},
      [PARTICIPANT_ID]: value[PARTICIPANT_ID],
      [PARTICIPATION_STATUS]: ParticipationStatuses.ENROLLED,
    };
    const candidateId = yield call(StudyApi.registerParticipant, value[STUDY_ID], participant);
    participant[CANDIDATE][ID] = candidateId;
    workerResponse = { data: participant };
    yield put(registerParticipant.success(id, participant));
  }
  catch (error) {
    LOG.error(type, error);
    workerResponse = { error };
    yield put(registerParticipant.failure(id, toSagaError(error)));
  }
  finally {
    yield put(registerParticipant.finally(id));
  }

  return workerResponse;
}

function* registerParticipantWatcher() :Saga<*> {

  yield takeEvery(REGISTER_PARTICIPANT, registerParticipantWorker);
}

export {
  registerParticipantWorker,
  registerParticipantWatcher,
};
