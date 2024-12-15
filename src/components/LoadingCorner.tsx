import { ThreeDots } from "react-loader-spinner";

interface Props {
  visible: boolean;
}

const LoadingCorner = ({ visible }: Props) => {
  if (!visible) return null;
  return (
    <div className="fixed bottom-0 right-4 mb-4 mr-4">
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

export default LoadingCorner;
