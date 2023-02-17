// @flow

import { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import SummaryStats from './components/SummaryStats';
import selectSummaryStats from './selectors/selectSummaryStats';
import { GET_SUMMARY_STATS, getSummaryStats } from './actions';

import { DASHBOARD } from '../../common/constants';
import { isFailure, isSuccess, useRequestState } from '../../common/utils';
import { resetRequestState } from '../../core/redux/ReduxActions';

const SummaryStatsContainer = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getSummaryStats());

    return () => {
      dispatch(resetRequestState(GET_SUMMARY_STATS));
    };
  }, [dispatch]);

  const getSummaryStatsRS = useRequestState([DASHBOARD, GET_SUMMARY_STATS]);

  const data = useSelector(selectSummaryStats());

  let loading = true;
  if (isSuccess(getSummaryStatsRS) || isFailure(getSummaryStatsRS)) {
    loading = false;
  }

  return <SummaryStats data={data} loading={loading} />;
};

export default SummaryStatsContainer;
