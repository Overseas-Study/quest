import Link from "next/link";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";

const SubmissionCard = ({ participant, link, decision }) => {
  return (
    <div className="grid grid-cols-4 max-w-md bg-custom-primary p-4 rounded-lg">
      <div className="col-span-1">
        <img src="/submissionLogo.svg" alt="logo" />
      </div>
      <div className="col-span-3">
        <div className="flex flex-col">
          <p className="text-sm text-custom-secondary">
            <span className="text-custom-gray">Participant: </span>
            {participant}
          </p>
          <div className="flex items-center gap-x-1">
            <Link href={link} className="text-sm text-custom-accent">
              Link
            </Link>
            <ArrowTopRightOnSquareIcon className="h-4 w-4 text-custom-accent" />
          </div>
          <div className="flex justify-between">
            <p className="text-sm text-custom-secondary">
              <span className="text-custom-gray">Decision: </span>
              {decision}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmissionCard;
