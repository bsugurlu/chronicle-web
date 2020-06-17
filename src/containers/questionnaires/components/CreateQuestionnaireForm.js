// @flow
import React from 'react';

import styled from 'styled-components';
import { faTimes } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Form,
  Paged
} from 'lattice-fabricate';
import {
  Button,
  CardSegment,
  Colors,
  IconButton
} from 'lattice-ui-kit';

import NewQuestionnaireConfirmation from './NewQuestionnaireConfirmation';

import { QUESTIONNAIRE_FORM_PAGES } from '../constants/constants';
import { SCHEMAS, UI_SCHEMAS } from '../schemas/questionnaireSchema';

const { aboutSchema, questionsSchema, schedulerSchema } = SCHEMAS;
const { aboutUiSchema, questionsUiSchema, schedulerUiSchema } = UI_SCHEMAS;
const {
  ABOUT_PAGE,
  CONFIRMATION_PAGE,
  QUESTIONS_PAGE,
  SCHEDULER_PAGE,
} = QUESTIONNAIRE_FORM_PAGES;
const { NEUTRALS } = Colors;

const pages = [ABOUT_PAGE, QUESTIONS_PAGE, SCHEDULER_PAGE, CONFIRMATION_PAGE];

const pageUiSchemaMap = {
  [ABOUT_PAGE]: aboutUiSchema,
  [QUESTIONS_PAGE]: questionsUiSchema,
  [SCHEDULER_PAGE]: schedulerUiSchema
};

const pageSchemaMap = {
  [ABOUT_PAGE]: aboutSchema,
  [QUESTIONS_PAGE]: questionsSchema,
  [SCHEDULER_PAGE]: schedulerSchema
};

const CloseIcon = (
  <FontAwesomeIcon icon={faTimes} color={NEUTRALS[1]} />
);

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  h3 {
    font-weight: 500;
    padding: 0;
    margin: 0;
  }
`;

const ActionRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
`;

type Props = {
  onExitEditMode :() => void;
}
const CreateQuestionnaireForm = (props :Props) => {
  const { onExitEditMode } = props;
  return (
    <CardSegment padding="20px">
      <Header>
        <h3> Create Questionnaire </h3>
        <IconButton icon={CloseIcon} onClick={onExitEditMode}> Close </IconButton>
      </Header>
      <Paged
          render={(pagedProps) => {
            const {
              formRef,
              pagedData,
              page,
              onBack,
              onNext,
              validateAndSubmit
            } = pagedProps;
            /*
              pages:
              1: Questionnaire name + description
              2: Questions
              3: Trigger times
              4: Confirm
            */
            const totalPages = 4;
            const pageName = pages[page];

            const handleNext = () => {
              if (pageName === CONFIRMATION_PAGE) {
                alert('ready to send this');
              }
              else {
                validateAndSubmit();
              }
            };

            return (
              <>
                {
                  (pageName === ABOUT_PAGE || pageName === QUESTIONS_PAGE || pageName === SCHEDULER_PAGE) && (
                    <Form
                        formData={pagedData}
                        hideSubmit
                        noPadding
                        onSubmit={onNext}
                        ref={formRef}
                        schema={pageSchemaMap[pageName]}
                        uiSchema={pageUiSchemaMap[pageName]} />
                  )
                }
                {
                  pageName === CONFIRMATION_PAGE && (
                    <NewQuestionnaireConfirmation formData={pagedData} />
                  )
                }
                <ActionRow>
                  <Button
                      disabled={pageName === ABOUT_PAGE}
                      onClick={onBack}>
                    Back
                  </Button>
                  <span>{`${page + 1} of ${totalPages}`}</span>
                  <Button
                      mode="primary"
                      onClick={handleNext}>
                    {
                      pageName === CONFIRMATION_PAGE ? 'Save Questionnaire' : 'Next'
                    }
                  </Button>
                </ActionRow>
              </>
            );
          }} />
    </CardSegment>
  );
};

export default CreateQuestionnaireForm;
