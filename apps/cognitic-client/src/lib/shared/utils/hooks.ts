export const clickOutside = (
  node: HTMLElement,
  handler: (event: MouseEvent) => void
): { destroy: () => void } => {
  const onClick = (event: MouseEvent) =>
    node &&
    !node.contains(event.target as HTMLElement) &&
    !event.defaultPrevented &&
    handler(event);

  document.addEventListener('click', onClick, true);

  return {
    destroy() {
      document.removeEventListener('click', onClick, true);
    }
  };
};
