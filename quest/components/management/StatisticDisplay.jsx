const submissionTotal = 25;
const decided = 4;

const StatisticDisplay = ({ submissionTotal, decided }) => {
  return (
    <div className="flex flex-row w-full justify-between">
      <div className="border border-solid border-custom-accent px-4 py-2 rounded-lg bg-custom-accent text-custom-primary">
        <p>Total:</p>
        <p>{submissionTotal} submissions.</p>
      </div>
      <div className="border border-solid border-custom-accent px-4 py-2 rounded-lg">
        <p className="text-custom-primary">Decided:</p>
        <p className="text-custom-accent">
          {decided} / {submissionTotal}
        </p>
      </div>
    </div>
  );
};

export default StatisticDisplay;
