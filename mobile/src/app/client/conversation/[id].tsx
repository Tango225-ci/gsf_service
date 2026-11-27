import { useLocalSearchParams } from 'expo-router';
import { EcranConversation } from '@/components/Messagerie';

export default function ConversationClient() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <EcranConversation id={id} />;
}
