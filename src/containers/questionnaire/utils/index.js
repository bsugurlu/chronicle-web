// @flow

// import {
//   List,
//   Map,
//   getIn,
//   setIn
// } from 'immutable';
// import { DataProcessingUtils } from 'lattice-fabricate';
//
// import { OPENLATTICE_ID_FQN, QUESTION } from '../../../common/constants';
//
// const {
//   getEntityAddressKey,
//   getPageSectionKey,
//   parseEntityAddressKey
// } = DataProcessingUtils;
//
// const getSchemaProperties = (questions :List) => {
//   let properties = {};
//
//   questions.forEach((question) => {
//     const entityKeyId = question.getIn([OPENLATTICE_ID_FQN, 0]);
//     // $FlowIgnore
//     const addressKey = getEntityAddressKey(entityKeyId, QUESTION, VALUES_FQN);
//
//     properties = setIn(properties, [addressKey, 'title'], question.getIn([TITLE_FQN, 0]));
//     properties = setIn(properties, [addressKey, 'type'], 'string');
//
//     const answerChoices = question.get(VALUES_FQN, List()).toJS();
//     if (answerChoices.length !== 0) {
//       properties = setIn(properties, [addressKey, 'enum'], answerChoices.map((choice) => String(choice)));
//     }
//   });
//
//   return properties;
// };
//
// const getUiSchemaOptions = (schemaProperties :Object) => {
//   let result = {};
//
//   Object.keys(schemaProperties).forEach((property) => {
//     result = setIn(result, [property, 'classNames'], 'column-span-12');
//
//     if (getIn(schemaProperties, [property, 'enum'])) {
//       result = setIn(result, [property, 'ui:widget'], 'radio');
//       result = setIn(result, [property, 'ui:options', 'row'], true);
//       result = setIn(result, [property, 'ui:options', 'mode'], 'button');
//     }
//   });
//
//   return result;
// };
//
// // create a mapping from questionId -> ol.values value
// const getQuestionAnswerMapping = (formData :Object) => {
//   let result = {};
//   Object.values(formData).forEach((addressKeys :Object) => {
//     Object.entries(addressKeys).forEach(([key, value]) => {
//       const { entityKeyId } = parseEntityAddressKey(key);
//       result = setIn(result, [entityKeyId, VALUES_FQN], [value]);
//     });
//   });
//   return result;
// };
//
// // create data to prefill the form
// const createInitialFormData=(answersById :Map, answerQuestionIdMap :Map, questions :List, answers :Map = Map()) => {
//   const pageSection = getPageSectionKey(1, 1);
//   let result = {};
//
//   answers.forEach((answer, answerId) => {
//     const questionId = answerQuestionIdMap.get(answerId);
//     // $FlowIgnore
//     const addressKey = getEntityAddressKey(questionId, QUESTION, VALUES_FQN);
//
//     const value = answersById.get(answerId).getIn([VALUES_FQN, 0]);
//     result = setIn(result, [pageSection, addressKey], value);
//   });
//
//   return result;
// };
//
// const getCsvFileName=(questionnaireName :string, participantId :UUID) => `${questionnaireName}_${participantId}.csv`;
//
// const createSchema = (schemaProperties :Object, uiSchemaOptions :Object) => {
//   const schema = {
//     title: '',
//     type: 'object',
//     properties: {
//       [getPageSectionKey(1, 1)]: {
//         title: '',
//         type: 'object',
//         properties: {
//           ...schemaProperties
//         },
//         required: Object.keys(schemaProperties)
//       }
//     }
//   };
//
//   const uiSchema = {
//     [getPageSectionKey(1, 1)]: {
//       classNames: 'column-span-12 grid-container',
//       ...uiSchemaOptions
//     }
//   };
//
//   return { schema, uiSchema };
// };
//
// const getIsValidQuestionnaireEntity = (entity :Map) => (
//   // should contain ol.active, ol.description, ol.name and ol.rrule fqns
//   entity.has(ACTIVE_FQN)
//     && entity.has(DESCRIPTION_FQN)
//     && entity.has(RRULE_FQN)
//     && entity.has(NAME_FQN)
// );
//
// export {
//   createInitialFormData,
//   createSchema,
//   getCsvFileName,
//   getIsValidQuestionnaireEntity,
//   getQuestionAnswerMapping,
//   getSchemaProperties,
//   getUiSchemaOptions,
// };
