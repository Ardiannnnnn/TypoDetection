import Image from "next/image";

export default function Loader() {
  return (
    <div className="flex items-center justify-center">
      <Image 
        src="/loader.gif"   // simpan di folder public/loader.gif
        alt="Loading..." 
        width={100} 
        height={100} 
        unoptimized         // wajib untuk GIF agar tetap animasi
      />
    </div>
  );
}
