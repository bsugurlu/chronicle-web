// @flow

// import {
//   List,
//   Map,
//   fromJS,
//   get,
//   getIn,
//   setIn
// } from 'immutable';
// import { DataProcessingUtils } from 'lattice-fabricate';
// import { DateTime, Info } from 'luxon';
// import { RRule, RRuleSet } from 'rrule';
// import { v4 as uuid } from 'uuid';
//
// import QuestionTypes from '../constants/questionTypes';
// import {
//   OPENLATTICE_ID_FQN,
//   PART_OF,
//   QUESTION,
//   STUDIES,
//   SURVEY,
// } from '../../../common/constants';
// import { isNonEmptyString } from '../../../common/utils';
// import { QUESTIONNAIRE_SUMMARY } from '../constants/constants';
//
// const { getEntityAddressKey, getPageSectionKey, processEntityData } = DataProcessingUtils;
//
// const { TEXT_ENTRY } = QuestionTypes;
//
// const {
//   DESCRIPTION,
//   NUM_MULTIPLE_CHOICE,
//   NUM_SINGLE_ANSWER,
//   TITLE
// } = QUESTIONNAIRE_SUMMARY;
//
// const rruleWeekDayConsts = [RRule.MO, RRule.TU, RRule.WE, RRule.TH, RRule.FR, RRule.SA, RRule.SU];
//
// // return an Object with title, description, numMultipleChoice and numSingleAnswer questions
// const getQuestionnaireSummaryFromForm = (formData :Object = {}) => {
//   const result = {};
//
//   let psk = getPageSectionKey(1, 1);
//   // $FlowIgnore
//   let eak = getEntityAddressKey(0, SURVEY, NAME_FQN);
//   result[TITLE] = getIn(formData, [psk, eak]);
//
//   // $FlowIgnore
//   eak = getEntityAddressKey(0, SURVEY, DESCRIPTION_FQN);
//   result[DESCRIPTION] = getIn(formData, [psk, eak]);
//
//   psk = getPageSectionKey(2, 1);
//   const questions :Object[] = get(formData, psk);
//   const singleAnswerQuestions = questions.filter((question) => question.questionType === TEXT_ENTRY);
//
//   result[NUM_SINGLE_ANSWER] = singleAnswerQuestions.length;
//   result[NUM_MULTIPLE_CHOICE] = questions.length - singleAnswerQuestions.length;
//
//   return result;
// };
//
// // generate recurrence rules as defined in https://tools.ietf.org/html/rfc5545
// const createRecurrenceRuleSetFromFormData = (formData :Object) => {
//   const psk = getPageSectionKey(3, 1);
//
//   // $FlowFixMe
//   const mapper = Info.weekdays().reduce((result, day, index) => ({
//     ...result,
//     [day]: rruleWeekDayConsts[index]
//   }), {});
//
//   const daysOfWeek :string[] = getIn(formData, [psk, 'daysOfWeek']);
//   const rruleWeekDays = daysOfWeek.map((day) => mapper[day]);
//
//   const selectedTimes :string[] = getIn(formData, [psk, 'time'])
//     .map((time :Object) => get(time, 'time')); // TODO time const
//
//   const rruleSet = new RRuleSet();
//
//   // add rules to rruleset
//   selectedTimes.forEach((time) => {
//     const dateTime = DateTime.fromISO(time);
//
//     rruleSet.rrule(new RRule({
//       freq: RRule.WEEKLY,
//       byweekday: rruleWeekDays,
//       byhour: dateTime.hour,
//       byminute: dateTime.minute
//     }));
//   });
//   return rruleSet.toString();
// };
//
// // parse a rruleSet string and get days of week + times
// const getWeekDaysAndTimesFromRruleSet = (rruleSet :string) => {
//
//   const rrules :string[] = rruleSet.split('RRULE:').filter((token) => isNonEmptyString(token));
//   // get week days
//   // the days of the week are the same in all the individual rules in the rrruleSet,
//   // so we only need to parse the the first rrule
//   const rruleOptions = RRule.parseString(rrules[0]);
//   let weekdayOptions :?Object[] = rruleOptions.byweekday;
//   if (!weekdayOptions && rruleOptions.freq === RRule.DAILY) {
//     weekdayOptions = rruleWeekDayConsts;
//   }
//
//   // $FlowFixMe
//   const allWeekdays = Info.weekdays();
//   // $FlowFixMe
//   const weekdays = (weekdayOptions || [])
//     .map((day) => day.weekday)
//     .sort()
//     .map((index) => allWeekdays[index]);
//
//   // $FlowFixMe
//   const times = rrules
//     .map((rrule) => RRule.parseString(rrule))
//     .map((options) => DateTime.fromObject({ hour: options.byhour, minute: options.byminute }))
//     .map((date) => date.toLocaleString(DateTime.TIME_SIMPLE))
//     .sort();
//
//   return [weekdays, times];
// };
//
// const createPreviewQuestionEntities = (formData :Object) => {
//
//   const psk = getPageSectionKey(2, 1);
//   const questions :Object[] = get(formData, psk);
//
//   // $FlowIgnore
//   const valuesEAK = getEntityAddressKey(-1, QUESTION, VALUES_FQN);
//   // $FlowIgnore
//   const titleEAK = getEntityAddressKey(-1, QUESTION, TITLE_FQN);
//
//   const questionEntities = List().withMutations((list) => {
//     questions.forEach((question) => {
//       const questionEntity = fromJS({
//         [OPENLATTICE_ID_FQN]: [uuid()],
//         [TITLE_FQN.toString()]: [get(question, titleEAK)],
//         [VALUES_FQN.toString()]: get(question, valuesEAK, [])
//       });
//
//       list.push(questionEntity);
//     });
//   });
//
//   return questionEntities;
// };
//
// // return a array of:
// // 1) question -> partof -> questionnaire associations
// // 2) questionnaire -> partof -> study association
// const createQuestionnaireAssociations = (formData :Object[], studyEKID :UUID) => {
//   const psk = getPageSectionKey(2, 1);
//   const questions :Object[] = get(formData, psk);
//
//   const associations = questions.map((question :Object, index :number) => [
//     PART_OF, index, QUESTION, 0, SURVEY, {
//       [ID_FQN.toString()]: [uuid()]
//     }
//   ]);
//
//   // $FlowFixMe
//   return associations.concat(
//     [[PART_OF, 0, SURVEY, studyEKID, STUDIES, {
//       [COMPLETED_DATE_TIME_FQN.toString()]: [new Date()]
//     }]]
//   );
// };
//
// const constructEntitiesFromFormData = (
//   formData :Object, entityKeyIds :Object, entitySetIds :Map, propertyTypeIds :Map
// ) => {
//   const questionnaireESID = entitySetIds.get(SURVEY);
//   const questionsESID = entitySetIds.get(QUESTION);
//
//   const questionnaireEKID = getIn(entityKeyIds, [questionnaireESID, 0]);
//   const questionEKIDS = get(entityKeyIds, questionsESID);
//
//   // update form data
//   let updatedFormData = setIn(
//     formData,
//     [getPageSectionKey(1, 1), getEntityAddressKey(0, SURVEY, OPENLATTICE_ID_FQN)],
//     questionnaireEKID
//   );
//
//   questionEKIDS.forEach((questionEKID, index) => {
//     updatedFormData = setIn(
//       updatedFormData,
//       [getPageSectionKey(2, 1), index, getEntityAddressKey(-1, QUESTION, OPENLATTICE_ID_FQN)],
//       questionEKID
//     );
//   });
//
//   let result = processEntityData(
//     updatedFormData,
//     entitySetIds,
//     propertyTypeIds.map((id, fqn) => fqn)
//   );
//
//   // set id property on questionnaire entity (required by LUK table)
//   result = setIn(result, [questionnaireESID, 0, 'id'], questionnaireEKID);
//
//   const questionEntities = get(result, questionsESID);
//   const questionnaireEntity = getIn(result, [questionnaireESID, 0]);
//
//   return { questionEntities, questionnaireEntity };
// };
//
// export {
//   constructEntitiesFromFormData,
//   createPreviewQuestionEntities,
//   createQuestionnaireAssociations,
//   createRecurrenceRuleSetFromFormData,
//   getQuestionnaireSummaryFromForm,
//   getWeekDaysAndTimesFromRruleSet,
// };
