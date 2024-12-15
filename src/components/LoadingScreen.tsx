import { ThreeDots } from "react-loader-spinner";

const LoadingScreen = () => {
  return (
    <div className="w-screen h-screen fixed top-0 left-0 z-50 bg-white flex justify-center items-center">
      <ThreeDots
        visible={true}
        height="60"
        width="60"
        color="#3b82f6"
        radius="9"
        ariaLabel="three-dots-loading"
        wrapperStyle={{}}
        wrapperClass=""
      />
    </div>
  );
};

export default LoadingScreen;
