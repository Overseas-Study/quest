"use client";

import CompactQuestCard from "../../components/management/CompactQuestCard";
import QuestDetails from "../../components/management/QuestDetails";
import StatisticDisplay from "../../components/management/StatisticDisplay";
import { GearApi } from "@gear-js/api";
import { useState, useEffect } from "react";
import { Program } from "../../lib/infoQuest";

const INFO_QUEST_ID =
  "0x726db3a23fc98b838572bfcc641776dd9f510071f400d77fac526266c0fcdca7";

export default function Management() {
  const [selectedQuest, setSelectedQuest] = useState(null);
  const [gearApi, setGearApi] = useState(null);
  const [compactQuests, setCompactQuests] = useState([]);
  const [totalSubmission, setTotalSubmission] = useState(0);
  const [decidedCount, setDecidedCount] = useState(0);

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
        // Calculate total submission count and decided count.
        let total = 0;
        let decided = 0;
        for (const quest of res) {
          total += quest.submission_count;
          decided += quest.decision_count;
        }
        setTotalSubmission(total);
        setDecidedCount(decided);
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
      <div className="flex flex-col items-center mr-12 divide-y divide-solid w-1/3">
        <div className="w-full mb-4">
          <StatisticDisplay
            submissionTotal={totalSubmission}
            decided={decidedCount}
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
      <div className="w-2/3">
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
