import Navbar from "./components/Navbar";
import ToastWrapper from "./components/lib/ToastWrapper";
import Modals from "./components/modals/Modals";

export default function GlobalComponentProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
        <ToastWrapper/>
        <Modals/>
        {children}
    </>
  );
}
