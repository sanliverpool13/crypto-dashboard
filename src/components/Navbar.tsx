import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  return (
    <div className="w-full flex justify-between max-w-7xl lg:w-10/12 ">
      <div className="flex-grow" />
      <ThemeToggle />
    </div>
  );
};

export default Navbar;
