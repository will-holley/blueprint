import React from "react";
//* GraphQL
import { useQuery, gql } from "@apollo/client";
//* Components
import GradientText from "client/components/GradientText";
import { H1 } from "client/components/tags";
import Container from "client/components/PaddedContainer";
import AuthenticationButtons from "client/components/AuthenticationButtons";
import { RightActions } from "client/components/Actions";
//* Local Components
import DocumentListItem from "./components/DocumentListItem";
import CreateDocumentButton from "./components/CreateDocumentButton";
//* Graphql
import { DocumentFragment } from "./gql";

//* ================
//* == Root Query ==
//* ================

const DashboardQuery = gql`
  query DashboardQuery {
    documents(orderBy: UPDATED_AT_DESC) {
      nodes {
        ...DocumentFragment
      }
    }
    currentUserId
  }
  ${DocumentFragment}
`;

//* =====================
//* == React Component ==
//* =====================

const Dashboard = () => {
  const { loading, error, data, refetch } = useQuery(DashboardQuery, {
    // Load new documents from server when navigating to Dashboard.
    fetchPolicy: "cache-and-network"
  });
  const isAuthenticated = Boolean(data && data.currentUserId);
  const documents = data && data.documents.nodes;

  console.log(data, error);

  return (
    <Container>
      {loading ? (
        <GradientText>
          <H1>Loading</H1>
        </GradientText>
      ) : (
        <>
          <RightActions>
            <AuthenticationButtons
              isAuthenticated={isAuthenticated}
              refetchDashboardData={refetch}
            />
            {isAuthenticated && <CreateDocumentButton />}
          </RightActions>
          {documents.length ? (
            documents.map(item => <DocumentListItem key={item.id} {...item} />)
          ) : isAuthenticated ? (
            <GradientText>
              <H1>Click ➕ to start</H1>
            </GradientText>
          ) : (
            <H1>👀 ➡️</H1>
          )}
        </>
      )}
    </Container>
  );
};

export default Dashboard;
export { DashboardQuery };
