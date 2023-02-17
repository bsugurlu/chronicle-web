// @flow

// import { put, takeEvery } from '@redux-saga/core/effects';
// import type { Saga } from '@redux-saga/core';
// import type { SequenceAction } from 'redux-reqseq';
//
// import {
//   CHANGE_ACTIVE_STATUS,
//   CREATE_QUESTIONNAIRE,
//   DELETE_QUESTIONNAIRE,
//   DOWNLOAD_QUESTIONNAIRE_RESPONSES,
//   GET_QUESTIONNAIRE,
//   GET_QUESTIONNAIRE_RESPONSES,
//   GET_STUDY_QUESTIONNAIRES,
//   SUBMIT_QUESTIONNAIRE,
//   changeActiveStatus,
//   createQuestionnaire,
//   deleteQuestionnaire,
//   downloadQuestionnaireResponses,
//   getQuestionnaire,
//   getQuestionnaireResponses,
//   getStudyQuestionnaires,
//   submitQuestionnaire,
// } from './QuestionnaireActions';
//
// import { Logger } from '../../common/utils';
//
// const LOG = new Logger('QuestionnaireSagas');
//
// /*
//  *
//  * QuestionnaireActions.changeActiveStatus()
//  *
//  */
// function* changeActiveStatusWorker(action :SequenceAction) :Saga<*> {
//   try {
//     yield put(changeActiveStatus.request(action.id));
//     const { activeStatus, studyEKID, questionnaireEKID } = action.value;
//
//     const questionnaireESID = yield select(selectESIDByCollection(SURVEY, AppModules.QUESTIONNAIRES));
//     const activePTID = yield select(selectPropertyTypeId(ACTIVE_FQN));
//
//     const response = yield call(updateEntityDataWorker, updateEntityData({
//       entitySetId: questionnaireESID,
//       entities: {
//         [questionnaireEKID]: {
//           [activePTID]: [activeStatus]
//         }
//       },
//       updateType: UpdateTypes.PARTIAL_REPLACE
//     }));
//     if (response.error) throw response.error;
//
//     yield put(changeActiveStatus.success(action.id, {
//       activeStatus, studyEKID, questionnaireEKID
//     }));
//   }
//   catch (error) {
//     LOG.error(action.type, error);
//     yield put(changeActiveStatus.failure(action.id));
//   }
//   finally {
//     yield put(changeActiveStatus.finally(action.id));
//   }
// }
//
// function* changeActiveStatusWatcher() :Saga<*> {
//   yield takeEvery(CHANGE_ACTIVE_STATUS, changeActiveStatusWorker);
// }
//
// /*
//  *
//  * QuestionnaireActions.deleteQuestionnaire()
//  *
//  */
//
// function* deleteQuestionnaireWorker(action :SequenceAction) :Saga<*> {
//   try {
//     yield put(deleteQuestionnaire.request(action.id));
//     const { studyEKID, questionnaireEKID } = action.value;
//
//     const questionnaireESID = yield select(selectESIDByCollection(SURVEY, AppModules.QUESTIONNAIRES));
//     const questionsESID = yield select(selectESIDByCollection(QUESTION, AppModules.QUESTIONNAIRES));
//
//     const neighborFilter = {
//       entityKeyIds: [questionnaireEKID],
//       destinationEntitySetIds: [],
//       sourceEntitySetIds: [questionsESID]
//     };
//
//     const response = yield call(deleteEntityAndNeighborDataWorker, deleteEntityAndNeighborData({
//       entitySetId: questionnaireESID,
//       filter: neighborFilter,
//       deleteType: DeleteTypes.HARD
//     }));
//
//     if (response.error) throw response.error;
//
//     yield put(deleteQuestionnaire.success(action.id, {
//       studyEKID,
//       questionnaireEKID
//     }));
//   }
//   catch (error) {
//     LOG.error(action.type, error);
//     yield put(deleteQuestionnaire.failure(action.id));
//   }
//   finally {
//     yield put(deleteQuestionnaire.finally(action.id));
//   }
// }
//
// function* deleteQuestionnaireWatcher() :Saga<*> {
//   yield takeEvery(DELETE_QUESTIONNAIRE, deleteQuestionnaireWorker);
// }
//
// /*
//  *
//  * QuestionnaireActions.createQuestionnaire()
//  *
//  */
//
// function* createQuestionnaireWorker(action :SequenceAction) :Saga<*> {
//   try {
//     yield put(createQuestionnaire.request(action.id));
//     const { studyEKID } = action.value;
//     let { formData } = action.value;
//
//     const entitySetIds = yield select(getSelectedOrgEntitySetIds());
//     const propertyTypeIds = yield select(selectPropertyTypeIds());
//
//     // generate rrule from form data
//     const rruleSet = createRecurrenceRuleSetFromFormData(formData);
//
//     // update formdata with rrule
//     let psk = getPageSectionKey(1, 1);
//     const eak = getEntityAddressKey(0, SURVEY, RRULE_FQN);
//     formData = setIn(formData, [psk, eak], rruleSet);
//
//     // remove notification schedule from form data
//     psk = getPageSectionKey(3, 1);
//     delete formData[psk];
//
//     // remove questionType key from form data
//     psk = getPageSectionKey(2, 1);
//     formData[psk].forEach((item) => {
//       /* eslint-disable-next-line no-param-reassign */
//       delete item.questionType;
//     });
//
//     const entityData = processEntityData(
//       formData,
//       entitySetIds,
//       propertyTypeIds
//     );
//
//     // associations
//     const associations = createQuestionnaireAssociations(formData, studyEKID);
//     const associationEntityData = processAssociationEntityData(
//       associations,
//       entitySetIds,
//       propertyTypeIds
//     );
//
//     const response = yield call(submitDataGraphWorker, submitDataGraph({ associationEntityData, entityData }));
//     if (response.error) throw response.error;
//
//     // reconstruct entity
//     const { entityKeyIds } = response.data;
//     const {
//       questionEntities,
//       questionnaireEntity
//     } = constructEntitiesFromFormData(formData, entityKeyIds, entitySetIds, propertyTypeIds);
//
//     yield put(createQuestionnaire.success(action.id, {
//       questionEntities,
//       questionnaireEntity,
//       studyEKID
//     }));
//   }
//   catch (error) {
//     LOG.error(action.type, error);
//     yield put(createQuestionnaire.failure(action.id));
//   }
//   finally {
//     yield put(createQuestionnaire.finally(action.id));
//   }
// }
//
// function* createQuestionnaireWatcher() :Saga<*> {
//   yield takeEvery(CREATE_QUESTIONNAIRE, createQuestionnaireWorker);
// }
//
// /*
//  *
//  * QuestionnaireActions.getQuestionnaire()
//  *
//  */
// function* getQuestionnaireWorker(action :SequenceAction) :Saga<*> {
//   try {
//     yield put(getQuestionnaire.request(action.id));
//     const { studyId, questionnaireId, organizationId } = action.value;
//
//     const response = yield call(ChronicleApi.getQuestionnaire, organizationId, studyId, questionnaireId);
//     if (response.error) throw response.error;
//
//     yield put(getQuestionnaire.success(action.id, fromJS(response.data)));
//   }
//   catch (error) {
//     LOG.error(action.type, error);
//     yield put(getQuestionnaire.failure(action.id));
//   }
//   finally {
//     yield put(getQuestionnaire.finally(action.id));
//   }
// }
//
// function* getQuestionnaireWatcher() :Saga<*> {
//   yield takeEvery(GET_QUESTIONNAIRE, getQuestionnaireWorker);
// }
//
// /*
//  *
//  * QuestionnaireActions.submitQuestionnaire()
//  *
//  */
//
// function* submitQuestionnaireWorker(action :SequenceAction) :Saga<*> {
//   try {
//     yield put(submitQuestionnaire.request(action.id));
//     const {
//       formData,
//       participantId,
//       studyId,
//       organizationId
//     } = action.value;
//     const questionAnswerMapping = getQuestionAnswerMapping(formData);
//
//     const response = yield call(
//       ChronicleApi.submitQuestionnaire, organizationId, studyId, participantId, questionAnswerMapping
//     );
//     if (response.error) throw response.error;
//
//     yield put(submitQuestionnaire.success(action.id));
//
//   }
//   catch (error) {
//     LOG.error(action.type, error);
//     yield put(submitQuestionnaire.failure(action.id));
//   }
//   finally {
//     yield put(submitQuestionnaire.finally(action.id));
//   }
// }
//
// function* submitQuestionnaireWatcher() :Saga<*> {
//   yield takeEvery(SUBMIT_QUESTIONNAIRE, submitQuestionnaireWorker);
// }
//
// /*
//  *
//  * QuestionnaireActions.getStudyQuestionnaires()
//  *
//  */
//
// function* getStudyQuestionnairesWorker(action :SequenceAction) :Saga<*> {
//   try {
//     yield put(getStudyQuestionnaires.request(action.id));
//     const studyEKID = action.value;
//
//     const questionnaireESID = yield select(selectESIDByCollection(SURVEY, AppModules.QUESTIONNAIRES));
//     const partOfESID = yield select(selectESIDByCollection(PART_OF, AppModules.CHRONICLE_CORE));
//     const studyESID = yield select(selectESIDByCollection(STUDIES, AppModules.CHRONICLE_CORE));
//     const questionsESID = yield select(selectESIDByCollection(QUESTION, AppModules.QUESTIONNAIRES));
//
//     /*
//      * STEP 1: filtered search to get questionnaires neighboring study
//      */
//
//     let response = yield call(
//       searchEntityNeighborsWithFilterWorker,
//       searchEntityNeighborsWithFilter({
//         entitySetId: studyESID,
//         filter: {
//           destinationEntitySetIds: [studyESID],
//           edgeEntitySetIds: [partOfESID],
//           entityKeyIds: [studyEKID],
//           sourceEntitySetIds: [questionnaireESID]
//         }
//       })
//     );
//     if (response.error) throw response.error;
//
//     // create questionnaireId -> questionnaire details map
//     const studyQuestionnaires = Map().withMutations((mutator) => {
//       fromJS(response.data).get(studyEKID, List()).forEach((neighbor) => {
//         const neighborId = neighbor.get('neighborId');
//         const details = neighbor.get('neighborDetails');
//
//         if (getIsValidQuestionnaireEntity(details)) {
//           mutator.set(neighborId, details);
//         }
//       });
//     });
//
//     /*
//      * STEP 2: filtered search to get questions neighboring questionnaires
//      */
//
//     const questionnaireToQuestionsMap = Map().asMutable();
//
//     if (!studyQuestionnaires.isEmpty()) {
//       response = yield call(
//         searchEntityNeighborsWithFilterWorker,
//         searchEntityNeighborsWithFilter({
//           entitySetId: questionnaireESID,
//           filter: {
//             destinationEntitySetIds: [questionnaireESID],
//             edgeEntitySetIds: [partOfESID],
//             entityKeyIds: studyQuestionnaires.keySeq().toJS(),
//             sourceEntitySetIds: [questionsESID]
//           }
//         })
//       );
//       if (response.error) throw response.error;
//
//       // create mapping from questionEKID -> questionId -> question details
//       fromJS(response.data).forEach((neighbors :List, questionnaireEKID :UUID) => {
//         const questions = neighbors.map((question) => question.get('neighborDetails'));
//         questionnaireToQuestionsMap.set(questionnaireEKID, questions);
//       });
//     }
//
//     yield put(getStudyQuestionnaires.success(action.id, {
//       questionnaireToQuestionsMap: questionnaireToQuestionsMap.asImmutable(),
//       studyQuestionnaires,
//       studyEKID
//     }));
//   }
//   catch (error) {
//     LOG.error(action.type, error);
//     yield put(getStudyQuestionnaires.failure(action.id));
//   }
//   finally {
//     yield put(getStudyQuestionnaires.finally(action.id));
//   }
// }
//
// function* getStudyQuestionnairesWatcher() :Saga<*> {
//   yield takeEvery(GET_STUDY_QUESTIONNAIRES, getStudyQuestionnairesWorker);
// }
//
// /*
//  *
//  * QuestionnaireActions.getQuestionnaireResponses()
//  *
//  */
//
// function* getQuestionnaireResponsesWorker(action :SequenceAction) :Saga<*> {
//   try {
//     yield put(getQuestionnaireResponses.request(action.id));
//     const { participantEKID, studyId } = action.value;
//
//     const answersESID = yield select(selectESIDByCollection(ANSWER, AppModules.QUESTIONNAIRES));
//     const addressesESID = yield select(selectESIDByCollection(ADDRESSES, AppModules.QUESTIONNAIRES));
//     const questionsESID = yield select(selectESIDByCollection(QUESTION, AppModules.QUESTIONNAIRES));
//     const respondsWithESID = yield select(selectESIDByCollection(RESPONDS_WITH, AppModules.QUESTIONNAIRES));
//
//     const participantESName = getParticipantsEntitySetName(studyId);
//     let response = yield call(getEntitySetIdWorker, getEntitySetId(participantESName));
//     if (response.error) throw response.error;
//
//     const participantESID = response.data;
//
//     /*
//      * STEP 1: filtered search to get answers neighboring participant
//      */
//
//     response = yield call(
//       searchEntityNeighborsWithFilterWorker,
//       searchEntityNeighborsWithFilter({
//         entitySetId: participantESID,
//         filter: {
//           destinationEntitySetIds: [answersESID],
//           edgeEntitySetIds: [respondsWithESID],
//           entityKeyIds: [participantEKID],
//           sourceEntitySetIds: [participantESID]
//         },
//       })
//     );
//     if (response.error) throw response.error;
//
//     // create a map of answerID -> answer value & timestamp.
//
//     const answersById = Map().withMutations((mutator) => {
//       fromJS(response.data).forEach((neighbors :List) => {
//         neighbors.forEach((neighbor) => {
//           const answerEKID = neighbor.get('neighborId');
//           mutator.set(answerEKID, fromJS({
//             [VALUES_FQN.toString()]: [neighbor.getIn(['neighborDetails', VALUES_FQN, 0])],
//             [DATE_TIME_FQN.toString()]: [neighbor.getIn(['associationDetails', DATE_TIME_FQN, 0])]
//           }));
//         });
//       });
//     });
//
//     /*
//      * STEP 2: filtered search to get questions associated with answers
//      */
//
//     const questionAnswersMap = Map().asMutable();
//     const answerQuestionIdMap = Map().asMutable();
//
//     if (!answersById.isEmpty()) {
//       response = yield call(
//         searchEntityNeighborsWithFilterWorker,
//         searchEntityNeighborsWithFilter({
//           entitySetId: answersESID,
//           filter: {
//             destinationEntitySetIds: [questionsESID],
//             edgeEntitySetIds: [addressesESID],
//             entityKeyIds: answersById.keySeq().toJS(),
//             sourceEntitySetIds: [answersESID]
//           },
//         })
//       );
//       if (response.error) throw response.error;
//
//       // create map question id -> set of answers associated
//       // each answer has at most one question associated, so we explore the first neighbor
//       fromJS(response.data).forEach((neighbors :List, answerId :UUID) => {
//         const questionId = neighbors.first().get('neighborId');
//
//         answerQuestionIdMap.set(answerId, questionId);
//         questionAnswersMap.updateIn([questionId], Set(), (result) => result.add(answerId));
//       });
//     }
//
//     yield put(getQuestionnaireResponses.success(action.id, {
//       answerQuestionIdMap: answerQuestionIdMap.asImmutable(),
//       answersById,
//       participantEKID,
//       questionAnswersMap: questionAnswersMap.asImmutable()
//     }));
//   }
//   catch (error) {
//     LOG.error(action.type, error);
//     yield put(getQuestionnaireResponses.failure(action.id));
//   }
//   finally {
//     yield put(getQuestionnaireResponses.finally(action.id));
//   }
// }
//
// function* getQuestionnaireResponsesWatcher() :Saga<*> {
//   yield takeEvery(GET_QUESTIONNAIRE_RESPONSES, getQuestionnaireResponsesWorker);
// }
//
// /*
//  *
//  * QuestionnaireActions.downloadQuestionnaireResponses()
//  *
//  */
//
// function* downloadQuestionnaireResponsesWorker(action :SequenceAction) :Saga<*> {
//   try {
//     yield put(downloadQuestionnaireResponses.request(action.id));
//     const {
//       questionnaireId,
//       participantEKID,
//       participantId,
//       questionnaireName
//     } = action.value;
//     const questions = yield select(
//       (state) => state.getIn(['questionnaire', QUESTIONNAIRE_QUESTIONS, questionnaireId], List())
//     );
//     const answersById = yield select(
//       (state) => state.getIn(['questionnaire', QUESTIONNAIRE_RESPONSES, participantEKID], Map())
//     );
//     const questionAnswersMap = yield select((state) => state.getIn(['questionnaire', QUESTION_ANSWERS_MAP], Map()));
//
//     let csvData :Object[] = [];
//
//     questions.forEach((question) => {
//       const questionId = question.getIn([OPENLATTICE_ID_FQN, 0]);
//       const answerIds :Set<UUID> = questionAnswersMap.get(questionId);
//
//       answerIds.forEach((answerId) => {
//         const csvObject :Object = {};
//         const date = answersById.getIn([answerId, DATE_TIME_FQN, 0]);
//         csvObject.Question = question.getIn([TITLE_FQN, 0]);
//         csvObject.Answer = answersById.getIn([answerId, VALUES_FQN, 0]);
//         csvObject.Date = date;
//
//         csvData.push(csvObject);
//       });
//     });
//
//     csvData = csvData
//       .sort((row1 :Object, row2 :Object) => {
//         if (row1.Date > row2.Date) return 1;
//         if (row1.Date < row2.Date) return -1;
//         return 0;
//       }).map((row) => {
//         const result = row;
//         result.Date = DateTime.fromISO(row.Date).toLocaleString(DateTime.DATETIME_SHORT_WITH_SECONDS);
//         return result;
//       });
//
//     const csv = Papa.unparse(csvData);
//     const blob = new Blob([csv], {
//       type: 'text/csv'
//     });
//     FS.saveAs(blob, getCsvFileName(questionnaireName, participantId));
//
//     yield put(downloadQuestionnaireResponses.success(action.id));
//   }
//   catch (error) {
//     LOG.error(action.type);
//     yield put(downloadQuestionnaireResponses.failure(action.id));
//   }
//   finally {
//     yield put(downloadQuestionnaireResponses.finally(action.id));
//   }
// }
//
// function* downloadQuestionnaireResponsesWatcher() :Saga<*> {
//   yield takeEvery(DOWNLOAD_QUESTIONNAIRE_RESPONSES, downloadQuestionnaireResponsesWorker);
// }
//
// export {
//   changeActiveStatusWatcher,
//   createQuestionnaireWatcher,
//   deleteQuestionnaireWatcher,
//   downloadQuestionnaireResponsesWatcher,
//   getQuestionnaireResponsesWatcher,
//   getQuestionnaireWatcher,
//   getStudyQuestionnairesWatcher,
//   submitQuestionnaireWatcher,
// };
