import { Session } from "next-auth";

interface ConversationListProps {
  session: Session;
}

const ConversationList: React.FC<ConversationListProps> = ({ session }) => {
  return <div>Make a good code</div>;
};

export default ConversationList;
