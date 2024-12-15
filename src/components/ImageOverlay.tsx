import { DEFAULT_IMAGE } from "@/constants/image";
import Image from "next/image";

interface Props {
  src?: string | null;
  setSrc?: (src?: string) => void;
}

const ImageOverlay = ({ src, setSrc }: Props) => {
  if (!src) {
    return null;
  }
  return (
    <div
      className="w-screen h-screen bg-center bg-cover fixed flex justify-center items-center bg-black/50 z-50"
      onClick={() => setSrc?.(undefined)}
    >
      <Image
        src={src || DEFAULT_IMAGE}
        alt="Background"
        width={900}
        height={900}
        className="object-cover w-full md:w-1/2 lg:w-1/3 h-auto"
      />
    </div>
  );
};

export default ImageOverlay;
