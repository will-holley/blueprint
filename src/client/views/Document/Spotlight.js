import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { connect } from "react-redux";
//* Components
import { H1, H2, H4, Button } from "client/components/tags";
import GradientText from "client/components/GradientText";
import Toggle from "client/components/Toggle";

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
  opacity: 0.85;

  // Interior
  padding: 10rem;

  // Layout
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  column-gap: 10rem;
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

const Spotlight = ({ visibilityIsPrivate }) => (
  <Container>
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
          />
          <p>
            Update the visibility of this Blueprint. A private Blueprint is only
            visible and editable by you. Public Blueprints are visible to all
            and can be edited by member of the Blueprint community.
          </p>
        </div>
        <div>
          <Button>🍴 Duplicate</Button>
          <p>
            Duplicating this Blueprint creates an identical private copy of it.
          </p>
        </div>
        <div>
          <Button>🗑 Add to Trash</Button>
          <p>
            Adding this Blueprint to the trash will hide it from your Dashboard.
            Don't worry, you can always get it back by clicking the 🗑 on your
            dashboard.
          </p>
        </div>
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
            <i>View</i> menu in the top left corner of your screen and deselect
            "Always Show Toolbar in Full Screen" and "Always Show Bookmarks
            Bar".
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

Spotlight.propTypes = {
  visibilityIsPrivate: PropTypes.bool.isRequired
};

const mapStateToProps = ({ documents: { active, all } }, ownProps) => ({
  visibilityIsPrivate: all[active.id].private
});

export default connect(mapStateToProps)(Spotlight);