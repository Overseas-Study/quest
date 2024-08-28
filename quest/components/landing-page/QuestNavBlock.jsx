import Link from "next/link";

const QuestNavBlock = ({ title, Icon, link }) => {
  return (
    <Link href={link}>
      <div className="flex flex-col items-center border border-solid px-12 py-4 rounded-lg border-custom-gray">
        <p className="text-custom-primary">{title}</p>
        {Icon && <Icon className="h-32 w-32 text-custom-accent" />}
      </div>
    </Link>
  );
};

export default QuestNavBlock;
