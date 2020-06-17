// @flow

import React from 'react';

import styled from 'styled-components';
import { Button, Badge, Colors } from 'lattice-ui-kit';
import { get } from 'immutable';
import { QUESTIONNAIRE_SUMMARY } from '../constants/constants';
import { getQuestionnaireSummaryFromForm } from '../utils/utils';

const { NEUTRALS } = Colors;

const {
  TITLE,
  DESCRIPTION,
  NUM_MULTIPLE_CHOICE,
  NUM_SINGLE_ANSWER
} = QUESTIONNAIRE_SUMMARY;

const StyledButton = styled(Button)`
  margin-top: 20px;
  align-self: flex-start;
  width: 200px;
`;

const LeadText = styled.span`
  font-weight: 500;
`;

const Description = styled.span`
  font-size: 15px;
`;

const Wrapper = styled.div`
  margin-bottom: 4px;
`;

const Title = styled.h4`
  margin-bottom: 10px;
  margin-top: 0;
`;

const Label = styled.span`
  font-size: 14px;
  color: ${NEUTRALS[1]}
`;

type Props = {
  formData :Object;
}
const NewQuestionnaireConfirmation = ({
  formData
} :Props) => {
  const summary = getQuestionnaireSummaryFromForm(formData);

  return (
    <>
      <Title> Summary </Title>
      <Wrapper>
        <LeadText> Title: </LeadText>
        <Description>
          { get(summary, TITLE) }
        </Description>
      </Wrapper>

      <Wrapper>
        <LeadText> Description: </LeadText>
        <Description>
          { get(summary, DESCRIPTION) }
        </Description>
      </Wrapper>

      <Wrapper>
        <Badge count={get(summary, NUM_MULTIPLE_CHOICE)} />
        <Label>
          &nbsp; Multiple choice questions
        </Label>
      </Wrapper>

      <Wrapper>
        <Badge count={get(summary, NUM_SINGLE_ANSWER)} />
        <Label>
          &nbsp; Single answer questions
        </Label>
      </Wrapper>

      <StyledButton mode="secondary">
        Preview
      </StyledButton>
    </>
  );
};

export default NewQuestionnaireConfirmation;
