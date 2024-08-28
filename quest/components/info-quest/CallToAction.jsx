import { ChevronDoubleRightIcon } from "@heroicons/react/24/outline";

const CallToAction = () => {
    return (
        <div className="flex items-center justify-between rounded-lg bg-custom-accent text-custom-primary px-6 py-6 gap-x-4 w-full">
            <p>Publish quest easily with our form</p>
            <ChevronDoubleRightIcon className="h-5 w-5 text-custom-primary" />
        </div>
    );
};

export default CallToAction;