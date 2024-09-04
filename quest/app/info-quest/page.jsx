import CallToAction from "@/components/info-quest/CallToAction";
import ExampleQuest from "@/components/info-quest/ExampleQuest";
import Web3Form from "@/components/Web3Form";
import {
  AcademicCapIcon,
  BuildingStorefrontIcon,
  MicrophoneIcon,
  ClipboardDocumentListIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";

export default function Page() {
  return (
    <div className="flex">
      {/* The left-side pannel on the information quest page */}
      <div className="flex flex-col items-center mr-12">
        <p className="text-custom-primary text-4xl mb-4">
          <span className="text-custom-accent">Information</span> QUEST
        </p>
        <CallToAction />
        <div className="flex flex-col gap-y-4 mt-16">
          <ExampleQuest
            Icon={AcademicCapIcon}
            tagLine="How is it like studying in xx university?"
          />
          <ExampleQuest
            Icon={BuildingStorefrontIcon}
            tagLine="What is the price of tomatoes in your region?"
          />
          <ExampleQuest
            Icon={MicrophoneIcon}
            tagLine="What really happens in x?"
          />
          <ExampleQuest
            Icon={ClipboardDocumentListIcon}
            tagLine="Fill out this survey to get rewards!"
          />
          <ExampleQuest
            Icon={MapPinIcon}
            tagLine="Can anyone gives us a travel guide in x country?"
          />
        </div>
      </div>
      {/* The information quest form */}
      <div>
        <Web3Form />
      </div>
    </div>
  );
}
