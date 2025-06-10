"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AudioLines } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import speechToText, { useSpeechRecognition } from "react-speech-recognition";

export function SpeechRecognition({
  value,
  setValue,
  className
}: { value: string; setValue: (value: string) => void; className?: string }) {
  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } =
    useSpeechRecognition();

  const [hasUsedSpeechRecognition, setHasUsedSpeechRecognition] = useState(false);
  const [hasManualInput, setHasManualInput] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const previousValueRef = useRef(value);

  // Ensure component only renders after hydration
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Track if user has manually typed text
  useEffect(() => {
    if (value !== previousValueRef.current) {
      // If value changed but not from speech recognition and not cleared
      if (!listening && value.length > previousValueRef.current.length) {
        setHasManualInput(true);
      }
      // Reset manual input flag if value is cleared
      if (value === "") {
        setHasManualInput(false);
      }
    }
    previousValueRef.current = value;
  }, [value, listening]);

  const toggleListening = useCallback(() => {
    if (listening) {
      speechToText.stopListening();
      setHasUsedSpeechRecognition(true);
    } else {
      resetTranscript();
      speechToText.startListening();
    }
  }, [listening, resetTranscript]);

  const disabled = useMemo(() => {
    return (
      !browserSupportsSpeechRecognition || hasManualInput || hasUsedSpeechRecognition
    );
  }, [browserSupportsSpeechRecognition, hasManualInput, hasUsedSpeechRecognition]);

  useEffect(() => {
    if (transcript && listening) {
      setValue(transcript);
    }
  }, [transcript, listening, setValue]);

  return (
    <Button
      onClick={toggleListening}
      disabled={disabled}
      size={"icon"}
      variant={"ghost"}
      className={cn("rounded-xl", className)}
    >
      <AudioLines
        className={cn(
          "transition-all duration-200",
          listening && "animate-pulse text-red-500"
        )}
      />
    </Button>
  );
}
