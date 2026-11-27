import { useLocalSearchParams } from 'expo-router';
import { EcranConversation } from '@/components/Messagerie';

export default function ConversationAgent() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <EcranConversation id={id} />;
}
