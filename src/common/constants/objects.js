/*
 * @flow
 */
import { RequestStates } from 'redux-reqseq';

import {
  ERROR,
  REQUEST_STATE,
} from './strings';

import type {
  AppComponent,
  AppUsageFreqType,
  DeleteTypesEnum,
  EnrollmentStatusEnum,
  IOSSensorType,
  LanguageCodesEnum,
  ParticipantDataType,
  ParticipationStatusesEnum,
  PermissionTypesEnum,
  StudySettingTypesEnum,
  TimeUseDiaryDataType,
  UpdateTypesEnum,
} from '../types';

export const AppUsageFreqTypes :{| ...AppUsageFreqType |} = Object.freeze({
  HOURLY: 'HOURLY',
  DAILY: 'DAILY'
});

export const AppComponents :{|...AppComponent |} = Object.freeze({
  CHRONICLE: 'CHRONICLE',
  CHRONICLE_DATA_COLLECTION: 'CHRONICLE_DATA_COLLECTION',
  CHRONICLE_SURVEYS: 'CHRONICLE_SURVEYS',
  IOS_SENSOR: 'IOS_SENSOR',
  TIME_USE_DIARY: 'TIME_USE_DIARY'
});

export const AppFeatures = {
  ANDROID: 'Android Data Collection',
  IOS_SENSOR: 'iOS Data Collection',
  TIME_USE_DIARY: 'Time Use Diary',
  SURVEYS: 'Custom Surveys'
};

export const DeleteTypes :{| ...DeleteTypesEnum |} = Object.freeze({
  HARD: 'Hard',
  Hard: 'Hard',
  SOFT: 'Soft',
  Soft: 'Soft',
});

export const EnrollmentStatuses :{|...EnrollmentStatusEnum |} = Object.freeze({
  DELETE: 'DELETE',
  ENROLLED: 'ENROLLED',
  NOT_ENROLLED: 'NOT_ENROLLED'
});

export const IOSSensorTypes :{| ...IOSSensorType |} = Object.freeze({
  DEVICE_USAGE: 'deviceUsage',
  KEYBOARD_METRICS: 'keyboardMetrics',
  MESSAGES_USAGE: 'messagesUsage',
  PHONE_USAGE: 'phoneUsage'
});

export const LanguageCodes :{| ...LanguageCodesEnum |} = Object.freeze({
  ENGLISH: 'en',
  GERMAN: 'de',
  SPANISH: 'es',
  SWEDISH: 'sv',
});

export const ParticipationStatuses :{| ...ParticipationStatusesEnum |} = Object.freeze({
  ENROLLED: 'ENROLLED',
  NOT_ENROLLED: 'NOT_ENROLLED',
  PAUSED: 'PAUSED',
  UNKNOWN: 'UNKNOWN',
});

export const ParticipantDataTypes :{| ...ParticipantDataType |} = Object.freeze({
  USAGE_EVENTS: 'UsageEvents',
  IOS_SENSOR: 'IOSSensor',
  PREPROCESSED: 'Preprocessed',
  APP_USAGE_SURVEY: 'AppUsageSurvey',
  TIME_USE_DIARY: 'TimeUseDiary',
});

export const PermissionTypes :{| ...PermissionTypesEnum |} = Object.freeze({
  DISCOVER: 'DISCOVER',
  INTEGRATE: 'INTEGRATE',
  LINK: 'LINK',
  MATERIALIZE: 'MATERIALIZE',
  OWNER: 'OWNER',
  READ: 'READ',
  WRITE: 'WRITE',
});

export const RS_INITIAL_STATE = {
  [ERROR]: false,
  [REQUEST_STATE]: RequestStates.STANDBY,
};

export const StudySettingTypes :{| ...StudySettingTypesEnum |} = Object.freeze({
  DATA_COLLECTION: 'DataCollection',
  NOTIFICATIONS: 'Notifications',
  SENSOR: 'Sensor',
  SURVEY: 'Survey',
  TIME_USE_DIARY: 'TimeUseDiary',
});

export const TimeUseDiaryDataTypes :{| ...TimeUseDiaryDataType |} = Object.freeze({
  DAYTIME: 'DayTime',
  NIGHTTIME: 'NightTime',
  SUMMARIZED: 'Summarized',
});

export const UpdateTypes :{| ...UpdateTypesEnum |} = Object.freeze({
  MERGE: 'Merge',
  Merge: 'Merge',
  PARTIAL_REPLACE: 'PartialReplace',
  PartialReplace: 'PartialReplace',
  REPLACE: 'Replace',
  Replace: 'Replace',
});
