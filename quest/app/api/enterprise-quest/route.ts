import { NextRequest, NextResponse } from "next/server";
import { GearApi } from "@gear-js/api";
import { Program } from "../../../lib/infoQuest";
import { Keyring } from "@polkadot/api";

const INFO_QUEST_ID =
  "0x726db3a23fc98b838572bfcc641776dd9f510071f400d77fac526266c0fcdca7";

export const POST = async (req: NextRequest) => {
  try {
    const questAction = req.nextUrl.searchParams.get("action");
    if (!questAction) {
      return new NextResponse(
        JSON.stringify({ message: "No action provided." }),
        { status: 400 }
      );
    }

    const body = await req.json();

    // Connect to gear API.
    const gearApi = await GearApi.create({
      providerAddress: "wss://testnet.vara.network",
    });
    // Connect to smart contract.
    const quest = new Program(gearApi, INFO_QUEST_ID);

    switch (questAction) {
      case "publish":
        // Generate keypair to mock a quest publisher.
        const publisherKeyring = new Keyring({ type: "sr25519" });
        const publisherPair = publisherKeyring.addFromUri("//Alice");
        const questPublishingData = {
          login_method: body.loginMethod,
          deadline: body.deadline,
          title: body.title,
          description: body.description,
          submission_requirements: body.submissionRequirements,
          submission_type: body.submissionType,
          reward_amount: body.rewardAmount,
        };
        const publishTx = quest.infoQuestSvc.publish({
          ...questPublishingData,
        });
        publishTx.withAccount(publisherPair);
        publishTx.withValue(
          BigInt(questPublishingData.reward_amount) * BigInt(1000000000000)
        );
        await publishTx.calculateGas();
        const { msgId, blockHash, response } = await publishTx.signAndSend();

        await response();

        return new NextResponse(
          JSON.stringify({
            message: `Quest published. Block hash: ${blockHash}. Message ID: ${msgId}`,
          }),
          { status: 200 }
        );
      case "submit":
        // Get quest ID from the URL.
        const questId = req.nextUrl.searchParams.get("questId");
        // Get submission from the body.
        const submission = body.submission;
        // Generate keypair to mock a quest participant.
        const participantKeyring = new Keyring({ type: "sr25519" });
        const participantPair = participantKeyring.addFromUri("//Bob");

        const submitTx = quest.infoQuestSvc.submit(submission, questId);
        submitTx.withAccount(participantPair);
        await submitTx.calculateGas();
        await submitTx.signAndSend();

        return new NextResponse(
          JSON.stringify({ message: "Submission sent." }),
          { status: 200 }
        );
    }
  } catch (err) {
    return new NextResponse(
      JSON.stringify({
        message: `Error in API enterprise quest: ${err.message}`,
      }),
      { status: 500 }
    );
  }
};
