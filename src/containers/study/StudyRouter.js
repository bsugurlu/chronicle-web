/*
 * @flow
 */

import { useEffect, useMemo } from 'react';

import { Box } from 'lattice-ui-kit';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import type { RequestState } from 'redux-reqseq';

import StudyContainer from './StudyContainer';
import StudyParticipantsContainer from './StudyParticipantsContainer';
import { INITIALIZE_STUDY, initializeStudy } from './actions';

import TimeUseDiaryDashboard from '../tud/TimeUseDiaryDashboard';
import * as Routes from '../../core/router/Routes';
import { BasicErrorComponent, Spinner, TabLink } from '../../common/components';
import { AppComponents, STUDIES } from '../../common/constants';
import {
  getParamFromMatch,
  isFailure,
  isPending,
  isStandby,
  isSuccess,
  useRequestState,
} from '../../common/utils';
import { resetRequestStates } from '../../core/redux/actions';
import { selectStudy } from '../../core/redux/selectors';
import type { Study, UUID } from '../../common/types';

const StudyRouter = () => {

  const dispatch = useDispatch();

  let studyId :?UUID;

  const matchStudy = useRouteMatch(Routes.STUDY);

  // TODO: having to match each route is a pain. how do we avoid this pattern?
  if (matchStudy) {
    studyId = getParamFromMatch(matchStudy, Routes.STUDY_ID_PARAM);
  }

  const study :?Study = useSelector(selectStudy(studyId));

  const initializeStudyRS :?RequestState = useRequestState([STUDIES, INITIALIZE_STUDY]);

  useEffect(() => {
    dispatch(resetRequestStates([INITIALIZE_STUDY]));
    dispatch(initializeStudy(studyId));
    return () => {
      dispatch(resetRequestStates([INITIALIZE_STUDY]));
    };
  }, [dispatch, studyId]);

  const studyRoute = useMemo(() => (
    studyId
      ? Routes.STUDY.replace(Routes.STUDY_ID_PARAM, studyId)
      : Routes.NO_ROUTE
  ), [studyId]);

  const participantsRoute = useMemo(() => (
    studyId
      ? Routes.PARTICIPANTS.replace(Routes.STUDY_ID_PARAM, studyId)
      : Routes.NO_ROUTE
  ), [studyId]);

  // const questionnairesRoute = useMemo(() => (
  //   studyId
  //     ? Routes.QUESTIONNAIRES.replace(Routes.STUDY_ID_PARAM, studyId)
  //     : Routes.NO_ROUTE
  // ), [studyId]);

  const timeUseDiaryRoute = useMemo(() => (
    studyId
      ? Routes.STUDY_TUD.replace(Routes.STUDY_ID_PARAM, studyId)
      : Routes.NO_ROUTE
  ), [studyId]);

  if (isStandby(initializeStudyRS) || isPending(initializeStudyRS)) {
    return (
      <Spinner />
    );
  }

  if (isFailure(initializeStudyRS)) {
    return (
      <BasicErrorComponent />
    );
  }

  if (isSuccess(initializeStudyRS) && study) {
    const components = Object.keys(study.modules);
    const hasTimeUseDiary = components.includes(AppComponents.TIME_USE_DIARY);
    const hasAndroidDataCollection = components.includes(AppComponents.CHRONICLE_DATA_COLLECTION);
    const hasIOSSensorDataCollection = components.includes(AppComponents.IOS_SENSOR);
    const hasQuestionnaires = components.includes(AppComponents.CHRONICLE_SURVEYS);

    // const hasQuestionnaires = true;

    const renderStudyContainer = () => (
      (study)
        ? (
          <StudyContainer
              study={study}
              hasAndroidDataCollection={hasAndroidDataCollection}
              hasTimeUseDiary={hasTimeUseDiary}
              hasIOSSensorDataCollection={hasIOSSensorDataCollection}
              hasQuestionnaires={hasQuestionnaires} />
        )
        : null
    );

    const renderStudyParticipantsContainer = () => (
      (study)
        ? (
          <StudyParticipantsContainer
              study={study}
              hasAndroidDataCollection={hasAndroidDataCollection}
              hasTimeUseDiary={hasTimeUseDiary}
              hasIOSSensorDataCollection={hasIOSSensorDataCollection} />
        )
        : null
    );

    const renderTimeUseDiary = () => (
      (study)
        ? <TimeUseDiaryDashboard study={study} />
        : null
    );

    return (
      <>
        <Box fontSize={28} fontWeight="fontWeightNormal">{study.title}</Box>
        <Box display="flex" mt="30px" mb="50px" overflow="scroll">
          <TabLink exact to={studyRoute}>
            Study Details
          </TabLink>
          <TabLink exact to={participantsRoute}>
            Participants
          </TabLink>
          {/*
            hasQuestionnaires && (
              <TabLink exact to={questionnairesRoute}>
                Questionnaires
              </TabLink>
            )
          */}
          {
            hasTimeUseDiary && (
              <TabLink exact to={timeUseDiaryRoute}>
                Time Use Diary
              </TabLink>
            )
          }
        </Box>
        <Switch>
          <Route path={Routes.PARTICIPANTS} render={renderStudyParticipantsContainer} />
          <Route path={Routes.STUDY_TUD} render={renderTimeUseDiary} />
          <Route path={Routes.STUDY} render={renderStudyContainer} />
        </Switch>
      </>
    );
  }

  return null;
};

export default StudyRouter;
