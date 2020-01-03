import useStore from "./../store";

/**
 * Fetches full document information.
 */
const useCurrentDocument = () => {
  const [
    {
      currentDoc: { id, ...currentDoc },
      documents
    },
    actions
  ] = useStore();
  const doc = id ? Object.assign(documents[id], currentDoc) : null;
  return [doc, actions];
};

/**
 * Select the current user's permissions for a document.
 */
const useDocumentPermissions = () => {
  const [doc] = useCurrentDocument();
  const [{ user }] = useStore();

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
};

export { useCurrentDocument, useDocumentPermissions };
