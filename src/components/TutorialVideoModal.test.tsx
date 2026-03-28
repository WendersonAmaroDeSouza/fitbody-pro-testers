import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";

import TutorialVideoModal from "@/components/TutorialVideoModal";

const ModalHarness = () => {
  const [open, setOpen] = useState(true);

  return (
    <>
      <TutorialVideoModal open={open} onClose={() => setOpen(false)} />
      <div data-testid="harness-open">{String(open)}</div>
    </>
  );
};

describe("TutorialVideoModal", () => {
  it("renderiza com classes do design system e vídeo configurado", () => {
    const pauseSpy = vi
      .spyOn(HTMLMediaElement.prototype, "pause")
      .mockImplementation(() => undefined);
    const loadSpy = vi
      .spyOn(HTMLMediaElement.prototype, "load")
      .mockImplementation(() => undefined);

    render(<ModalHarness />);

    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveClass("bg-background");
    expect(dialog).toHaveClass("border");

    const video = screen.getByTestId("tutorial-video");
    expect(video).toHaveAttribute("src", "/202603280807.mp4");
    expect(video).toHaveAttribute("controls");
    expect(screen.getByRole("button", { name: /^fechar$/i })).toHaveClass(
      "h-11",
      "w-11",
    );
    expect(
      screen.getByRole("button", {
        name: /terminou de assistir ao vídeo tutorial\?/i,
      }),
    ).toBeInTheDocument();

    pauseSpy.mockRestore();
    loadSpy.mockRestore();
  });

  it("fecha ao fazer swipe para baixo no handle mobile", async () => {
    vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(
      () => undefined,
    );
    vi.spyOn(HTMLMediaElement.prototype, "load").mockImplementation(
      () => undefined,
    );

    render(<ModalHarness />);

    const handle = screen.getByTestId("tutorial-swipe-handle");
    fireEvent.pointerDown(handle, {
      pointerType: "touch",
      clientX: 10,
      clientY: 10,
    });
    fireEvent.pointerUp(handle, {
      pointerType: "touch",
      clientX: 10,
      clientY: 140,
    });

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).toBeNull();
    });
  });

  it("fecha via botão X e garante parada completa do vídeo", async () => {
    const pauseSpy = vi
      .spyOn(HTMLMediaElement.prototype, "pause")
      .mockImplementation(() => undefined);
    const loadSpy = vi
      .spyOn(HTMLMediaElement.prototype, "load")
      .mockImplementation(() => undefined);

    render(<ModalHarness />);

    fireEvent.click(screen.getByRole("button", { name: /^fechar$/i }));

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).toBeNull();
    });

    expect(pauseSpy).toHaveBeenCalled();
    expect(loadSpy).toHaveBeenCalled();

    pauseSpy.mockRestore();
    loadSpy.mockRestore();
  });

  it("fecha via botão inferior e garante parada completa do vídeo", async () => {
    const pauseSpy = vi
      .spyOn(HTMLMediaElement.prototype, "pause")
      .mockImplementation(() => undefined);
    const loadSpy = vi
      .spyOn(HTMLMediaElement.prototype, "load")
      .mockImplementation(() => undefined);

    render(<ModalHarness />);

    fireEvent.click(
      screen.getByRole("button", {
        name: /terminou de assistir ao vídeo tutorial\?/i,
      }),
    );

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).toBeNull();
    });

    expect(pauseSpy).toHaveBeenCalled();
    expect(loadSpy).toHaveBeenCalled();

    pauseSpy.mockRestore();
    loadSpy.mockRestore();
  });

  it("fecha via tecla ESC", async () => {
    vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(
      () => undefined,
    );
    vi.spyOn(HTMLMediaElement.prototype, "load").mockImplementation(
      () => undefined,
    );

    render(<ModalHarness />);

    fireEvent.keyDown(document, { key: "Escape" });

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).toBeNull();
    });
  });

  it("fecha ao clicar fora do modal", async () => {
    vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(
      () => undefined,
    );
    vi.spyOn(HTMLMediaElement.prototype, "load").mockImplementation(
      () => undefined,
    );

    render(<ModalHarness />);

    const overlay = document.querySelector('div[class*="bg-black/80"]');
    expect(overlay).toBeTruthy();

    fireEvent.pointerDown(overlay as Element);
    fireEvent.pointerUp(overlay as Element);
    fireEvent.click(overlay as Element);
    fireEvent.pointerDown(document.body);
    fireEvent.pointerUp(document.body);
    fireEvent.click(document.body);

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).toBeNull();
    });
  });

  it("exibe fallback de erro e permite tentar novamente", async () => {
    vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(
      () => undefined,
    );
    vi.spyOn(HTMLMediaElement.prototype, "load").mockImplementation(
      () => undefined,
    );

    render(<ModalHarness />);

    const video = screen.getByTestId("tutorial-video");
    fireEvent.error(video);

    expect(
      await screen.findByText(/não foi possível carregar o tutorial/i),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /tentar novamente/i }));

    await waitFor(() => {
      expect(
        screen.queryByText(/não foi possível carregar o tutorial/i),
      ).toBeNull();
    });
    expect(screen.getByTestId("tutorial-video")).toBeInTheDocument();
  });
});
