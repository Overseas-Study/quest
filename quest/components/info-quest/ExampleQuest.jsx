const ExampleQuest = ({ Icon, tagLine }) => {
  return (
    <div className="flex items-center gap-x-2 border border-dashed border-custom-accent rounded-lg p-2">
      {Icon && <Icon className="h-8 w-8 text-custom-primary" />}
      <p className="text-custom-primary">{tagLine}</p>
    </div>
  );
};

export default ExampleQuest;
