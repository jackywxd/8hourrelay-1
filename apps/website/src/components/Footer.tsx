export default function Footer({
  className,
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <footer className="flex w-full">
      <div className="m-4 flex w-full flex-col items-center justify-between gap-4 p-10 sm:flex-col md:h-24 md:py-0">
        <div className="copyright">
          <span>© 8-Hour Relay 2025</span>
        </div>
      </div>
    </footer>
  );
}
