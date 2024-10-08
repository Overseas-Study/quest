import Link from "next/link";

const MainMarketing = () => {
  return (
    <div className="flex flex-col max-w-96 gap-y-6 font-playfair">
      <div>
        <p className="text-custom-primary text-2xl">Start web3</p>
        <p className="text-custom-primary text-4xl">
          Through <span className="text-custom-accent">QUEST</span>
        </p>
      </div>
      <Link href="/info-quest" className="transform transition-transform duration-300 hover:scale-105 hover:-translate-x-1 hover:-translate-y-1">
        <button className="bg-custom-primary text-custom-black border border-solid rounded-full px-12 py-1">
          Publish Quest
        </button>
      </Link>
    </div>
  );
};

export default MainMarketing;
