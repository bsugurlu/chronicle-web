// @flow

// import { useEffect, useState } from 'react';
//
// import styled from 'styled-components';
// import { Form, Paged } from 'lattice-fabricate';
// import { Button, CardSegment, Modal } from 'lattice-ui-kit';
// import { useDispatch } from 'react-redux';
// import { RequestStates } from 'redux-reqseq';
// import type { RequestState } from 'redux-reqseq';
//
// import NewQuestionnaireConfirmation from './NewQuestionnaireConfirmation';
//
// import { useRequestState } from '../../../common/utils';
// import { resetRequestState } from '../../../core/redux/ReduxActions';
// import { CREATE_QUESTIONNAIRE, createQuestionnaire } from '../../questionnaire/QuestionnaireActions';
// import { QUESTIONNAIRE_FORM_PAGES } from '../constants/constants';
// import { SCHEMAS, UI_SCHEMAS } from '../schemas/questionnaireSchema';
//
// const { aboutSchema, questionsSchema, schedulerSchema } = SCHEMAS;
// const { aboutUiSchema, questionsUiSchema, schedulerUiSchema } = UI_SCHEMAS;
//
// const {
//   ABOUT_PAGE,
//   CONFIRMATION_PAGE,
//   QUESTIONS_PAGE,
//   SCHEDULER_PAGE,
// } = QUESTIONNAIRE_FORM_PAGES;
//
// const pages = [ABOUT_PAGE, QUESTIONS_PAGE, SCHEDULER_PAGE, CONFIRMATION_PAGE];
//
// const pageUiSchemaMap = {
//   [ABOUT_PAGE]: aboutUiSchema,
//   [QUESTIONS_PAGE]: questionsUiSchema,
//   [SCHEDULER_PAGE]: schedulerUiSchema
// };
//
// const pageSchemaMap = {
//   [ABOUT_PAGE]: aboutSchema,
//   [QUESTIONS_PAGE]: questionsSchema,
//   [SCHEDULER_PAGE]: schedulerSchema
// };
//
// const Header = styled.div`
//   align-items: center;
//   display: flex;
//   justify-content: space-between;
//   margin-bottom: 20px;
//
//   h3 {
//     font-weight: 500;
//     padding: 0;
//     margin: 0;
//   }
// `;
//
// const ActionRow = styled.div`
//   align-items: center;
//   display: flex;
//   justify-content: space-between;
//   margin-top: 20px;
// `;
//
// type Props = {
//   onClose :() => void;
//   studyEKID :UUID;
// }
// const CreateQuestionnaireForm = (props :Props) => {
//   const { onClose, studyEKID } = props;
//
//   const dispatch = useDispatch();
//
//   const [submitStatusModalTitle, setSubmitStatusModalTitle] = useState('');
//   const [submitStatusModalMessage, setSubmitStatusModalMessage] = useState('');
//   const [submitStatusModalVisible, setSubmitStatusModalVisible] = useState(false);
//
//   const createQuestionnaireRS :?RequestState = useRequestState(['questionnaire', CREATE_QUESTIONNAIRE]);
//
//   useEffect(() => {
//     const submitSuccessful = createQuestionnaireRS === RequestStates.SUCCESS;
//     const submitFailure = createQuestionnaireRS === RequestStates.FAILURE;
//     if (submitSuccessful) {
//       setSubmitStatusModalTitle('Success');
//       setSubmitStatusModalMessage('Questionnaire was successfully created.');
//     }
//
//     if (submitFailure) {
//       setSubmitStatusModalTitle('Error');
//       setSubmitStatusModalMessage(
//         'An error occurred while creating questionnaire. Please try again or contact support.'
//       );
//     }
//
//     setSubmitStatusModalVisible(submitFailure || submitSuccessful);
//   }, [createQuestionnaireRS]);
//
//   const handleCloseModal = () => {
//     setSubmitStatusModalVisible(false);
//     if (createQuestionnaireRS === RequestStates.SUCCESS) {
//       onClose();
//     }
//     dispatch(resetRequestState(CREATE_QUESTIONNAIRE));
//   };
//
//   return (
//     <CardSegment>
//       <Header>
//         <h3> Create Questionnaire </h3>
//         <Button onClick={onClose}> Cancel </Button>
//       </Header>
//       <Paged
//           render={(pagedProps) => {
//             const {
//               formRef,
//               onBack,
//               onNext,
//               page,
//               pagedData,
//               validateAndSubmit
//             } = pagedProps;
//             /*
//               pages:
//               1: Questionnaire name + description
//               2: Questions
//               3: Trigger times
//               4: Confirm
//             */
//             const totalPages = 4;
//             const pageName = pages[page];
//
//             const handleNext = () => {
//               if (pageName === CONFIRMATION_PAGE) {
//                 dispatch(createQuestionnaire({
//                   formData: pagedData,
//                   studyEKID
//                 }));
//               }
//               else {
//                 validateAndSubmit();
//               }
//             };
//
//             return (
//               <>
//                 {
//                   (pageName === ABOUT_PAGE || pageName === QUESTIONS_PAGE || pageName === SCHEDULER_PAGE) && (
//                     <Form
//                         formData={pagedData}
//                         hideSubmit
//                         noPadding
//                         onSubmit={onNext}
//                         ref={formRef}
//                         schema={pageSchemaMap[pageName]}
//                         uiSchema={pageUiSchemaMap[pageName]} />
//                   )
//                 }
//                 {
//                   pageName === CONFIRMATION_PAGE && (
//                     <NewQuestionnaireConfirmation formData={pagedData} />
//                   )
//                 }
//                 <ActionRow>
//                   <Button
//                       disabled={pageName === ABOUT_PAGE}
//                       onClick={onBack}>
//                     Back
//                   </Button>
//                   <span>{`${page + 1} of ${totalPages}`}</span>
//                   <Button
//                       isLoading={createQuestionnaireRS === RequestStates.PENDING}
//                       color="primary"
//                       onClick={handleNext}>
//                     {
//                       pageName === CONFIRMATION_PAGE ? 'Save Questionnaire' : 'Next'
//                     }
//                   </Button>
//                 </ActionRow>
//               </>
//             );
//           }} />
//       <Modal
//           isVisible={submitStatusModalVisible}
//           onClose={handleCloseModal}
//           textSecondary="Cancel"
//           textTitle={submitStatusModalTitle}>
//         <p>
//           { submitStatusModalMessage}
//         </p>
//       </Modal>
//     </CardSegment>
//   );
// };
//
// export default CreateQuestionnaireForm;
