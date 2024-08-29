"use client";

import { useState, useEffect } from "react";
import { GearApi } from "@gear-js/api";
import { web3Enable, web3Accounts } from "@polkadot/extension-dapp";
import DropDownSelection from "@/components/info-quest/DropDownSelection";

const accountOptions = [
  {
    title: "Web3 Wallet",
    description: "Control your own secrets with web3 wallet.",
  },
  {
    title: "Email",
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

const Web3Form = () => {
  const [gearApi, setGearApi] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [connected, setConnected] = useState(false);
  const [loginMethod, setLoginMethod] = useState("");
  const [formData, setFormData] = useState({
    loginMethod: "",
    deadline: "",
    questTitle: "",
    questDescription: "",
    submissionRequirements: "",
    submissionFormat: "",
    reward: "",
  });

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

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData(e.target);

    const submissionData = {
      loginMethod: formData.loginMethod,
      deadline: data.get("deadline"),
      questTitle: data.get("quest-title"),
      questDescription: data.get("quest-description"),
      submissionRequirements: data.get("submission-requirements"),
      submissionFormat: formData.submissionFormat,
      reward: data.get("reward"),
    };

    console.log(submissionData);
  };

  return (
    <div className="flex flex-col w-full">
      <div>
        <h2>Gear Wallet Connection</h2>
        {!connected && loginMethod == "Web3 Wallet" ? (
          <button onClick={connectWallet}>Connect Wallet</button>
        ) : (
          <div>
            <p>Connected Account: {selectedAccount?.address}</p>
            <select onChange={handleAccountChange}>
              {accounts.map((account) => (
                <option key={account.address} value={account.address}>
                  {account.meta.name || "Unnamed Account"} ({account.address})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="border border-custom-primary shadow-sm ring-1 ring-gray-900/5 w-1/2 sm:rounded-xl md:col-span-2"
      >
        <div className="px-4 py-6 sm:p-8">
          <div className="grid max-w-2xl grid-cols-2 gap-x-6 gap-y-8">
            <div className="col-span-1">
              <div>
                <label
                  htmlFor="login-method"
                  className="text-sm font-medium leading-6 text-custom-primary"
                >
                  Select Your Login Method
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
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-custom-primary focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                  <input
                    id="quest-title"
                    name="quest-title"
                    type="text"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-custom-gray placeholder:text-custom-gray focus:ring-0 sm:text-sm sm:leading-6"
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
                  className="block w-full rounded-md border-0 bg-transparent py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-custom-primary placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
                  className="block w-full rounded-md border-0 bg-transparent py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-custom-primary placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
                  Reward in USDT
                </label>
                <input
                  type="number"
                  className="rounded-lg"
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
