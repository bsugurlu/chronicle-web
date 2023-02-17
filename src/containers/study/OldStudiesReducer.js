/*
 * @flow
 */
// DELETEME

// import {
//   Map,
//   Set,
//   fromJS,
// } from 'immutable';
// import { RequestStates } from 'redux-reqseq';
// import type { SequenceAction } from 'redux-reqseq';
//
// import {
//   ADD_PARTICIPANT,
//   CHANGE_ENROLLMENT_STATUS,
//   CREATE_NOTIFICATIONS_ENTITY_SETS,
//   CREATE_PARTICIPANTS_ENTITY_SET,
//   CREATE_STUDY,
//   DELETE_STUDY,
//   GET_NOTIFICATIONS_EKID,
//   GET_STUDIES,
//   GET_STUDY_NOTIFICATION_STATUS,
//   GET_STUDY_PARTICIPANTS,
//   GET_TIME_USE_DIARY_STUDIES,
//   REMOVE_STUDY_ON_DELETE,
//   UPDATE_STUDY,
//   addStudyParticipant,
//   changeEnrollmentStatus,
//   createNotificationsEntitySets,
//   createParticipantsEntitySet,
//   createStudy,
//   deleteStudy,
//   getNotificationsEntity,
//   getStudies,
//   getStudyNotificationStatus,
//   getStudyParticipants,
//   getTimeUseDiaryStudies,
//   updateStudy,
// } from './StudiesActions';
//
// import { RESET_REQUEST_STATE } from '../../core/redux/ReduxActions';
// import { STUDIES_REDUX_CONSTANTS } from '../../utils/constants/ReduxConstants';
// import { COLUMN_FIELDS } from '../study/constants/tableColumns';
//
// const { REQUEST_STATE } = ReduxConstants;
//
// const {
//   NOTIFICATIONS_EKID,
//   NOTIFICATIONS_ENABLED_STUDIES,
//   PART_OF_ASSOCIATION_EKID_MAP,
//   STUDIES,
//   TIMEOUT,
//   TIME_USE_DIARY_STUDIES
// } = STUDIES_REDUX_CONSTANTS;
//
// const { ENROLLMENT_STATUS } = COLUMN_FIELDS;
//
// const INITIAL_STATE :Map<*, *> = fromJS({
//   [ADD_PARTICIPANT]: { [REQUEST_STATE]: RequestStates.STANDBY },
//   [CREATE_NOTIFICATIONS_ENTITY_SETS]: { [REQUEST_STATE]: RequestStates.STANDBY },
//   [CREATE_STUDY]: { [REQUEST_STATE]: RequestStates.STANDBY },
//   [CREATE_PARTICIPANTS_ENTITY_SET]: { [REQUEST_STATE]: RequestStates.STANDBY },
//   [DELETE_STUDY]: { [REQUEST_STATE]: RequestStates.STANDBY },
//   [GET_NOTIFICATIONS_EKID]: { [REQUEST_STATE]: RequestStates.STANDBY },
//   [GET_STUDIES]: { [REQUEST_STATE]: RequestStates.STANDBY },
//   [GET_STUDY_PARTICIPANTS]: { [REQUEST_STATE]: RequestStates.STANDBY },
//   [GET_STUDY_NOTIFICATION_STATUS]: { [REQUEST_STATE]: RequestStates.STANDBY },
//   [GET_TIME_USE_DIARY_STUDIES]: { [REQUEST_STATE]: RequestStates.STANDBY },
//   [UPDATE_STUDY]: { [REQUEST_STATE]: RequestStates.STANDBY },
//   [NOTIFICATIONS_EKID]: undefined,
//   [NOTIFICATIONS_ENABLED_STUDIES]: Set(),
//   [PART_OF_ASSOCIATION_EKID_MAP]: Map(),
//   [STUDIES]: Map(),
//   [TIME_USE_DIARY_STUDIES]: Set(),
//   participantEntitySetIds: Map(),
//   participants: Map(),
// });
//
// export default function studiesReducer(state :Map<*, *> = INITIAL_STATE, action :Object) {
//
//   switch (action.type) {
//
//     case RESET_REQUEST_STATE: {
//       const { actionType } = action;
//       if (actionType && state.has(actionType)) {
//         return state.setIn([actionType, REQUEST_STATE], RequestStates.STANDBY);
//       }
//       return state;
//     }
//
//     case REMOVE_STUDY_ON_DELETE: {
//       const { studyId } = action;
//       return state.deleteIn([STUDIES, studyId]);
//     }
//
//     case getStudies.case(action.type): {
//       return getStudies.reducer(state, action, {
//         REQUEST: () => state.setIn([GET_STUDIES, REQUEST_STATE], RequestStates.PENDING),
//         SUCCESS: () => state
//           .set(STUDIES, fromJS(action.value))
//           .setIn([GET_STUDIES, REQUEST_STATE], RequestStates.SUCCESS),
//         FAILURE: () => state
//           .set(STUDIES, Map())
//           .setIn([GET_STUDIES, REQUEST_STATE], RequestStates.FAILURE),
//       });
//     }
//
//     case createStudy.case(action.type): {
//       const seqAction :SequenceAction = action;
//       return createStudy.reducer(state, action, {
//         REQUEST: () => state
//           .setIn([CREATE_STUDY, REQUEST_STATE], RequestStates.PENDING)
//           .setIn([CREATE_STUDY, seqAction.id], seqAction),
//         SUCCESS: () => {
//           if (state.hasIn([CREATE_STUDY, seqAction.id])) {
//             const {
//               notificationsEKID,
//               notificationsEnabled,
//               partOfEntityKeyId,
//               studyEntity,
//               studyId
//             } = seqAction.value;
//
//             const notificationEnabledStudies = state.get(NOTIFICATIONS_ENABLED_STUDIES, Set());
//
//             return state
//               .set(NOTIFICATIONS_ENABLED_STUDIES,
//                 notificationsEnabled ? notificationEnabledStudies.add(studyId) : notificationEnabledStudies)
//               .set(NOTIFICATIONS_EKID, notificationsEKID)
//               .setIn([STUDIES, studyId], fromJS(studyEntity))
//               .setIn([PART_OF_ASSOCIATION_EKID_MAP, studyId], partOfEntityKeyId)
//               .setIn([CREATE_STUDY, REQUEST_STATE], RequestStates.SUCCESS);
//           }
//           return state;
//         },
//         FAILURE: () => state.setIn([CREATE_STUDY, REQUEST_STATE], RequestStates.FAILURE),
//         FINALLY: () => state.deleteIn([CREATE_STUDY, seqAction.id]),
//       });
//     }
//
//     case updateStudy.case(action.type): {
//       const seqAction :SequenceAction = action;
//       return updateStudy.reducer(state, action, {
//         REQUEST: () => state.setIn([UPDATE_STUDY, REQUEST_STATE], RequestStates.PENDING),
//         SUCCESS: () => {
//           const {
//             notificationsEKID,
//             notificationsEnabled,
//             partOfEntityKeyId,
//             studyEntityData,
//             studyId
//           } = seqAction.value;
//
//           let notificationEnabledStudies = state.get(NOTIFICATIONS_ENABLED_STUDIES, Set()).asMutable();
//
//           if (notificationsEnabled) {
//             notificationEnabledStudies = notificationEnabledStudies.add(studyId);
//           }
//           else {
//             notificationEnabledStudies = notificationEnabledStudies.delete(studyId);
//           }
//
//           return state
//             .set(NOTIFICATIONS_ENABLED_STUDIES, notificationEnabledStudies.asImmutable())
//             .set(NOTIFICATIONS_EKID, notificationsEKID)
//             .setIn([STUDIES, studyId], fromJS(studyEntityData))
//             .setIn([PART_OF_ASSOCIATION_EKID_MAP, studyId], partOfEntityKeyId)
//             .setIn([UPDATE_STUDY, REQUEST_STATE], RequestStates.SUCCESS);
//         },
//         FAILURE: () => state.setIn([UPDATE_STUDY, REQUEST_STATE], RequestStates.FAILURE)
//       });
//     }
//
//     case addStudyParticipant.case(action.type): {
//       const seqAction :SequenceAction = action;
//       return addStudyParticipant.reducer(state, action, {
//         REQUEST: () => state.setIn([ADD_PARTICIPANT, REQUEST_STATE], RequestStates.PENDING),
//         FAILURE: () => state.setIn([ADD_PARTICIPANT, REQUEST_STATE], RequestStates.FAILURE),
//         SUCCESS: () => {
//           const { newParticipant, participantEntityKeyId, studyId } = seqAction.value;
//
//           return state
//             .setIn([ADD_PARTICIPANT, REQUEST_STATE], RequestStates.SUCCESS)
//             .setIn(['participants', studyId, participantEntityKeyId], fromJS(newParticipant));
//         }
//       });
//     }
//
//     case createParticipantsEntitySet.case(action.type): {
//       const seqAction :SequenceAction = action;
//       return createParticipantsEntitySet.reducer(state, action, {
//         REQUEST: () => state.setIn([CREATE_PARTICIPANTS_ENTITY_SET, REQUEST_STATE], RequestStates.PENDING),
//         FAILURE: () => state.setIn([CREATE_PARTICIPANTS_ENTITY_SET, REQUEST_STATE], RequestStates.FAILURE),
//         SUCCESS: () => {
//           const { entitySetName, entitySetId } = seqAction.value;
//           const updatedMap = state.get('participantEntitySetIds').set(entitySetName, entitySetId);
//           return state
//             .setIn([CREATE_PARTICIPANTS_ENTITY_SET, REQUEST_STATE], RequestStates.SUCCESS)
//             .set('participantEntitySetIds', updatedMap);
//         }
//       });
//     }
//
//     case getStudyParticipants.case(action.type): {
//       const seqAction :SequenceAction = action;
//       return getStudyParticipants.reducer(state, action, {
//         REQUEST: () => state.setIn([GET_STUDY_PARTICIPANTS, REQUEST_STATE], RequestStates.PENDING),
//         FAILURE: () => state.setIn([GET_STUDY_PARTICIPANTS, REQUEST_STATE], RequestStates.FAILURE),
//         SUCCESS: () => {
//           const {
//             participants,
//             participantsEntitySetId,
//             participantsEntitySetName,
//             studyId,
//           } = seqAction.value;
//           return state
//             .setIn(['participants', studyId], participants)
//             .setIn(['participantEntitySetIds', participantsEntitySetName], participantsEntitySetId)
//             .setIn([GET_STUDY_PARTICIPANTS, REQUEST_STATE], RequestStates.SUCCESS);
//         }
//       });
//     }
//
//     case changeEnrollmentStatus.case(action.type): {
//       const seqAction :SequenceAction = action;
//       return changeEnrollmentStatus.reducer(state, action, {
//         REQUEST: () => state.setIn([CHANGE_ENROLLMENT_STATUS, REQUEST_STATE], RequestStates.PENDING),
//         FAILURE: () => state.setIn([CHANGE_ENROLLMENT_STATUS, REQUEST_STATE], RequestStates.FAILURE),
//         SUCCESS: () => {
//           const {
//             newEnrollmentStatus,
//             participantEntityKeyId,
//             studyId
//           } = seqAction.value;
//           return state
//             .setIn(['participants', studyId, participantEntityKeyId, ENROLLMENT_STATUS], [newEnrollmentStatus])
//             .setIn([CHANGE_ENROLLMENT_STATUS, REQUEST_STATE], RequestStates.SUCCESS);
//         }
//       });
//     }
//
//     case createNotificationsEntitySets.case(action.type): {
//       return createNotificationsEntitySets.reducer(state, action, {
//         REQUEST: () => state.setIn([CREATE_NOTIFICATIONS_ENTITY_SETS, REQUEST_STATE], RequestStates.PENDING),
//         FAILURE: () => state.setIn([CREATE_NOTIFICATIONS_ENTITY_SETS, REQUEST_STATE], RequestStates.FAILURE),
//         SUCCESS: () => state.setIn([CREATE_NOTIFICATIONS_ENTITY_SETS, REQUEST_STATE], RequestStates.SUCCESS)
//       });
//     }
//
//     case getStudyNotificationStatus.case(action.type): {
//       const seqAction :SequenceAction = action;
//       return getStudyNotificationStatus.reducer(state, action, {
//         REQUEST: () => state.setIn([GET_STUDY_NOTIFICATION_STATUS, REQUEST_STATE], RequestStates.PENDING),
//         FAILURE: () => state.setIn([GET_STUDY_NOTIFICATION_STATUS, REQUEST_STATE], RequestStates.FAILURE),
//         SUCCESS: () => {
//           const { studiesWithNotifications, associationEKIDMap } = seqAction.value;
//           return state
//             .set(NOTIFICATIONS_ENABLED_STUDIES, studiesWithNotifications)
//             .set(PART_OF_ASSOCIATION_EKID_MAP, associationEKIDMap)
//             .setIn([GET_STUDY_NOTIFICATION_STATUS, REQUEST_STATE], RequestStates.SUCCESS);
//         }
//       });
//     }
//
//     case getNotificationsEntity.case(action.type): {
//       return getNotificationsEntity.reducer(state, action, {
//         REQUEST: () => state.setIn([GET_NOTIFICATIONS_EKID, REQUEST_STATE], RequestStates.PENDING),
//         FAILURE: () => state.setIn([GET_NOTIFICATIONS_EKID, REQUEST_STATE], RequestStates.FAILURE),
//         SUCCESS: () => {
//           const { entityKeyId } = action.value;
//           return state
//             .set(NOTIFICATIONS_EKID, entityKeyId)
//             .setIn([GET_NOTIFICATIONS_EKID, REQUEST_STATE], RequestStates.SUCCESS);
//         }
//       });
//     }
//
//     case getTimeUseDiaryStudies.case(action.type): {
//       return getTimeUseDiaryStudies.reducer(state, action, {
//         REQUEST: () => state
//           .setIn([GET_TIME_USE_DIARY_STUDIES, REQUEST_STATE], RequestStates.PENDING)
//           .setIn([GET_TIME_USE_DIARY_STUDIES, action.id], action),
//         FAILURE: () => state.setIn([GET_TIME_USE_DIARY_STUDIES, REQUEST_STATE], RequestStates.FAILURE),
//         SUCCESS: () => state
//           .setIn([GET_TIME_USE_DIARY_STUDIES, REQUEST_STATE], RequestStates.SUCCESS)
//           .set(TIME_USE_DIARY_STUDIES, action.value),
//         FINALLY: () => state.deleteIn([GET_TIME_USE_DIARY_STUDIES, action.id])
//       });
//     }
//
//     case deleteStudy.case(action.type): {
//       return deleteStudy.reducer(state, action, {
//         REQUEST: () => state.setIn([DELETE_STUDY, REQUEST_STATE], RequestStates.PENDING),
//         FAILURE: () => state.setIn([DELETE_STUDY, REQUEST_STATE], RequestStates.FAILURE),
//         SUCCESS: () => state.setIn([DELETE_STUDY, REQUEST_STATE], RequestStates.SUCCESS)
//       });
//     }
//
//     default:
//       return state;
//   }
// }
