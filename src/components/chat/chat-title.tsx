export function ChatTitle({ title }: { title: string }) {
  return (
    <div className="-translate-x-1/2 fixed top-6 left-[50%] z-50 flex items-center justify-center gap-2">
      <span className="max-w-[50vw] truncate font-medium text-sm">
        {title === "" ? "New chat" : title}
      </span>
    </div>
  );
}
