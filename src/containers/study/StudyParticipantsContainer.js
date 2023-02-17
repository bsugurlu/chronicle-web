/*
 * @flow
 */

import { useEffect, useReducer, useState } from 'react';

import { List, Map, Set } from 'immutable';
import {
  Box,
  Card,
  CardSegment,
} from 'lattice-ui-kit';
import { useDispatch, useSelector } from 'react-redux';
import type { RequestState } from 'redux-reqseq';

import AddParticipantModal from './components/AddParticipantModal';
import ChangeEnrollmentModal from './components/ChangeEnrollmentModal';
import DeleteParticipantModal from './components/DeleteParticipantModal';
import DownloadParticipantDataModal from './components/DownloadParticipantDataModal';
import ParticipantInfoModal from './components/ParticipantInfoModal';
import ParticipantsTable from './ParticipantsTable';
import ParticipantsTableActions from './constants/ParticipantsTableActions';
import ParticipantsTableDispatch from './components/ParticipantsTableDispatch';
import TableHeader from './components/TableHeader';
import TudSubmissionHistory from './components/TudSubmissionHistory';
import {
  CHANGE_ENROLLMENT_STATUS,
  DELETE_STUDY_PARTICIPANTS,
  REGISTER_PARTICIPANT,
  changeEnrollmentStatus,
  deleteStudyParticipants
} from './actions';

import {
  CANDIDATE_ID,
  CANDIDATE_IDS,
  PARTICIPANT_ID,
  PARTICIPATION_STATUS,
  STUDIES,
  STUDY_ID
} from '../../common/constants';
import { useRequestState } from '../../common/utils';
import { resetRequestStates } from '../../core/redux/actions';
import {
  selectMyKeys,
  selectParticipantStats,
  selectStudyParticipants,
} from '../../core/redux/selectors';
import type { Participant, ParticipationStatus, Study } from '../../common/types';

const {
  SELECT_CANDIDATE_IDS,
  SET_CANDIDATE_ID,
  TOGGLE_ADD_PARTICIPANT_MODAL,
  TOGGLE_DELETE_MODAL,
  TOGGLE_DOWNLOAD_MODAL,
  TOGGLE_ENROLLMENT_MODAL,
  TOGGLE_INFO_MODAL,
  TOGGLE_TUD_SUBMISSION_HISTORY_MODAL,
} = ParticipantsTableActions;

const initialState = {
  isAddParticipantModalOpen: false,
  isDeleteModalOpen: false,
  isDownloadModalOpen: false,
  isEnrollmentModalOpen: false,
  isInfoModalOpen: false,
  isTudSubmissionHistoryModalOpen: false,
  candidateId: null,
  selectedParticipants: Set()
};

const reducer = (state :Object, action :Object) => {
  switch (action.type) {
    case SELECT_CANDIDATE_IDS: {
      const { ids, all = false } = action;
      const { selectedParticipants } = state;

      if (all) {
        if (!selectedParticipants.isEmpty()) {
          return {
            ...state,
            selectedParticipants: Set()
          };
        }
        return {
          ...state,
          selectedParticipants: ids
        };
      }

      const updated = selectedParticipants.withMutations((mutableSet :Set) => {
        ids.forEach((id) => {
          if (selectedParticipants.has(id)) {
            mutableSet.delete(id);
          }
          else {
            mutableSet.add(id);
          }
        });
      });
      return {
        ...state,
        selectedParticipants: updated
      };
    }
    case TOGGLE_INFO_MODAL:
      return {
        ...state,
        isInfoModalOpen: action.isModalOpen
      };

    case TOGGLE_DELETE_MODAL:
      return {
        ...state,
        isDeleteModalOpen: action.isModalOpen
      };

    case SET_CANDIDATE_ID:
      return {
        ...state,
        candidateId: action.candidateId
      };

    case TOGGLE_ADD_PARTICIPANT_MODAL:
      return {
        ...state,
        isAddParticipantModalOpen: action.isModalOpen
      };

    case TOGGLE_DOWNLOAD_MODAL:
      return {
        ...state,
        isDownloadModalOpen: action.isModalOpen
      };

    case TOGGLE_ENROLLMENT_MODAL:
      return {
        ...state,
        isEnrollmentModalOpen: action.isModalOpen
      };

    case TOGGLE_TUD_SUBMISSION_HISTORY_MODAL:
      return {
        ...state,
        isTudSubmissionHistoryModalOpen: action.isModalOpen
      };

    default:
      return state;
  }
};

