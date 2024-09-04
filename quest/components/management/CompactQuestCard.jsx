const CompactQuestCard = ({ title, deadline, status, description, logo }) => {
  return (
    <div className="grid grid-cols-3 max-w-xl border border-solid rounded-lg px-4 py-2 justify-between bg-custom-primary">
      <div className="col-span-2 divide-y divide-solid">
        <div>
          <p className="text-custom-secondary">{title}</p>
          <div className="flex justify-between text-sm">
            <p className="text-custom-gray">deadline: {deadline}</p>
            <span className="ml-4 text-custom-gray">{status}</span>
          </div>
        </div>
        <div className="py-2">
          <p className="text-custom-secondary text-sm">
            {description}
          </p>
        </div>
      </div>
      <div className="grid ol-span-1 justify-items-center">
        <img
          className="crounded-lg"
          width={139}
          height={167}
          src={`/${logo}`}
          alt="quest"
        />
      </div>
    </div>
  );
};

export default CompactQuestCard;
