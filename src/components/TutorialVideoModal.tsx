import { useEffect, useRef, useState, type PointerEvent } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { AlertTriangle, RotateCcw, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type TutorialVideoModalProps = {
  open: boolean;
  onClose: () => void;
  videoSrc?: string;
};

const TutorialVideoModal = ({
  open,
  onClose,
  videoSrc = "/202603280807.mp4",
}: TutorialVideoModalProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasError, setHasError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const swipeStartRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!open) return;
    setHasError(false);
    setReloadKey((k) => k + 1);
  }, [open]);

  const stopVideo = () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      video.pause();
      video.currentTime = 0;
      video.removeAttribute("src");
      video.load();
    } catch {
      video.pause();
    }
  };

  const handleClose = () => {
    stopVideo();
    onClose();
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) return;
    handleClose();
  };

  const handleSwipeStart = (event: PointerEvent) => {
    swipeStartRef.current = { x: event.clientX, y: event.clientY };
  };

  const handleSwipeEnd = (event: PointerEvent) => {
    const start = swipeStartRef.current;
    swipeStartRef.current = null;
    if (!start) return;

    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;

    if (dy > 80 && Math.abs(dy) > Math.abs(dx) * 1.2) {
      handleClose();
    }
  };

  const requestFullscreenForMobile = async () => {
    const video = videoRef.current as unknown as {
      requestFullscreen?: () => Promise<void>;
      webkitEnterFullscreen?: () => void;
    } | null;
    if (!video) return;

    const isTouch =
      typeof navigator !== "undefined" &&
      (navigator.maxTouchPoints > 0 || "ontouchstart" in window);
    const isMobileViewport =
      window.matchMedia?.("(max-width: 768px)")?.matches ?? false;

    if (!isTouch || !isMobileViewport) return;

    try {
      if (video.requestFullscreen) {
        await video.requestFullscreen();
        return;
      }
    } catch {}

    try {
      video.webkitEnterFullscreen?.();
    } catch {}
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={handleOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
          onPointerDown={(event) => {
            event.preventDefault();
            handleClose();
          }}
          onClick={(event) => {
            event.preventDefault();
            handleClose();
          }}
        />
        <DialogPrimitive.Content
          className={cn(
            "tutorial-video-modal-content fixed left-[50%] top-[50%] z-50 flex w-full translate-x-[-50%] translate-y-[-50%] flex-col gap-4 border border-border bg-background p-4 text-foreground shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg sm:p-6",
            "w-[calc(100vw-1.5rem)] max-w-5xl overflow-hidden sm:max-h-[90vh]",
          )}
        >
          <div className="flex items-center justify-center sm:hidden">
            <button
              type="button"
              aria-label="Arraste para fechar"
              data-testid="tutorial-swipe-handle"
              className="h-11 w-full max-w-[160px] touch-manipulation rounded-full"
              onPointerDown={handleSwipeStart}
              onPointerUp={handleSwipeEnd}
              onPointerCancel={() => {
                swipeStartRef.current = null;
              }}
            >
              <div className="mx-auto h-1.5 w-16 rounded-full bg-muted" />
            </button>
          </div>

          <div className="space-y-2 pr-8">
            <DialogPrimitive.Title className="text-lg font-semibold leading-none tracking-tight">
              Tutorial rápido
            </DialogPrimitive.Title>
            <DialogPrimitive.Description className="text-sm text-muted-foreground">
              Assista ao vídeo para entender como usar o aplicativo.
            </DialogPrimitive.Description>
          </div>

          {hasError ? (
            <div className="rounded-lg border border-border bg-card p-4 text-card-foreground sm:p-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 text-destructive" />
                <div className="space-y-1">
                  <p className="font-medium">
                    Não foi possível carregar o tutorial
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Verifique sua conexão ou tente novamente. Você também pode
                    continuar para a página inicial.
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <Button
                  variant="secondary"
                  className="h-11"
                  onClick={handleClose}
                >
                  Continuar
                </Button>
                <Button
                  variant="outline"
                  className="h-11"
                  onClick={() => {
                    setHasError(false);
                    setReloadKey((k) => k + 1);
                  }}
                >
                  <RotateCcw />
                  Tentar novamente
                </Button>
              </div>
            </div>
          ) : (
            <div className="tutorial-video-container relative flex flex-1 overflow-hidden rounded-lg border border-border bg-card">
              <video
                key={reloadKey}
                ref={videoRef}
                src={videoSrc}
                data-testid="tutorial-video"
                className="h-full w-full bg-background object-contain"
                controls
                playsInline
                preload="metadata"
                onError={() => setHasError(true)}
                onPlay={() => {
                  void requestFullscreenForMobile();
                }}
              />
            </div>
          )}

          <button
            type="button"
            aria-label="Fechar"
            className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-md opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
            onClick={handleClose}
          >
            <X className="h-4 w-4" />
          </button>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};

export default TutorialVideoModal;
