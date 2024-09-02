const FullQuestCard = ({ status, rewardAmount, title, deadline, publisher, description, submissionType, requirements }) => {
  return (
    <div className="flex flex-col max-w-lg gap-y-2 border border-solid border-custom-primary p-4 rounded-lg bg-custom-primary">
      <div className="grid grid-cols-3">
        <div className="col-span-1 grid justify-items-between">
          <img src="/questLogo.svg" alt="quest" />
        </div>
        <div className="col-span-2">
            <p>{status} <span>Reward: {rewardAmount} TVARA</span></p>
            <p>{title}</p>
            <p>deadline: {deadline}</p>
            <p>publisher: {publisher}</p>
        </div>
      </div>
      <div className="divide-y divide-solid">
        <p>Description</p>
        <p className="py-2">
          {description}
        </p>
      </div>
      <div className="divide-y divide-solid">
        <div>
          <p>Submission Requirements</p>
          <p>Submit in: {submissionType}</p>
        </div>
        <p>{requirements}</p>
      </div>
    </div>
  );
};

export default FullQuestCard;
