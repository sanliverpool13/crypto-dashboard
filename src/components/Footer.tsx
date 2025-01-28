const Footer = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="flex lg:w-10/12 w-full max-w-7xl items-center">
        <p className="text-left">
          Made by{" "}
          <a
            href="https://www.sanjarjelet.com"
            className="underline text-blue-700"
            target="_blank"
          >
            {" "}
            Sanjar Jelet
          </a>
        </p>
      </div>
    </div>
  );
};

export default Footer;
