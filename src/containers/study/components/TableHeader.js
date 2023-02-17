// @flow

import { useContext } from 'react';

import styled from 'styled-components';
import { faPlus } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Grid, SearchInput } from 'lattice-ui-kit';

import ParticipantsTableDispatch from './ParticipantsTableDispatch';

import ParticipantsTableActions from '../constants/ParticipantsTableActions';

const {
  // SELECT_CANDIDATE_IDS,
  TOGGLE_ADD_PARTICIPANT_MODAL,
} = ParticipantsTableActions;

const AddParticipantsButton = styled(Button)`
  align-self: flex-start;
  margin-bottom: 5px;
`;

// const BulkActionsButton = styled(Button)`
//   margin-left: 20px;
// `;

const TableHeader = ({
  handleOnChange,
  // selectedParticipants,
  // filteredParticipants
} :{
  handleOnChange :(SyntheticInputEvent<HTMLInputElement>) => void;
  // selectedParticipants :number;
  // filteredParticipants :Map;
}) => {
  const dispatch = useContext(ParticipantsTableDispatch);

  // const [anchorEl, setAnchorEl] = useState(null);

  // const candidateIds :Set = filteredParticipants.keySeq().toSet();

  // const checkBoxLabel = selectedParticipants === 0
  //   ? `${filteredParticipants.size} participants`
  //   : `${selectedParticipants} selected`;
  return (
    <Grid container spacing={2}>
      <Grid container spacing={2} item xs={12} sm={6} md={9}>
        { /* <Grid item xs={12} md={6}>
          <Box display="flex" justifyContent="flex-start" width="100%">
            <Checkbox
                checked={selectedParticipants !== 0}
                label={checkBoxLabel}
                onChange={() => dispatch({ type: SELECT_CANDIDATE_IDS, ids: candidateIds, all: true })} />
            <BulkActionsButton
                aria-controls="bulk-actions-menu"
                disabled={selectedParticipants === 0}
                endIcon={<FontAwesomeIcon icon={faAngleDown} />}
                onClick={(event) => setAnchorEl(event.currentTarget)}>
              Bulk Actions
            </BulkActionsButton>
            <Menu
                id="bulk-actions-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{
                  horizontal: 'right',
                  vertical: 'bottom',
                }}
                getContentAnchorEl={null}
                transformOrigin={{
                  horizontal: 'right',
                  vertical: 'top',
                }}>
              <MenuItem>
                Send Message
              </MenuItem>
            </Menu>
          </Box>
        </Grid> */ }
        <Grid item xs={12} md={12}>
          <SearchInput placeholder="Filter participants" onChange={handleOnChange} />
        </Grid>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <AddParticipantsButton
            fullWidth
            onClick={() => dispatch({ type: TOGGLE_ADD_PARTICIPANT_MODAL, isModalOpen: true })}
            color="primary"
            startIcon={<FontAwesomeIcon icon={faPlus} />}>
          Add Participant
        </AddParticipantsButton>
      </Grid>
    </Grid>
  );
};

export default TableHeader;
