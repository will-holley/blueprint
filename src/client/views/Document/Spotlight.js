import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { connect } from "react-redux";
//* Components
import { H1, H2, H4, Button } from "client/components/tags";
import GradientText from "client/components/GradientText";
import Toggle from "client/components/Toggle";
//* Actions
import {
  changeSpotlightVisibility,
  updateDocumentPrivacy,
  deleteDocument,
  duplicateDocument
} from "client/data/services/document/actions";
//* Hooks
import { useHistory } from "react-router-dom";

const Container = styled.div`
  // Position
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 11;

  // Colors
  background: ${({ theme }) => theme.altBackground};
  color: ${({ theme }) => theme.text.alt};
  opacity: 0.95;

  // Interior
  padding: 10rem;

  // Layout
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  column-gap: 10rem;
`;

const CloseButton = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  padding: 1rem;
  margin: 1rem;
  cursor: pointer;
`;

const Left = styled.div`
  grid-column: 1;
`;

const Section = styled.div`
  margin-bottom: 2rem;

  div {
    margin-top: 2rem;

    p {
      margin-top: 0.75rem;
    }
  }
`;

const Tags = styled(Section)``;

const Tag = styled.span`
  padding: 1rem;
`;

const Actions = styled(Section)``;

const Shortcuts = styled(Section)`
  grid-column: 2;

  div {
    span {
    }
    code {
      float: right;
    }
  }
`;

const Spotlight = ({
  visibilityIsPrivate,
  closeSpotlight,
  handleUpdateDocumentPrivate,
  handleDeleteDocument,
  navigateToDashboard,
  handleDuplicateDocument,
  navigateToDuplicate,
  isDeleted
}) => {
  const { push } = useHistory();

  const handleDelete = async event => {
    await handleDeleteDocument();
    navigateToDashboard();
  };

  const createDuplicate = async event => {
    const id = await handleDuplicateDocument();
    closeSpotlight();
    navigateToDuplicate(id);
  };

  return (
    <Container>
      <CloseButton onClick={closeSpotlight}>🔴</CloseButton>
      <Left>
        <Section>
          <H1>Spotlight</H1>
        </Section>
        {/* <Tags>
        <GradientText>
          <H2>Tags</H2>
        </GradientText>
        <div>
          <Tag>Hello</Tag>
          <Tag>Dog</Tag>
        </div>
      </Tags> */}
        <Actions>
          <GradientText>
            <H2>Actions</H2>
          </GradientText>
          <div>
            <Toggle
              a={"👀 Public"}
              b="Private"
              active={visibilityIsPrivate ? "b" : "a"}
              handleClick={handleUpdateDocumentPrivate}
            />
            <p>
              Update the visibility of this Blueprint. A private Blueprint is
              only visible and editable by you. Public Blueprints are visible to
              all and can be edited by member of the Blueprint community.
            </p>
          </div>
          <div>
            <Button onClick={createDuplicate}>🍴 Duplicate</Button>
            <p>
              Duplicating this Blueprint creates an identical private copy of
              it.
            </p>
          </div>
          {/* <div>
            <Button onClick={handleDelete}>
              🗑 {isDeleted ? "Remove from" : "Add to"} Trash
            </Button>
            {!isDeleted && (
              <p>
                Adding this Blueprint to the trash will hide it from your
                Dashboard. Don't worry, you can always get it back by clicking
                the 🗑 on your dashboard.
              </p>
            )}
          </div> */}
        </Actions>
        <Section>
          <GradientText>
            <H2>Tips</H2>
          </GradientText>
          <div>
            <H4>Fullscreen is awesome</H4>
            <p>
              Try hiding your web browser's address and bookmark bars to remove
              distractions and create more space for mindfulness and focus. On
              Chrome, enlarge your browser to fullscreen then click the
              <i>View</i> menu in the top left corner of your screen and
              deselect "Always Show Toolbar in Full Screen" and "Always Show
              Bookmarks Bar".
            </p>
          </div>
        </Section>
      </Left>
      <Shortcuts>
        <GradientText>
          <H2>Shortcuts</H2>
        </GradientText>
        <div>
          <span>cmd + =</span>
          <code>zoom in</code>
        </div>
        <div>
          <span>cmd + -</span>
          <code>zoom out</code>
        </div>
        <div>
          <span>cmd + 0</span>
          <code>reset zoom</code>
        </div>
        <div>
          <span>cmd + enter</span>
          <code>create a new base node</code>
        </div>
        <div>
          <span>cmd + k</span>
          <code>hide/show spotlight</code>
        </div>
        <div>
          <H4>With a node selected</H4>
        </div>
        <div>
          <span>cmd + up arrow</span>
          <code>move up</code>
        </div>
        <div>
          <span>cmd + down arrow</span>
          <code>move down</code>
        </div>
        <div>
          <span>cmd + left arrow</span>
          <code>move left</code>
        </div>
        <div>
          <span>cmd + right arrow</span>
          <code>move right</code>
        </div>
        <div>
          <span>enter</span>
          <code>create a child node</code>
        </div>
        <div>
          <span>shift + enter</span>
          <code>create a sibling node</code>
        </div>
        <div>
          <span>cmd + delete</span>
          <code>delete node</code>
        </div>
      </Shortcuts>
    </Container>
  );
};

Spotlight.propTypes = {
  visibilityIsPrivate: PropTypes.bool.isRequired,
  closeSpotlight: PropTypes.func.isRequired,
  handleUpdateDocumentPrivate: PropTypes.func.isRequired,
  handleDeleteDocument: PropTypes.func.isRequired,
  navigateToDashboard: PropTypes.func.isRequired,
  handleDuplicateDocument: PropTypes.func.isRequired,
  navigateToDuplicate: PropTypes.func.isRequired,
  isDeleted: PropTypes.bool.isRequired
};

const mapStateToProps = ({ documents: { active, all } }, ownProps) => ({
  visibilityIsPrivate: all[active.id].private,
  isDeleted: Boolean(all[active.id].deletedAt)
});

const mapDispatchToProps = dispatch => ({
  closeSpotlight: () => dispatch(changeSpotlightVisibility()),
  handleUpdateDocumentPrivate: () => dispatch(updateDocumentPrivacy()),
  handleDeleteDocument: async () => dispatch(deleteDocument()),
  navigateToDashboard: () => dispatch(push("/")),
  handleDuplicateDocument: async () => dispatch(duplicateDocument()),
  navigateToDuplicate: humanId => dispatch(push(`/d/${humanId}`))
});

export default connect(mapStateToProps, mapDispatchToProps)(Spotlight);