const StudyParticipantsContainer = ({
  study,
  hasAndroidDataCollection,
  hasIOSSensorDataCollection,
  hasTimeUseDiary
} :{
  hasAndroidDataCollection :boolean;
  hasIOSSensorDataCollection :boolean;
  hasTimeUseDiary :boolean;
  study :Study;
}) => {

  const storeDispatch = useDispatch();

  const [state, dispatch] = useReducer(reducer, initialState);

  const {
    isAddParticipantModalOpen,
    isDeleteModalOpen,
    isDownloadModalOpen,
    isEnrollmentModalOpen,
    isInfoModalOpen,
    isTudSubmissionHistoryModalOpen,
    candidateId,
    selectedParticipants
  } = state;

  const [filteredParticipants, setFilteredParticipants] = useState(Map());

  // selectors
  const participants :Map<UUID, Participant> = useSelector(selectStudyParticipants(study.id));
  const participantStats = useSelector(selectParticipantStats(study.id));

  const myKeys :Set<List<UUID>> = useSelector(selectMyKeys());
  const isOwner :boolean = myKeys.has(List([study.id]));

  const changeEnrollmentStatusRS :?RequestState = useRequestState([STUDIES, CHANGE_ENROLLMENT_STATUS]);
  const deleteParticipantRS :?RequestState = useRequestState([STUDIES, DELETE_STUDY_PARTICIPANTS]);

  useEffect(() => {
    setFilteredParticipants(participants);
  }, [participants]);

  useEffect(() => {
    storeDispatch(resetRequestStates([CHANGE_ENROLLMENT_STATUS]));
  }, [isEnrollmentModalOpen, storeDispatch]);

  useEffect(() => {
    storeDispatch(resetRequestStates([DELETE_STUDY_PARTICIPANTS]));
  }, [isDeleteModalOpen, storeDispatch]);

  useEffect(() => {
    storeDispatch(resetRequestStates([REGISTER_PARTICIPANT]));
  }, [isAddParticipantModalOpen, storeDispatch]);

  const handleOnChange = (event :SyntheticInputEvent<HTMLInputElement>) => {
    const { currentTarget } = event;
    const { value } = currentTarget;

    const matchingResults = participants
      .filter((participant :Participant) => participant[PARTICIPANT_ID].toLowerCase().includes(value.toLowerCase()));
    setFilteredParticipants(matchingResults);
  };

  const handleOnDeleteParticipant = () => {
    storeDispatch(
      deleteStudyParticipants({
        [CANDIDATE_IDS]: [candidateId],
        [STUDY_ID]: study.id,
      })
    );
  };

  const handleOnChangeEnrollment = (status :ParticipationStatus) => {
    storeDispatch(changeEnrollmentStatus({
      [CANDIDATE_ID]: candidateId,
      [STUDY_ID]: study.id,
      [PARTICIPANT_ID]: participants.getIn([candidateId, PARTICIPANT_ID]),
      [PARTICIPATION_STATUS]: status
    }));
  };

  return (
    <ParticipantsTableDispatch.Provider value={dispatch}>
      <Card>
        <CardSegment vertical>
          <TableHeader
              filteredParticipants={filteredParticipants}
              selectedParticipants={selectedParticipants.size}
              handleOnChange={handleOnChange} />
          {
            !participants.isEmpty()
            && filteredParticipants.isEmpty()
            && <Box mt={3} textAlign="left"> No matching results. </Box>
          }
          {
            participants.isEmpty()
            && <Box mt={3} align="center"> No participants found! </Box>
          }
          {
            !filteredParticipants.isEmpty()
            && (
              <ParticipantsTable
                  hasDeletePermission={isOwner}
                  hasAndroidDataCollection={hasAndroidDataCollection}
                  hasTimeUseDiary={hasTimeUseDiary}
                  hasIOSSensorDataCollection={hasIOSSensorDataCollection}
                  participants={filteredParticipants}
                  participantStats={participantStats}
                  selectedParticipants={selectedParticipants} />
            )
          }
        </CardSegment>
        <AddParticipantModal
            isVisible={isAddParticipantModalOpen}
            onCloseModal={() => dispatch({ type: TOGGLE_ADD_PARTICIPANT_MODAL, isModalOpen: false })}
            participants={participants}
            study={study} />
        {
          candidateId && (
            <>
              <ParticipantInfoModal
                  handleOnClose={() => dispatch({ type: TOGGLE_INFO_MODAL, isModalOpen: false })}
                  hasAndroidDataCollection={hasAndroidDataCollection}
                  hasTimeUseDiary={hasTimeUseDiary}
                  isVisible={isInfoModalOpen}
                  hasIOSSensorDataCollection={hasIOSSensorDataCollection}
                  participantId={participants.getIn([candidateId, PARTICIPANT_ID])}
                  studyId={study.id} />
              <ChangeEnrollmentModal
                  enrollmentStatus={participants.getIn([candidateId, PARTICIPATION_STATUS])}
                  handleOnChangeEnrollment={handleOnChangeEnrollment}
                  handleOnClose={() => dispatch({ type: TOGGLE_ENROLLMENT_MODAL, isModalOpen: false })}
                  isVisible={isEnrollmentModalOpen}
                  participantId={participants.getIn([candidateId, PARTICIPANT_ID])}
                  requestState={changeEnrollmentStatusRS} />
              <DeleteParticipantModal
                  handleOnClose={() => dispatch({ type: TOGGLE_DELETE_MODAL, isModalOpen: false })}
                  handleOnDeleteParticipant={handleOnDeleteParticipant}
                  isVisible={isDeleteModalOpen}
                  participantId={participants.getIn([candidateId, PARTICIPANT_ID])}
                  requestState={deleteParticipantRS} />
              <TudSubmissionHistory
                  handleOnClose={() => dispatch({ type: TOGGLE_TUD_SUBMISSION_HISTORY_MODAL, isModalOpen: false })}
                  isVisible={isTudSubmissionHistoryModalOpen}
                  candidateId={candidateId}
                  participantId={participants.getIn([candidateId, PARTICIPANT_ID])} />
            </>
          )
        }
        {
          candidateId && (
            <DownloadParticipantDataModal
                handleOnClose={() => dispatch({ type: TOGGLE_DOWNLOAD_MODAL, isModalOpen: false })}
                hasAndroidDataCollection={hasAndroidDataCollection}
                hasIOSSensorDataCollection={hasIOSSensorDataCollection}
                hasTimeUseDiary={hasTimeUseDiary}
                isVisible={isDownloadModalOpen}
                participantId={participants.getIn([candidateId, PARTICIPANT_ID])}
                studyId={study.id} />
          )
        }
      </Card>
    </ParticipantsTableDispatch.Provider>
  );
};

export default StudyParticipantsContainer;
