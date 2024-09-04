"use client";

import CompactQuestCard from "@/components/management/CompactQuestCard";
import QuestDetails from "@/components/management/QuestDetails";
import StatisticDisplay from "@/components/management/StatisticDisplay";
import { GearApi } from "@gear-js/api";
import { useState, useEffect } from "react";
import { Program } from "@/lib/infoQuest";

const INFO_QUEST_ID =
  "0x05e823722bb816108771a3870a2c6de996be28c9193775733a310a6b4903cc3b";

export default function Management() {
  const [selectedQuest, setSelectedQuest] = useState(null);
  const [gearApi, setGearApi] = useState(null);
  const [compactQuests, setCompactQuests] = useState([]);

  useEffect(() => {
    // Initialize the Gear API
    const connectToGearApi = async () => {
      try {
        const api = await GearApi.create({
          providerAddress: "wss://testnet.vara.network",
        });
        setGearApi(api);
        // Load the program.
        const infoQuest = new Program(api, INFO_QUEST_ID);
        const res = await infoQuest.infoQuestSvc.getCompactQuestsInfo();
        console.log("Connected to Vara testnet");
        setCompactQuests(res);
      } catch (error) {
        console.error("Failed to connect to Gear API:", error);
      }
    };

    connectToGearApi();
  }, []);

  const handleClick = (title) => {
    setSelectedQuest(title);
    console.log(`Selected quest: ${title}`);
  };

  return (
    <div className="flex">
      {/* The left-side pannel on the information quest page */}
      <div className="flex flex-col items-center mr-12 divide-y divide-solid">
        <div className="w-full mb-4">
          <StatisticDisplay
            submissionTotal={25}
            decided={4}
          />
        </div>
        {/* Show succint information about published quests. */}
        <ul className="flex flex-col p-4 gap-y-2">
          {compactQuests.length !== 0 ? (
            compactQuests.map((quest) => (
              <li onClick={() => handleClick(quest.title)}>
                <CompactQuestCard
                  key={quest.title}
                  title={quest.title}
                  deadline={quest.deadline}
                  status={quest.quest_status}
                  description={quest.description}
                  logo="questLogo.svg"
                />
              </li>
            ))
          ) : (
            <p>Loading...</p>
          )}
        </ul>
      </div>
      {/* The information quest form */}
      <div>
        {selectedQuest && (
          <QuestDetails
            gearApi={gearApi}
            title={selectedQuest}
            infoQuestId={INFO_QUEST_ID}
          />
        )}
      </div>
    </div>
  );
}
