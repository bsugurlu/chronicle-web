// @flow

import { useEffect, useMemo, useState } from 'react';

import styled from 'styled-components';
import {
  List,
  Map,
  Set
} from 'immutable';
import { Constants } from 'lattice';
import {
  Button,
  Colors,
  Modal,
  Select,
  Sizes,
  Spinner
} from 'lattice-ui-kit';
import { ReduxConstants } from 'lattice-utils';
import { DateTime } from 'luxon';
import { useDispatch, useSelector } from 'react-redux';
import { RequestStates } from 'redux-reqseq';
import { createSelector } from 'reselect';
import type { RequestState } from 'redux-reqseq';

import QuestionnaireForm from '../../questionnaire/components/QuestionnaireForm';
import { PROPERTY_TYPE_FQNS } from '../../../core/edm/constants/FullyQualifiedNames';
import { QUESTIONNAIRE_REDUX_CONSTANTS } from '../../../utils/constants/ReduxConstants';
import {
  DOWNLOAD_QUESTIONNAIRE_RESPONSES,
  GET_QUESTIONNAIRE_RESPONSES,
  GET_STUDY_QUESTIONNAIRES,
  downloadQuestionnaireResponses,
  getQuestionnaireResponses,
  getStudyQuestionnaires
} from '../../questionnaire/QuestionnaireActions';
import { createInitialFormData } from '../../questionnaire/utils';

const { REQUEST_STATE } = ReduxConstants;

const {
  ANSWER_QUESTION_ID_MAP,
  QUESTION_ANSWERS_MAP,
  QUESTIONNAIRE_QUESTIONS,
  QUESTIONNAIRE_RESPONSES,
  STUDY_QUESTIONNAIRES
} = QUESTIONNAIRE_REDUX_CONSTANTS;

const { NAME_FQN, DATE_TIME_FQN } = PROPERTY_TYPE_FQNS;
const { OPENLATTICE_ID_FQN } = Constants;

const { APP_CONTENT_WIDTH } = Sizes;
const { NEUTRAL } = Colors;

const ModalWrapper = styled.div`
  width: ${APP_CONTENT_WIDTH}px;
  min-height: 400px;
  position: relative;
`;

const HeaderWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 30px;
  align-items: flex-end;
  padding-bottom: 30px;
  background: #fff;
`;

const SelectWrapper = styled.div`
  width: 300px;

  > h5 {
    color: ${NEUTRAL.N700};
    font-size: 15px;
    margin-bottom: 5px;
    padding: 0;
  }
`;

const NoData = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  margin-top: 30px;
`;

const selectSubmissionDateMap = createSelector(
  (answersById) => answersById,
  (_, questionsByQuestionnaireId) => questionsByQuestionnaireId,
  (_, questionsByQuestionnaireId, questionAnswersMap) => questionAnswersMap,
  (answersById, questionsByQuestionnaireId, questionAnswersMap) => {

    // Create a map of questionnaireID -> List of submission dates
    const result = Map().withMutations((mutator) => {
      questionsByQuestionnaireId.forEach((questionEntities, questionnaireID) => {
        const questionId = questionEntities.first().getIn([OPENLATTICE_ID_FQN, 0]);

        const answerIds :Set<UUID> = questionAnswersMap.get(questionId, Set());
        const dates :List = answerIds
          .map((answerId :UUID) => answersById.getIn([answerId, DATE_TIME_FQN, 0]))
          .filter((val) => val);
        mutator.updateIn([questionnaireID], List(), (res) => res.concat(dates));
      });
    });

    return result;
  }
);

const selectQuestions = createSelector(
  (selectedQuestionnaire) => selectedQuestionnaire,
  (_, questionsByQuestionnaireId) => questionsByQuestionnaireId,
  (selectedQuestionnaire, questionsByQuestionnaireId) => {
    if (selectedQuestionnaire !== null) {
      return questionsByQuestionnaireId.get(selectedQuestionnaire.value, List());
    }
    return undefined;
  }
);

const selectAnswers = createSelector(
  (selectedDate) => selectedDate,
  (_, answersById) => answersById.groupBy((answer) => answer.getIn([DATE_TIME_FQN, 0])),
  (selectedDate, answersByDate) => {
    if (selectedDate) {
      return answersByDate.get(selectedDate.value, Map());
    }
    return undefined;
  }
);

