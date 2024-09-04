const FullQuestCard = ({
  status,
  rewardAmount,
  title,
  deadline,
  publisher,
  description,
  submissionType,
  requirements,
}) => {
  return (
    <div className="flex flex-col max-w-lg gap-y-2 border border-solid border-custom-primary p-4 rounded-lg bg-custom-primary">
      <div className="grid grid-cols-3">
        <div className="col-span-1 grid justify-items-between">
          <img src="/questLogo.svg" alt="quest" />
        </div>
        <div className="col-span-2">
          <div className="flex justify-between">
            <p className="text-sm text-custom-gray">{status}</p>
            <p className="text-sm text-custom-gray">Reward: {rewardAmount} TVARA</p>
          </div>
          <p className="text-lg text-custom-black mb-2">{title}</p>
          <p className="text-sm text-custom-secondary">deadline: {deadline}</p>
          <p className="text-sm text-custom-secondary truncate">publisher: {publisher}</p>
        </div>
      </div>
      <div className="divide-y divide-solid">
        <p className="text-lg text-custom-secondary">Description</p>
        <p className="py-2 text-sm text-custom-gray">{description}</p>
      </div>
      <div className="divide-y divide-solid">
        <div>
          <p className="text-lg text-custom-secondary">Submission Requirements</p>
          <p className="text-sm underline">Submit in: {submissionType}</p>
        </div>
        <p className="text-sm text-custom-gray">{requirements}</p>
      </div>
    </div>
  );
};

export default FullQuestCard;
