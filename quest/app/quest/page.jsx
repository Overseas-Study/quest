import Header from "@/components/Header";
import QuestTypeSelection from "@/components/QuestTypeSelection";

export default function Quest() {
  return (
    <div className="flex flex-col gap-y-4">
      <Header />
      <div>
        <QuestTypeSelection />
      </div>
    </div>
  );
}
