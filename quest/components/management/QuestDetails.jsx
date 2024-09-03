"use client";

import { useState, useEffect } from "react";
import FullQuestCard from "./FullQuestCard";
import SubmissionCard from "./SubmissionCard";
import { Program } from "@/lib/infoQuest";

const QuestDetails = ({ gearApi, title, infoQuestId }) => {
  const [fullQuestDetails, setFullQuestDetails] = useState(null);
  const [parsedSubmissions, setParsedSubmissions] = useState([]);
  // Retrieve detailed information for display, including quest details and submission details.
  useEffect(() => {
    const readFullQuests = async () => {
      // Load the program
      const infoQuest = new Program(gearApi, infoQuestId);
      const questRes = await infoQuest.infoQuestSvc.getQuest(title);
      const submissionRes = await infoQuest.infoQuestSvc.getSubmissions(title);
      setFullQuestDetails(questRes);
      // Parse submission result
      const parsed = [];
      for (const [participant, submission] of Object.entries(
        submissionRes.map
      )) {
        parsed.push({
          participant,
          submission,
          status: submissionRes.status[participant],
        });
      }
      setParsedSubmissions(parsed);
      console.log(parsed);
    };

    readFullQuests();
  }, [title]);

  return (
    <div className="flex gap-x-1">
      {fullQuestDetails ? (
        <div>
          <FullQuestCard
            status={fullQuestDetails.quest_status}
            rewardAmount={fullQuestDetails.reward_amount}
            title={title}
            deadline={fullQuestDetails.deadline}
            publisher={fullQuestDetails.publisher_id}
            description={fullQuestDetails.description}
            submissionType={fullQuestDetails.submission_type}
            requirements={fullQuestDetails.submission_requirements}
          />
        </div>
      ) : (
        <p>Loading...</p>
      )}
      <ul>
        {parsedSubmissions.length != 0 ? (
          parsedSubmissions.map((parsedSubmission) => (
            <li key={parsedSubmission.participant}>
              <SubmissionCard
                participant={parsedSubmission.participant}
                link={parsedSubmission.submission}
                decision={parsedSubmission.status}
              />
            </li>
          ))
        ) : (
          <p>No submissions yet.</p>
        )}
      </ul>
    </div>
  );
};

export default QuestDetails;
