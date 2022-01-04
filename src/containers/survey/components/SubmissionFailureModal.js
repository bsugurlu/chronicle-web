// @flow

import { Modal } from 'lattice-ui-kit';

import styled from 'styled-components';

const ModalBody = styled.div`
  max-width: 400px;
`;

type Props ={
  handleOnClose :() => void;
  isVisible :boolean;
}
const SubmissionFailureModal = (props :Props) => {
  const { handleOnClose, isVisible } = props;
  return (
    <Modal
        isVisible={isVisible}
        onClose={handleOnClose}
        textSecondary="Close"
        textTitle="Submission Failure">
      <ModalBody>
        <p>
          An error occurred while submitting. Please try again later or contact support.
        </p>
      </ModalBody>
    </Modal>
  );
};

export default SubmissionFailureModal;
