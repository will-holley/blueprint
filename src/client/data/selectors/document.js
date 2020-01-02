import { createHook } from "react-sweet-state";
import { createSelector } from "reselect";
import { store } from "./../store";

const currentDocumentSelector = ({
  currentDoc: { id, ...currentDoc },
  documents
}) => {
  return id ? Object.assign(documents[id], currentDoc) : null;
};

const userSelector = state => state.user;

/**
 * Fetches full document information.
 */
const useCurrentDocument = createHook(store, {
  selector: createSelector(currentDocumentSelector, d => d)
});

/**
 * Given an active node, finds the id of the parent node.
 */
const findParentNodeId = createHook(store, {
  selector: createSelector(
    currentDocumentSelector,
    ({ id, activeNodeId, edges }) => {
      //? Confirm that there is a currently selected doc and an active node.
      if (!id || !activeNodeId) return null;
      //? Find the parent id
      const edge = Object.values(edges).find(
        ({ nodeB }) => nodeB === activeNodeId
      );
      return edge ? edge.nodeA : null;
    }
  )
});

/**
 * Select the current user's permissions for a document.
 */
const useDocumentPermissions = createHook(store, {
  selector: createSelector(
    currentDocumentSelector,
    userSelector,
    (doc, user) => {
      //? Set default permissions
      const permissions = {
        readOnly: true,
        editTitle: false,
        editTags: false,
        addNodes: false
      };

      //? Check that there is both a current document and user.
      if (!doc || !user) return permissions;

      //? If there is a user logged in, the user's add/edit/delete
      //? permissions are more granular.
      permissions.readOnly = false;

      //? Check if user is the creator of this document
      const isCreator = doc.createdBy === user.id;
      //? Check if the document is public
      const docIsPublic = !doc.private;

      //$ Only creator can edit title and tags
      permissions.editTitle = isCreator;
      permissions.editTags = isCreator;

      //$ Any logged in user can add nodes to a public document.
      permissions.addNodes = isCreator || docIsPublic;

      return permissions;
    }
  )
});

export { useCurrentDocument, useDocumentPermissions, findParentNodeId };
