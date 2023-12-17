import Image from "next/image";

const LoadingScreen: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-screen w-screen bg-black">
      <div className="relative h-64 w-64">
        <Image fill={true} src="/logos/aaanh.png" alt="Loading..." className="motion-safe:animate-spin animate-ping h-20 w-20 object-contain" />
      </div>
    </div>
  );
};

export default LoadingScreen;
