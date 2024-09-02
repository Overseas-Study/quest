import FullQuestCard from "./FullQuestCard";
import SubmissionCard from "./SubmissionCard";

const QuestDetails = ({ title }) => {
    // Retrieve detailed information for display, including quest details and submission details.
    const get_quest = async () => {
        // A silly await function to simulate fetching data from an API
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(console.log("Quest details fetched"));
            }, 1000);
        });
    };

    get_quest().then((res) => console.log("Fetch completed."));

    return (
        <div className="flex gap-x-1">
            <div>
                <FullQuestCard
                    status="Status"
                    rewardAmount="Reward Amount"
                    title={title}
                    deadline="Deadline"
                    publisher="Publisher"
                    description="Description"
                    submissionType="Submission Type"
                    requirements="Requirements"
                />
            </div>
            <div>
                <SubmissionCard
                    participant="Participant"
                    link="Link"
                    decision="Decision"
                />
            </div>
        </div>
    );
}

export default QuestDetails;