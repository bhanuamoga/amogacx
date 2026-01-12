declare module "react-speech-recognition" {
  const SpeechRecognition: {
    startListening: (options?: any) => void;
    stopListening: () => void;
    abortListening: () => void;
  };

  export default SpeechRecognition;

  export function useSpeechRecognition(): {
    transcript: string;
    listening: boolean;
    resetTranscript: () => void;
    browserSupportsSpeechRecognition: boolean;
  };
}
