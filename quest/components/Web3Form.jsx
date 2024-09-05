"use client";

import { useState, useEffect } from "react";
import { GearApi } from "@gear-js/api";
import {
  web3Enable,
  web3Accounts,
  web3FromSource,
} from "@polkadot/extension-dapp";
import DropDownSelection from "@/components/info-quest/DropDownSelection";
import { Program } from "@/lib/infoQuest";
import { useRouter } from "next/navigation";

const accountOptions = [
  {
    title: "web3",
    description: "Control your own secrets with web3 wallet.",
  },
  {
    title: "email",
    description:
      "We will handle the web3 wallet management for you, but you can always change to web3 wallet login.",
  },
];

const submissionOptions = [
  {
    title: "Text",
    description: "Only accept text format submissions from participants.",
  },
  {
    title: "Link",
    description: "Quest participants need to submit a link to their work.",
  },
];

const INFO_QUEST_ID =
  "0x05e823722bb816108771a3870a2c6de996be28c9193775733a310a6b4903cc3b";

const Web3Form = () => {
  const [gearApi, setGearApi] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [connected, setConnected] = useState(false);
  const [loginMethod, setLoginMethod] = useState("web3");
  const [formData, setFormData] = useState({
    loginMethod: "",
    deadline: 0,
    title: "",
    description: "",
    submissionRequirements: "",
    submissionType: "",
    rewardAmount: 0,
  });
  const router = useRouter();

  useEffect(() => {
    const connectToGearApi = async () => {
      try {
        // Initialize the Gear API
        const api = await GearApi.create({
          providerAddress: "wss://testnet.vara.network",
        });
        setGearApi(api);
        console.log("Connected to Vara testnet");
      } catch (error) {
        console.error("Failed to connect to Gear API:", error);
      }
    };

    connectToGearApi();
  }, []);

  const connectWallet = async () => {
    try {
      // Enable the Polkadot.js extension
      const extensions = await web3Enable("My Gear App");
      if (extensions.length === 0) {
        console.log("No extension found");
        return;
      }

      // Get all accounts from the extension
      const allAccounts = await web3Accounts();
      setAccounts(allAccounts);

      if (allAccounts.length > 0) {
        setSelectedAccount(allAccounts[0]);
        setConnected(true);
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  const handleAccountChange = (event) => {
    const account = accounts.find((acc) => acc.address === event.target.value);
    setSelectedAccount(account);
  };

  async function handleSubmit(e) {
    e.preventDefault();

    const data = new FormData(e.target);

    // Change the deadline to block height.
    const formDeadline = data.get("deadline");
    const parsedDeadline = new Date(formDeadline);
    const now = new Date();
    const diffMilli = parsedDeadline - now;
    const diffSeconds = Math.floor(diffMilli / 1000);
    const deadlineBlock = Math.floor(diffSeconds / 3);

    const submissionData = {
      login_method: formData.loginMethod,
      deadline: deadlineBlock,
      title: data.get("quest-title"),
      description: data.get("quest-description"),
      submission_requirements: data.get("submission-requirements"),
      submission_type: formData.submissionFormat,
      reward_amount: Number(data.get("reward")),
    };
    console.log(submissionData);
    setFormData(submissionData);

    const infoQuest = new Program(gearApi, INFO_QUEST_ID);
    const transaction = infoQuest.infoQuestSvc.publish({ ...submissionData });
    const injector = await web3FromSource(selectedAccount.meta.source);
    transaction.withAccount(selectedAccount.address, {
      signer: injector.signer,
    });
    transaction.withValue(submissionData.reward_amount * 1000000000000);

    await transaction.calculateGas();
    const { msgId, blockHash, response } = await transaction.signAndSend();

    await response();
    router.push("/management");
  }

  return (
    <div className="flex flex-col w-full">
      <div>
        {!connected && loginMethod == "web3" && (
          <div>
            <button
              onClick={connectWallet}
              className="border border-solid w-full px-4 py-1 mb-2 bg-custom-accent text-custom-primary rounded-full"
            >
              Connect Wallet
            </button>
          </div>
        )}
        {connected && (
          <div>
            <select className="max-w-lg rounded-full px-4 py-1 mb-2 bg-custom-secondary text-custom-primary" onChange={handleAccountChange}>
              {accounts.map((account) => (
                <option key={account.address} value={account.address}>
                  {account.meta.name || "Unnamed Account"}: {account.address}
                </option>
              ))}
            </select>
          </div>
        )}
        {loginMethod == "email" && (
          <div>
            <input
              type="email"
              placeholder="Input your email to publish quest"
              className="w-full mb-2 border border-solid border-custom-accent px-4 py-1 rounded-full text-custom-primary bg-custom-secondary"
            ></input>
          </div>
        )}
      </div>
      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="border border-custom-primary shadow-sm ring-1 ring-gray-900/5 max-w-lg sm:rounded-xl md:col-span-2"
      >
        <div className="px-4 py-6 sm:p-8">
          <div className="grid max-w-2xl grid-cols-2 gap-x-6 gap-y-8">
            <div className="col-span-1">
              <div>
                <label
                  htmlFor="login-method"
                  className="text-sm font-medium leading-6 text-custom-primary"
                >
                  Select Publication Method
                </label>
                <div className="mt-2" id="login-method">
                  <DropDownSelection
                    selectionOptions={accountOptions}
                    onChange={(value) => {
                      setLoginMethod(value);
                      setFormData({ ...formData, loginMethod: value });
                    }}
                  />
                  {console.log(loginMethod)}
                </div>
              </div>
            </div>
            <div className="col-span-1">
              <div>
                <label
                  htmlFor="deadline"
                  className="text-sm font-medium leading-6 text-custom-primary"
                >
                  Choose deadline
                </label>
                <input
                  type="Date"
                  className="rounded-lg mt-2"
                  id="deadline"
                  name="deadline"
                />
              </div>
            </div>
            <div className="col-span-full">
              <label
                htmlFor="quest-title"
                className="text-sm font-medium leading-6 text-custom-primary"
              >
                Quest Title
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-custom-primary focus-within:ring-2 focus-within:ring-inset focus-within:ring-custom-accent">
                  <input
                    id="quest-title"
                    name="quest-title"
                    type="text"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-custom-accent placeholder:text-custom-gray focus:ring-0 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>

            <div className="col-span-full">
              <label
                htmlFor="quest-description"
                className="block text-sm font-medium leading-6 text-custom-primary"
              >
                Quest Description
              </label>
              <div className="mt-2">
                <textarea
                  id="quest-description"
                  name="quest-description"
                  rows={3}
                  className="block w-full rounded-md border-0 bg-transparent py-1.5 text-custom-accent shadow-sm ring-1 ring-inset ring-custom-primary placeholder:text-custom-gray focus:ring-2 focus:ring-inset focus:ring-custom-accent sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div className="col-span-1">
              <label
                htmlFor="submission-requirements"
                className="block text-sm font-medium leading-6 text-custom-primary"
              >
                Submission Requirements
              </label>
              <div className="mt-2">
                <textarea
                  id="submission-requirements"
                  name="submission-requirements"
                  rows={5}
                  className="block w-full rounded-md border-0 bg-transparent py-1.5 text-custom-accent shadow-sm ring-1 ring-inset ring-custom-primary placeholder:text-custom-gray focus:ring-2 focus:ring-inset focus:ring-custom-accent sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div className="col-span-1">
              <div>
                <label
                  htmlFor="submission-format"
                  className="text-sm font-medium leading-6 text-custom-primary"
                >
                  Submission format
                </label>
                <div
                  className="mt-2"
                  id="submission-format"
                  name="submission-format"
                >
                  <DropDownSelection
                    selectionOptions={submissionOptions}
                    onChange={(value) => {
                      setLoginMethod(value);
                      setFormData({ ...formData, submissionFormat: value });
                    }}
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="reward"
                  className="text-sm font-medium leading-6 text-custom-primary"
                >
                  Reward in TVARA
                </label>
                <input
                  type="number"
                  className="rounded-lg focus:ring-0 focus:ring-custom-accent"
                  id="reward"
                  name="reward"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
          <button
            type="button"
            className="text-sm font-semibold leading-6 text-custom-primary"
          >
            Reset
          </button>
          <button
            type="submit"
            className="rounded-full bg-custom-primary px-6 py-2 border border border-custom-accent text-sm font-semibold text-custom-black shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Publish Quest
          </button>
        </div>
      </form>
    </div>
  );
};

export default Web3Form;
