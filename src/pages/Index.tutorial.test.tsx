import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import Index from "@/pages/Index";

describe("Index (tutorial gate)", () => {
  it("mostra o modal antes da página inicial e renderiza a página após fechar", async () => {
    vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(
      () => undefined,
    );
    vi.spyOn(HTMLMediaElement.prototype, "load").mockImplementation(
      () => undefined,
    );

    render(<Index />);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.queryByText(/twinex tecnologia/i)).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: /^fechar$/i }));

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).toBeNull();
    });
    expect(screen.getByText(/twinex tecnologia/i)).toBeInTheDocument();
  });
});