type Props = {
  isModalOpen :boolean;
  onCloseModal :() => void;
  participantEKID :UUID;
  participantId :UUID;
  studyEKID :UUID;
  studyId :UUID;
}
const DownloadQuestionnaireResponses = (props :Props) => {
  const {
    isModalOpen,
    onCloseModal,
    participantEKID,
    participantId,
    studyEKID,
    studyId
  } = props;

  const dispatch = useDispatch();

  const [selectedQuestionnaire, setSelectedQuestionnaire] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [questionnaireOptions, setQuestionnaireOptions] = useState([]);
  const [selectDateOptions, setSelectDateOptions] = useState([]);

  // selectors
  const studyQuestionnaires = useSelector(
    (state) => state.getIn(['questionnaire', STUDY_QUESTIONNAIRES, studyEKID], Map())
  );
  const questionsByQuestionnaireId = useSelector(
    (state) => state.getIn(['questionnaire', QUESTIONNAIRE_QUESTIONS], Map())
  );
  const answersById = useSelector(
    (state) => state.getIn(['questionnaire', QUESTIONNAIRE_RESPONSES, participantEKID], Map())
  );
  const questionAnswersMap = useSelector(
    (state) => state.getIn(['questionnaire', QUESTION_ANSWERS_MAP], Map())
  );
  const answerQuestionIdMap = useSelector(
    (state) => state.getIn(['questionnaire', ANSWER_QUESTION_ID_MAP], Map())
  );
  const downloadRS :RequestState = useSelector(
    (state) => state.getIn(['questionnaire', DOWNLOAD_QUESTIONNAIRE_RESPONSES, REQUEST_STATE])
  );
  const getQuestionnaireResponsesRS :RequestState = useSelector(
    (state) => state.getIn(['questionnaire', GET_QUESTIONNAIRE_RESPONSES, REQUEST_STATE])
  );

  const getStudyQuestionnairesRS :RequestState = useSelector(
    (state) => state.getIn(['questionnaire', GET_STUDY_QUESTIONNAIRES, REQUEST_STATE])
  );

  const submissionDateMap = selectSubmissionDateMap(
    answersById,
    questionsByQuestionnaireId,
    questionAnswersMap
  );

  const selectedAnswers = selectAnswers(
    selectedDate,
    answersById
  );

  const selectedQuestions = selectQuestions(
    selectedQuestionnaire,
    questionsByQuestionnaireId
  );

  const formData = useMemo(() => createInitialFormData(
    answersById,
    answerQuestionIdMap,
    selectedQuestions,
    selectedAnswers
  ), [answerQuestionIdMap, answersById, selectedAnswers, selectedQuestions]);

  useEffect(() => {
    if (answersById.isEmpty()) {
      dispatch(getQuestionnaireResponses({
        participantEKID,
        studyId
      }));
    }
  }, [dispatch, participantEKID, answersById, studyId]);

  useEffect(() => {
    if (studyQuestionnaires.isEmpty()) {
      dispatch(getStudyQuestionnaires(studyEKID));
    }
  }, [dispatch, studyEKID, studyQuestionnaires]);

  // create select options for questionnaire
  useEffect(() => {
    if (!studyQuestionnaires.isEmpty()) {
      const options = studyQuestionnaires.valueSeq().map((entity) => ({
        label: entity.getIn([NAME_FQN, 0]),
        value: entity.getIn([OPENLATTICE_ID_FQN, 0])
      }));

      setQuestionnaireOptions(options.toJS());
      setSelectedQuestionnaire(options.first());
    }
  }, [studyQuestionnaires]);

  // Each time a questionnaire is selected, create select date options
  useEffect(() => {
    if (!answersById.isEmpty() && selectedQuestionnaire !== null) {

      const submissionDates = submissionDateMap.get(selectedQuestionnaire.value, List());
      const options = submissionDates.map((date) => ({
        label: DateTime.fromISO(date).toLocaleString(DateTime.DATETIME_SHORT),
        value: date
      }));

      setSelectDateOptions(options.toJS());
      setSelectedDate(options.first());
    }
  }, [answersById, selectedQuestionnaire, submissionDateMap]);

  const onSelectDate = (selectedValue) => {
    setSelectedDate(selectedValue);
  };

  const onSelectQuestionnaire = (selectedVal) => {
    setSelectedQuestionnaire(selectedVal);
  };

  const onDownloadData = () => {
    if (selectedQuestionnaire) {
      dispatch(downloadQuestionnaireResponses({
        participantEKID,
        participantId,
        questionnaireId: selectedQuestionnaire.value,
        questionnaireName: selectedQuestionnaire.label
      }));
    }
  };

  const fetchingData = getStudyQuestionnairesRS === RequestStates.PENDING
  || getQuestionnaireResponsesRS === RequestStates.PENDING;

  return (
    <Modal
        isVisible={isModalOpen}
        onClose={onCloseModal}
        textSecondary="Close"
        textTitle="Download Questionnaire Responses">
      <ModalWrapper>
        {
          fetchingData ? (
            <div style={{ textAlign: 'center' }}>
              <Spinner size="2x" />
            </div>
          ) : (
            <>
              <HeaderWrapper>
                <SelectWrapper>
                  <h5> Select Questionnaire </h5>
                  <Select
                      isDisabled={fetchingData || questionnaireOptions.length === 0}
                      onChange={onSelectQuestionnaire}
                      options={questionnaireOptions}
                      value={selectedQuestionnaire} />
                </SelectWrapper>
                <SelectWrapper>
                  <h5> Select Date Completed </h5>
                  <Select
                      isDisabled={fetchingData || selectDateOptions.length === 0}
                      onChange={onSelectDate}
                      options={selectDateOptions}
                      value={selectedDate} />
                </SelectWrapper>
                <div style={{ textAlign: 'end' }}>
                  <Button
                      disabled={fetchingData || selectDateOptions.length === 0}
                      isLoading={downloadRS === RequestStates.PENDING}
                      color="primary"
                      onClick={onDownloadData}>
                    Download All
                  </Button>
                </div>
              </HeaderWrapper>
              {
                selectedAnswers && selectedQuestions && (
                  <QuestionnaireForm editable={false} initialFormData={formData} questions={selectedQuestions} />
                )
              }

              {
                studyQuestionnaires.isEmpty() && (
                  <NoData>
                    No questionnaires associated with selected study.
                  </NoData>
                )
              }
              {
                selectedQuestions && !selectedAnswers && (
                  <NoData>
                    {`Participant "${participantId}" has not submitted any responses for selected questionnaire.`}
                  </NoData>
                )
              }
            </>
          )
        }
      </ModalWrapper>
    </Modal>
  );
};

/* eslint-enable */

export default DownloadQuestionnaireResponses;
