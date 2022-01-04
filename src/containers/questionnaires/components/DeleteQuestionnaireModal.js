// @flow

import { useEffect } from 'react';

import styled from 'styled-components';
import { ActionModal } from 'lattice-ui-kit';
import { ReduxConstants } from 'lattice-utils';
import { useDispatch, useSelector } from 'react-redux';
import { RequestStates } from 'redux-reqseq';
import type { RequestState } from 'redux-reqseq';

import { resetRequestState } from '../../../core/redux/ReduxActions';
import { DELETE_QUESTIONNAIRE, deleteQuestionnaire } from '../../questionnaire/QuestionnaireActions';

const { REQUEST_STATE } = ReduxConstants;

const Wrapper = styled.div`
  max-width: 500px;
`;

type Props = {
  isVisible :boolean;
  onClose :() => void;
  questionnaireEKID :UUID;
  studyEKID :UUID;
};

const DeleteQuestionnaireModal = ({
  isVisible,
  onClose,
  questionnaireEKID,
  studyEKID,
} :Props) => {
  const dispatch = useDispatch();

  const deleteQuestionnaireRS :RequestState = useSelector(
    (state) => state.getIn(['questionnaire', DELETE_QUESTIONNAIRE, REQUEST_STATE])
  );

  // reset delete requestState on dismount
  useEffect(() => () => {
    dispatch(resetRequestState(DELETE_QUESTIONNAIRE));
  }, [dispatch]);

  const handleDelete = () => {
    dispatch(deleteQuestionnaire({
      studyEKID, questionnaireEKID
    }));
  };

  const requestStateComponents = {
    [RequestStates.STANDBY]: (
      <Wrapper>
        <span>Are you sure you want to delete questionnaire? This action cannot be reversed.</span>
      </Wrapper>
    ),
    [RequestStates.FAILURE]: (
      <span>Sorry, an error occurred while attempting to delete questionnaire.</span>
    ),
    [RequestStates.SUCCESS]: (
      <span>Questionnaire was successfully deleted.</span>
    )
  };

  return (
    <ActionModal
        isVisible={isVisible}
        onClickPrimary={handleDelete}
        onClose={onClose}
        requestState={deleteQuestionnaireRS}
        requestStateComponents={requestStateComponents}
        textPrimary="Delete"
        textSecondary="Cancel"
        textTitle="Delete Questionnaire" />
  );
};

export default DeleteQuestionnaireModal;
