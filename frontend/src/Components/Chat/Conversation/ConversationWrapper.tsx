import { Session } from "next-auth";

interface ConversationWrapperProps {
  session: Session;
}

const ConversationWrapper: React.FC<ConversationWrapperProps> = ({
  session,
}) => {
  return <div>Make a good code</div>;
};

export default ConversationWrapper;
