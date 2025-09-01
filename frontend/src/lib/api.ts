import type { ChatResponse, Message } from '../types/chat.types';

/* The `chatApi` object contains a method `sendMessage` that sends messages to a chat server using
Server-Sent Events (SSE). Here's a breakdown of what the method does: */
export const chatApi = {
  sendMessage: async (
    messages: Message[],
    onChunk: (chunk: ChatResponse) => void
  ): Promise<ChatResponse> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ messages })
    });

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let accumulatedMessage: string = '';

    if (!reader) throw new Error('Failed to get response reader');

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      // Decodifica y procesa cada chunk
      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');

      // Procesa cada línea del chunk
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const jsonStr = line.slice(6);
          try {
            const data = JSON.parse(jsonStr);
            // Maneja diferentes estados de la respuesta
            if (data.status === 'streaming' && data.content) {
              // Acumula el contenido del mensaje y notifica
              accumulatedMessage += data.content;
              onChunk({ content: accumulatedMessage, status: 'streaming' });
            } else if (data.status === 'generating_image') {
              // Notifica cuando comienza la generación de imagen
              onChunk({
                content: 'Generando imagen...',
                status: 'generating_image'
              });
            } else if (data.status === 'done') {
              // Finaliza el streaming y retorna el mensaje completo
              onChunk({ content: accumulatedMessage, status: 'done' });
              return { content: accumulatedMessage, status: 'done' };
            }
          } catch (e) {
            console.error('Failed to parse SSE chunk:', e);
          }
        }
      }
    }
    //Retorna el mensaje acumulado si el stream termina
    return { content: accumulatedMessage, status: 'done' };
  }
};
