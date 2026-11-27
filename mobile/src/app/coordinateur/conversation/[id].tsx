import { useLocalSearchParams } from 'expo-router';
import { EcranConversation } from '@/components/Messagerie';

export default function ConversationCoordinateur() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <EcranConversation id={id} />;
}
