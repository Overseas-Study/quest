import MainMarketing from "./MainMarketing";
import QuestNavBlock from "./QuestNavBlock";
import { ChatBubbleLeftRightIcon, CheckBadgeIcon, ComputerDesktopIcon, SpeakerWaveIcon } from "@heroicons/react/24/outline";

const Landing = () => {
  return (
    <div className="flex items-center gap-x-32 justify-center h-screen">
      <MainMarketing />
      <div className="grid grid-cols-2 gap-6">
        <QuestNavBlock
          title="Gather hard-to-find information"
          Icon={ChatBubbleLeftRightIcon}
          link={"/info-quest"}
        />
        <QuestNavBlock
          title="Verify candidate skills"
          Icon={CheckBadgeIcon}
          link={"/info-quest"}
        />
        <QuestNavBlock
          title="Host your own hackathon"
          Icon={ComputerDesktopIcon}
          link={"/info-quest"}
        />
        <QuestNavBlock
          title="Engage with your audience"
          Icon={SpeakerWaveIcon}
          link={"/info-quest"}
        />
      </div>
    </div>
  );
};

export default Landing;
