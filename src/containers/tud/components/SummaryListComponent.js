// @flow

import styled from 'styled-components';
import { List } from 'immutable';
import {
  Button,
  Colors,
  Grid,
  Typography
} from 'lattice-ui-kit';
import { DateTime } from 'luxon';

import DataTypes from '../constants/DataTypes';
import { formatAsDate } from '../../../common/utils';
import type { DataType } from '../constants/DataTypes';

const { NEUTRAL } = Colors;

const Wrapper = styled.div`
  align-items: center;
  border-bottom: 1px solid ${NEUTRAL.N50};
  display: grid;
  grid-column-gap: 20px;
  grid-template-columns: auto 1fr 400px;
  padding: 10px 0;

  :last-of-type {
    margin-bottom: 0;
    border-bottom: none;
  }
`;

const ButtonWrapper = styled(Button)`
  padding-left: 8px;
  padding-right: 8px;
`;

type Props = {
  date :DateTime;
  submissionIds :List<UUID>;
  onDownloadData :(date :DateTime, dataType :DataType) => void;
}

const SummaryListComponent = (
  {
    date,
    submissionIds,
    onDownloadData,
  } :Props
) => (
  <Wrapper>
    <Grid container spacing={3}>
      <Grid item>
        <Typography variant="body1" gutterBottom>
          {/* $FlowFixMe */}
          { formatAsDate(date) }
        </Typography>
      </Grid>
      <Grid item>
        <Typography variant="body2" gutterBottom>
          { submissionIds.size }
        </Typography>
      </Grid>
    </Grid>
    <div />

    <Grid container spacing={2}>
      <Grid item xs={4}>
        <ButtonWrapper
            fullWidth
            onClick={() => onDownloadData(date, DataTypes.SUMMARIZED)}
            size="small"
            variant="outlined">
          Summarized
        </ButtonWrapper>
      </Grid>
      <Grid item xs={4}>
        <ButtonWrapper
            fullWidth
            onClick={() => onDownloadData(date, DataTypes.DAYTIME)}
            size="small"
            variant="outlined">
          Daytime
        </ButtonWrapper>
      </Grid>
      <Grid item xs={4}>
        <ButtonWrapper
            fullWidth
            onClick={() => onDownloadData(date, DataTypes.NIGHTTIME)}
            size="small"
            variant="outlined">
          Nighttime
        </ButtonWrapper>
      </Grid>
    </Grid>
  </Wrapper>
);

export default SummaryListComponent;
